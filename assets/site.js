/* GSLT 공통 모듈 — Firebase 초기화, 메뉴 설정, 서브페이지 헤더/푸터 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore, collection, doc, getDoc, getDocs, query, where
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok',
  authDomain: 'gslthomepage.firebaseapp.com',
  projectId: 'gslthomepage',
  storageBucket: 'gslthomepage.firebasestorage.app',
  messagingSenderId: '246741560840',
  appId: '1:246741560840:web:007e7216e2c0a732412bbd'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const CATEGORY_LABEL = {
  news: '뉴스',
  portfolio: '포트폴리오',
  downloads: '자료실'
};

const DEFAULT_MENUS = { news: true, downloads: true, portfolio: true };

/* 메뉴 노출 설정 로드 (10분 캐시 + 실패 시 기본값 폴백) */
const MENU_CACHE_TTL = 10 * 60 * 1000;

export async function getMenus() {
  try {
    const cached = JSON.parse(sessionStorage.getItem('gslt-menus') || 'null');
    if (cached && cached.menus && Date.now() - cached.t < MENU_CACHE_TTL) return cached.menus;
  } catch (e) { /* sessionStorage 불가 환경 무시 */ }
  try {
    const snap = await getDoc(doc(db, 'settings', 'menus'));
    const menus = snap.exists() ? { ...DEFAULT_MENUS, ...snap.data() } : DEFAULT_MENUS;
    try { sessionStorage.setItem('gslt-menus', JSON.stringify({ t: Date.now(), menus })); } catch (e) { }
    return menus;
  } catch (e) {
    return DEFAULT_MENUS;
  }
}

/* data-menu 속성이 붙은 링크를 설정에 따라 표시/숨김 */
export async function applyMenuVisibility(root = document) {
  const menus = await getMenus();
  root.querySelectorAll('[data-menu]').forEach(el => {
    const key = el.getAttribute('data-menu');
    if (menus[key] === false) el.style.display = 'none';
  });
}

