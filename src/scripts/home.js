// Home page interactions, ported from day-plus-home-MAIN-dark-to-light.html.
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DARK = matchMedia('(prefers-color-scheme: dark)');
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// Loader ring: 0–100% "of today", once per visit (boot.js adds .ld).
(() => {
  const ld = $('#ld');
  if (!ld) return;
  if (!document.documentElement.classList.contains('ld')) { ld.remove(); return; }
  const n = $('#ln'), fg = ld.querySelector('.fg');
  const t0 = performance.now(), D = 1300;
  const step = (t) => {
    const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3);
    n.textContent = Math.round(e * 100);
    fg.style.strokeDashoffset = 226 * (1 - e);
    if (p < 1) requestAnimationFrame(step);
    else setTimeout(() => { ld.classList.add('out'); setTimeout(() => ld.remove(), 700); }, 250);
  };
  requestAnimationFrame(step);
})();

// Dot field in the hero: a slow wave, teal near the finger or pointer.
(() => {
  const c = $('#dots');
  if (!c) return;
  const x = c.getContext('2d');
  let W, H, pts = [], px = -999, py = -999;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const size = () => {
    W = c.clientWidth; H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    const g = 20;
    for (let yy = g / 2; yy < H; yy += g) for (let xx = g / 2; xx < W; xx += g) pts.push([xx, yy]);
  };
  size();
  addEventListener('resize', size);
  const mv = (e) => { const r = c.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; px = p.clientX - r.left; py = p.clientY - r.top; };
  c.parentElement.addEventListener('pointermove', mv);
  c.parentElement.addEventListener('touchmove', mv, { passive: true });
  let visible = true;
  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was && !RM) requestAnimationFrame(draw); }).observe(c);
  // Dots are grouped by colour and by one of 24 opacity steps, so each frame fills a few
  // dozen paths instead of one per dot (same look, a fraction of the work on phones).
  const STEPS = 24;
  const draw = (t) => {
    x.clearRect(0, 0, W, H);
    const tt = t / 1000;
    const wb = Array.from({ length: STEPS }, () => new Path2D()), tb = Array.from({ length: STEPS }, () => new Path2D());
    for (const [a, b] of pts) {
      const fade = Math.min(1, b / 120) * Math.max(0, 1 - (b - H * 0.55) / (H * 0.45));
      if (fade <= 0) continue;
      const wave = 0.5 + 0.5 * Math.sin(a * 0.018 + b * 0.012 - tt * 0.9);
      const dx = a - px, dy = b - py;
      const near = dx * dx + dy * dy < 12100 ? Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 110) : 0;
      const al = Math.min(1, (0.12 + 0.16 * wave * wave + 0.7 * near) * fade);
      const k = Math.min(STEPS - 1, Math.round(al * (STEPS - 1)));
      const r = 0.6 + near * 0.9;
      const path = (near > 0.05 ? tb : wb)[k];
      path.moveTo(a + r, b); path.arc(a, b, r, 0, 6.283);
    }
    for (let k = 1; k < STEPS; k++) {
      const al = k / (STEPS - 1);
      x.fillStyle = `rgba(255,255,255,${al})`; x.fill(wb[k]);
      x.fillStyle = `rgba(79,209,219,${al})`; x.fill(tb[k]);
    }
    if (!RM && visible) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

// Rotating word with a blur swap.
(() => {
  const R = $('.rot'), w = $$('#rot i');
  if (!R || !w.length) return;
  let i = 0;
  const fit = () => { R.style.width = w[i].offsetWidth + 'px'; };
  fit();
  addEventListener('resize', fit);
  if (document.fonts) document.fonts.ready.then(fit);
  if (RM) return;
  setInterval(() => {
    const a = w[i];
    a.classList.remove('on'); a.classList.add('out');
    setTimeout(() => a.classList.remove('out'), 520);
    i = (i + 1) % w.length;
    w[i].classList.add('on');
    fit();
  }, 2400);
})();

// "Watch your day fill up" demo: the visitor's local time, and the 100% moment.
(() => {
  const box = $('#habits'), bar = $('#bar'), meter = $('#meter');
  if (!box) return;
  const btns = [...box.children], segs = [...bar.children], N = btns.length;
  let shown = 0;
  const upd = () => {
    const on = btns.map((b) => b.classList.contains('on'));
    const n = on.filter(Boolean).length;
    segs.forEach((s, i) => { s.style.width = on[i] ? 100 / N + '%' : '0'; });
    $('#cnt').textContent = `${n} of ${N} done`;
    $('#full').classList.toggle('on', n === N);
    if (n === N && !meter.dataset.full && !RM) {
      meter.classList.remove('party'); void meter.offsetWidth; meter.classList.add('party');
      setTimeout(() => meter.classList.remove('party'), 1700);
    }
    meter.dataset.full = n === N ? '1' : '';
    const to = Math.round((n / N) * 100), from = shown, t0 = performance.now();
    const st = (t) => {
      const p = RM ? 1 : Math.min(1, (t - t0) / 450);
      shown = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      $('#pct').textContent = shown;
      if (p < 1) requestAnimationFrame(st);
    };
    requestAnimationFrame(st);
  };
  btns.forEach((b) => {
    b.addEventListener('click', () => {
      const on = b.classList.toggle('on');
      b.setAttribute('aria-pressed', String(on));
      if (on) b.querySelector('.tm').textContent = 'Done · ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      upd();
    });
  });
})();

