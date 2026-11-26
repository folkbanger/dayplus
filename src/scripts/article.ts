// Article: reading progress line, table of contents (open/close, active section), Copy link.
export {};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const toc = document.getElementById('toc');
const prog = document.getElementById('prog');
const art = document.querySelector('article.body') as HTMLElement | null;

// Phones start with the contents closed; desktop keeps them open in the side column.
if (toc) {
  const btn = toc.querySelector('button') as HTMLButtonElement;
  const setOpen = (o: boolean) => { toc.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); };
  if (!matchMedia('(min-width: 960px)').matches) setOpen(false);
  btn.addEventListener('click', () => setOpen(!toc.classList.contains('open')));
}

const links = toc ? [...toc.querySelectorAll<HTMLAnchorElement>('a')] : [];
const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
links.forEach((a, i) =>
  a.addEventListener('click', (e) => {
    const h = heads[i];
    if (!h) return;
    e.preventDefault();
    h.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.hash);
  }),
);

let tick = false;
const onScroll = () => {
  tick = false;
  if (art && prog) {
    const r = art.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.3 - r.top) / (r.height - innerHeight * 0.4)));
    prog.style.transform = `scaleX(${p})`;
  }
  let k = 0;
  heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top < 140) k = i; });
  links.forEach((a, i) => a.classList.toggle('on', i === k));
};
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

const share = document.getElementById('share');
share?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href.split('#')[0]); share.textContent = 'Copied'; }
  catch { share.textContent = 'Copy failed'; }
  setTimeout(() => (share.textContent = 'Copy link'), 1600);
});