/* 게시글 목록 (익명 — 게시된 글만, 최신순 정렬은 클라이언트에서) */
export async function fetchPosts(category) {
  const q = query(
    collection(db, 'posts'),
    where('category', '==', category),
    where('published', '==', true)
  );
  const snap = await getDocs(q);
  const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // 고정 글 우선, 이후 최신순
  posts.sort((a, b) =>
    (b.pinned === true) - (a.pinned === true) ||
    (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return posts;
}

export function formatDate(ts) {
  if (!ts || !ts.seconds) return '';
  const d = new Date(ts.seconds * 1000);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}. ${p(d.getMonth() + 1)}. ${p(d.getDate())}`;
}

export function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* ─── 서브페이지 공통 헤더 ─── */
export function renderHeader(active = '') {
  const el = document.getElementById('site-header');
  if (!el) return;
  const link = (href, key, label) => {
    const cls = active === key
      ? 'text-gslt-600'
      : 'text-slate-600 hover:text-gslt-600 transition-colors';
    const dataAttr = ['news', 'downloads', 'portfolio'].includes(key) ? ` data-menu="${key}"` : '';
    return `<a href="${href}"${dataAttr} class="${cls}">${label}</a>`;
  };
  el.innerHTML = `
  <nav class="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between h-16 relative">
      <a href="index.html" class="flex items-center h-8 z-10">
        <img src="img/gslt-logo-color.png" alt="GSLT" class="h-full w-auto object-contain">
      </a>
      <div class="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10 text-sm font-bold">
        ${link('index.html', 'home', '홈')}
        ${link('about.html', 'about', '회사소개')}
        ${link('news.html', 'news', '뉴스')}
        ${link('downloads.html', 'downloads', '자료실')}
        ${link('portfolio.html', 'portfolio', '포트폴리오')}
      </div>
      <a href="index.html#contact"
        class="hidden md:flex items-center gap-2 bg-gslt-500 hover:bg-gslt-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 z-10">
        도입 문의
      </a>
    </div>
    <div class="md:hidden border-t border-slate-100 bg-white/95">
      <div class="flex items-center gap-6 px-4 py-2.5 text-sm font-bold overflow-x-auto whitespace-nowrap">
        ${link('index.html', 'home', '홈')}
        ${link('about.html', 'about', '회사소개')}
        ${link('news.html', 'news', '뉴스')}
        ${link('downloads.html', 'downloads', '자료실')}
        ${link('portfolio.html', 'portfolio', '포트폴리오')}
      </div>
    </div>
  </nav>`;
  applyMenuVisibility(el);
}

/* ─── 스크롤 투 탑 버튼 (전 페이지 공통) ─── */
export function initScrollTop() {
  if (document.getElementById('scroll-top-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'scroll-top-btn';
  btn.setAttribute('aria-label', '맨 위로');
  btn.textContent = 'TOP';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:40;width:48px;height:48px;'
    + 'border-radius:999px;background:rgba(255,255,255,.95);border:1px solid #e2e8f0;'
    + 'box-shadow:0 4px 16px rgba(0,0,0,.12);font-size:11px;font-weight:800;letter-spacing:.08em;'
    + 'color:#475569;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
  const onScroll = () => {
    const show = window.scrollY > 600;
    btn.style.opacity = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── 서브페이지 공통 푸터 ─── */
export function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
  <footer class="pt-14 pb-8 bg-[#050505] text-slate-400 border-t border-white/5 mt-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-start gap-10 pb-10 border-b border-white/5">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <img src="img/gslt-logo-white.png" alt="GSLT" class="h-7 w-auto object-contain">
            <span class="text-xs font-medium border-l border-white/10 pl-3 text-slate-500 uppercase tracking-widest">IoT Space Builder</span>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed break-keep max-w-xs">무선 IoT 구축 전문기업.<br>오피스·주거·빌딩을 배선 공사 없이 스마트 공간으로 완성합니다.</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-10 text-sm">
          <div>
            <p class="text-white font-semibold mb-3 text-xs uppercase tracking-wider">솔루션</p>
            <ul class="space-y-2">
              <li><a href="siot.html" class="hover:text-white transition-colors">시옷 (Siot)</a></li>
              <li><a href="bizmoa.html" class="hover:text-white transition-colors">비즈모아 (BizMoa)</a></li>
              <li><a href="dailo.html" class="hover:text-white transition-colors">다일로 (Dailo)</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white font-semibold mb-3 text-xs uppercase tracking-wider">소식</p>
            <ul class="space-y-2">
              <li><a href="news.html" data-menu="news" class="hover:text-white transition-colors">뉴스</a></li>
              <li><a href="downloads.html" data-menu="downloads" class="hover:text-white transition-colors">자료실</a></li>
              <li><a href="portfolio.html" data-menu="portfolio" class="hover:text-white transition-colors">포트폴리오</a></li>
            </ul>
          </div>
          <div>
            <p class="text-white font-semibold mb-3 text-xs uppercase tracking-wider">법적 고지</p>
            <ul class="space-y-2">
              <li><a href="index.html?open=terms" class="hover:text-white transition-colors">서비스 약관</a></li>
              <li><a href="index.html?open=privacy" class="hover:text-white transition-colors">개인정보 처리방침</a></li>
              <li><a href="index.html?open=support" class="hover:text-white transition-colors">고객 지원</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="pt-7 flex flex-col md:flex-row justify-between items-start gap-4">
        <div class="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <p><span class="text-slate-500 font-medium">상호</span> &nbsp;지에스엘티(GSLT) &nbsp;|&nbsp; <span class="text-slate-500 font-medium">대표자</span> &nbsp;최광수 &nbsp;|&nbsp; <span class="text-slate-500 font-medium">사업자등록번호</span> &nbsp;707-81-03107</p>
          <p><span class="text-slate-500 font-medium">주소</span> &nbsp;경기도 성남시 중원구 둔촌대로 388번길 24, 우림라이온스밸리 3차 501호</p>
          <p><span class="text-slate-500 font-medium">Tel</span> &nbsp;070-4659-4804 &nbsp;|&nbsp; <span class="text-slate-500 font-medium">Email</span> &nbsp;<a href="mailto:gs7078103107@gmail.com" class="hover:text-white transition-colors">gs7078103107@gmail.com</a></p>
        </div>
        <p class="text-xs text-slate-700 mt-1 md:mt-0 shrink-0">&copy; 2025 GSLT. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
  applyMenuVisibility(el);
  initScrollTop();
}
