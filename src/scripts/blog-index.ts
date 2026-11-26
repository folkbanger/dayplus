// Blog index: search, Load more (9 at a time on desktop, 8 on phones) and the row reveal.
import { coverHtml, type Topic } from '../lib/topics';

type Card = { url: string; title: string; description: string; topic: Topic; date: string; minutes: number; flag: string };

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DESK = matchMedia('(min-width: 960px)').matches;
const PER = DESK ? 9 : 8;

const list = document.getElementById('list') as HTMLElement;
const feat = document.getElementById('feat');
const more = document.getElementById('more') as HTMLElement;
const moreBtn = document.getElementById('moreBtn') as HTMLButtonElement;
const moreInfo = document.getElementById('moreInfo') as HTMLElement;
const empty = document.getElementById('empty') as HTMLElement;
const count = document.getElementById('count');
const input = document.getElementById('q') as HTMLInputElement;

const topic = list.dataset.topic || '';
const start = Number(list.dataset.start || 0);
const total = Number(list.dataset.total || 0); // posts in this listing, not counting the featured one
const initialHtml = list.innerHTML;
const initialCount = count?.textContent ?? '';

const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
  { rootMargin: '0px 0px 120px 0px' },
);
const watch = () => list.querySelectorAll('.row:not(.in)').forEach((r) => (RM ? r.classList.add('in') : io.observe(r)));

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const rowHtml = (p: Card) =>
  `<a class="row" href="${p.url}">${coverHtml(p.topic)}<div class="tx"><span class="tag">${p.topic}</span>${p.flag ? `<span class="flag">${p.flag}</span>` : ''}<h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="meta">${p.date}<i></i>${p.minutes} min</div></div></a>`;

let all: Card[] | null = null;
const load = async () => {
  if (!all) {
    const r = await fetch('/blog/posts.json');
    const data: Card[] = await r.json();
    all = topic ? data.filter((p) => p.topic === topic) : data;
  }
  return all;
};

// Browse mode: the rows after the featured post, in pages. Search mode: every match.
let items: Card[] = [];
let shown = 0;
let searching = false;

const setMore = (n: number, of: number) => {
  more.classList.toggle('hide', n >= of);
  moreInfo.textContent = `Showing ${Math.min(n, of)} of ${of}`;
};

// Start: phones show 8 of the server's 9 rows.
{
  const rows = [...list.querySelectorAll('.row')];
  shown = Math.min(rows.length, PER);
  rows.slice(PER).forEach((r) => r.remove());
  setMore(start + shown, total);
  watch();
}

moreBtn.addEventListener('click', async () => {
  const data = await load();
  if (!searching) items = data.slice(1);
  const from = searching ? shown : start + shown;
  const next = items.slice(from, from + PER);
  list.insertAdjacentHTML('beforeend', next.map(rowHtml).join(''));
  shown += next.length;
  setMore(searching ? shown : start + shown, items.length);
  watch();
});

let timer = 0;
input?.addEventListener('input', () => {
  clearTimeout(timer);
  timer = window.setTimeout(async () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      searching = false;
      list.innerHTML = initialHtml;
      feat?.classList.remove('hide');
      empty.classList.add('hide');
      if (count) count.textContent = initialCount;
      const rows = [...list.querySelectorAll('.row')];
      rows.slice(PER).forEach((r) => r.remove());
      shown = Math.min(rows.length, PER);
      setMore(start + shown, total);
      watch();
      return;
    }
    const data = await load();
    searching = true;
    items = data.filter((p) => `${p.title} ${p.description} ${p.topic}`.toLowerCase().includes(q));
    feat?.classList.add('hide');
    list.innerHTML = items.slice(0, PER).map(rowHtml).join('');
    shown = Math.min(items.length, PER);
    empty.classList.toggle('hide', items.length > 0);
    if (count) count.textContent = `${items.length} article${items.length === 1 ? '' : 's'}`;
    setMore(shown, items.length);
    watch();
  }, 150);
});