// Reveal on scroll.
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); e.target.dispatchEvent(new Event('reveal')); }
}), { threshold: 0.2 });
$$('.up').forEach((el) => io.observe(el));
$('#tilesBox')?.addEventListener('reveal', () => {
  const b = $$('#tilesBox .tiles b');
  setTimeout(() => b[2].classList.add('s'), RM ? 0 : 600);
  setTimeout(() => { b[3].classList.add('f'); b[4].classList.add('f'); }, RM ? 0 : 1200);
});

// FAQ.
$$('.q button').forEach((b) => b.addEventListener('click', () => {
  const open = b.closest('.q').classList.toggle('open');
  b.setAttribute('aria-expanded', String(open));
}));

// Liquid glass pill: the highlight follows the pointer, or drifts on its own.
(() => {
  const g = $('#lg');
  if (!g) return;
  const set = (x, y) => { g.style.setProperty('--mx', x + '%'); g.style.setProperty('--my', y + '%'); };
  g.addEventListener('pointermove', (e) => {
    const r = g.getBoundingClientRect();
    set(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)), Math.max(-50, Math.min(150, ((e.clientY - r.top) / r.height) * 100)));
  });
  // The drift itself is a CSS animation (lgDrift); pointer moves take over while hovering.
  g.addEventListener('pointerleave', () => { g.style.removeProperty('--mx'); g.style.removeProperty('--my'); });
})();

// Scroll: hero phone tilt, header tint, and the spinning-phone showcase.
(() => {
  const hp = $('#heroPhone'), nav = $('#nav'), show = $('#show'), light = $('#light');
  const caps = $$('.cap'), scr = $$('.p3 .scr'), pips = $$('.pips i');
  const P3 = $('#p3'), SH = $('#sh3');
  const ez = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  // One full turn between steps; the screen changes while the back faces the viewer.
  const spinAt = (t) => {
    const b = Math.round(t), d = t - b;
    if (b >= 1 && b <= 4 && Math.abs(d) < 0.38) return (b - 1 + ez((d + 0.38) / 0.76)) * 360;
    return Math.min(4, Math.floor(t)) * 360;
  };
  // Header colour stops (distance into the light section): dark → light teal → light grey.
  // In dark mode the bottom part stays dark.
  // The fade to light teal ends 112 px into the light section (matches home.css).
  const stops = () => {
    const f = 112;
    return DARK.matches
      ? [[0, [7, 9, 10]], [f, [10, 13, 15]], [900, [7, 9, 10]]]
      : [[0, [7, 9, 10]], [f, [227, 239, 240]], [900, [241, 244, 245]]];
  };
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    if (!RM && hp) {
      const p = Math.min(1, y / (vh * 0.8));
      hp.style.transform = `perspective(1200px) rotateX(${22 - 22 * p}deg) scale(${0.92 + 0.08 * p}) translateY(${-30 * p}px)`;
    }
    {
      const st = stops();
      const d = 30 - light.getBoundingClientRect().top, sol = Math.min(1, y / 80);
      let col = st[0][1];
      if (d > 0) {
        col = st[2][1];
        for (let i = 0; i < 2; i++) {
          const [a, A] = st[i], [b, B] = st[i + 1];
          if (d <= b) { const w = (d - a) / (b - a); col = A.map((v, j) => Math.round(v + (B[j] - v) * w)); break; }
        }
      }
      const lum = (col[0] * 0.3 + col[1] * 0.59 + col[2] * 0.11) / 255;
      // Clear while the page fades from dark to light, tinted elsewhere.
      const zf = d < -100 ? 1 : d < -20 ? (-20 - d) / 80 : d < 760 ? 0 : d < 900 ? (d - 760) / 140 : 1;
      nav.style.background = `rgba(${col[0]},${col[1]},${col[2]},${0.55 * sol * zf})`;
      nav.style.backdropFilter = nav.style.webkitBackdropFilter = sol > 0 ? 'blur(20px) saturate(1.4)' : 'none';
      nav.classList.toggle('lightnav', lum > 0.55);
    }
    const r = show.getBoundingClientRect();
    const prog = Math.min(0.999, Math.max(0, -r.top / (r.height - vh)));
    const k = Math.floor(prog * 5);
    caps.forEach((c, i) => c.classList.toggle('on', i === k));
    pips.forEach((c, i) => c.classList.toggle('on', i === k));
    const ang = RM ? k * 360 : spinAt(prog * 5);
    const s = Math.min(4, Math.floor((ang + 180) / 360));
    scr.forEach((c, i) => c.classList.toggle('on', i === s));
    P3.style.transform = `rotateY(${ang}deg)`;
    SH.style.width = 80 + 120 * Math.abs(Math.cos((ang * Math.PI) / 180)) + 'px';
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  DARK.addEventListener('change', onScroll);
  onScroll();
})();
