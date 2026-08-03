#!/usr/bin/env python3
"""로컬 미리보기용 정적 서버.

python -m http.server는 HTTP Range 요청을 지원하지 않아 브라우저가 영상을 탐색(seek)하지 못한다.
히어로의 스크롤 스크럽은 currentTime 탐색에 전적으로 의존하므로, 로컬에서도 GitHub Pages와
동일하게 Range를 처리해 줘야 실제 동작을 확인할 수 있다.

    python3 scripts/dev-server.py [port]
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)$")


class RangeHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        header = self.headers.get("Range")
        if not header:
            return super().send_head()

        match = RANGE_RE.match(header.strip())
        if not match:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            handle = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(handle.fileno()).st_size
        first, last = match.group(1), match.group(2)

        if first:
            start = int(first)
            end = int(last) if last else size - 1
        else:
            # 접미 범위(bytes=-500): 마지막 N바이트
            if not last:
                handle.close()
                self.send_error(400, "Invalid Range")
                return None
            start = max(0, size - int(last))
            end = size - 1

        if start >= size or start > end:
            handle.close()
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        end = min(end, size - 1)
        handle.seek(start)
        self.range_remaining = end - start + 1

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(self.range_remaining))
        self.end_headers()
        return handle

    def copyfile(self, source, outputfile):
        remaining = getattr(self, "range_remaining", None)
        if remaining is None:
            return super().copyfile(source, outputfile)
        self.range_remaining = None
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    print("serving %s on http://localhost:%d (Range 지원)" % (os.getcwd(), port))
    # keep-alive 연결이 서로를 막지 않도록 스레딩 서버를 쓴다
    ThreadingHTTPServer(("127.0.0.1", port), RangeHandler).serve_forever()
