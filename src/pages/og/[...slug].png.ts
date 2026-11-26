// Share images (1200 × 630), made at build time: one for the home, one for the blog,
// one per article (title + topic cover). Text uses Geist (SIL OFL, src/assets/fonts) inside
// the image only; the website itself uses the system font.
import type { APIRoute, GetStaticPaths } from 'astro';
import fs from 'node:fs/promises';
import satori from 'satori';
import sharp from 'sharp';
import { getPosts } from '../../lib/posts';
import { TOPIC_ART, TOPIC_COLORS, type Topic } from '../../lib/topics';

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});

const root = new URL('../../../', import.meta.url);
const font = (f: string) => fs.readFile(new URL(`src/assets/fonts/${f}`, root));
const asset = (f: string) => fs.readFile(new URL(`src/assets/${f}`, root));

const cover = (topic: Topic, w: number, hgt: number) => {
  const [c1, c2] = TOPIC_COLORS[topic];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${TOPIC_ART[topic].replaceAll('var(--c1)', c1)}</svg>`;
  return h('div', { width: w, height: hgt, flexShrink: 0, borderRadius: 40, alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(140deg, ${c2}, ${c1} 70%)` },
    h('img', { width: hgt * 0.8, height: hgt * 0.8 }, undefined, { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, width: hgt * 0.8, height: hgt * 0.8 }));
};

const light = (eyebrow: string, title: string, topic: Topic) =>
  h('div', { width: 1200, height: 630, padding: 64, gap: 48, alignItems: 'center', backgroundImage: 'linear-gradient(180deg, #E3EFF0, #F1F4F5)', fontFamily: 'Geist' }, [
    h('div', { width: 624, flexShrink: 0, height: '100%', flexDirection: 'column', justifyContent: 'space-between' }, [
      h('div', { fontSize: 32, fontWeight: 500, color: '#0B0B0F', letterSpacing: -1 }, [h('span', {}, 'Day+'), h('span', { color: '#5B6168', fontWeight: 400, marginLeft: 12 }, 'Blog')]),
      h('div', { flexDirection: 'column' }, [
        h('div', { fontSize: 22, fontWeight: 500, color: '#00747F', letterSpacing: 2.5, textTransform: 'uppercase' }, eyebrow),
        h('div', { marginTop: 16, fontSize: title.length > 60 ? 52 : 60, lineHeight: 1.08, fontWeight: 500, color: '#0B0B0F', letterSpacing: -1.5 }, title),
      ]),
      h('div', { fontSize: 24, color: '#5B6168' }, 'dayplus.app'),
    ]),
    cover(topic, 400, 502),
  ]);

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return [
    { params: { slug: 'home' }, props: { kind: 'home' as const } },
    { params: { slug: 'blog' }, props: { kind: 'blog' as const } },
    ...posts.map((p) => ({ params: { slug: `blog/${p.id}` }, props: { kind: 'post' as const, title: p.data.title, topic: p.data.topic } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const fonts = [
    { name: 'Geist', data: await font('Geist-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
    { name: 'Geist', data: await font('Geist-Medium.ttf'), weight: 500 as const, style: 'normal' as const },
  ];
  let tree: Node;
  if (props.kind === 'home') {
    const phone = (await asset('phones/today-dark.png')).toString('base64');
    tree = h('div', { width: 1200, height: 630, padding: '0 64px', backgroundColor: '#07090A', backgroundImage: 'radial-gradient(circle at 78% 70%, rgba(79,209,219,.22), rgba(7,9,10,0) 55%)', fontFamily: 'Geist', color: '#F4F5F7', overflow: 'hidden' }, [
      h('div', { width: 692, flexShrink: 0, flexDirection: 'column', justifyContent: 'center', gap: 24 }, [
        h('div', { fontSize: 32, fontWeight: 500, letterSpacing: -1 }, 'Day+'),
        h('div', { flexDirection: 'column', fontSize: 76, lineHeight: 1.05, letterSpacing: -2.5 }, [
          h('div', {}, 'One small win'),
          h('div', {}, [h('span', {}, 'for your '), h('span', { color: '#4FD1DB', fontWeight: 500 }, 'mornings')]),
        ]),
        h('div', { fontSize: 28, color: '#9BA1A8' }, 'A habit tracker for iPhone. Free for 3 days.'),
      ]),
      h('div', { width: 380, flexShrink: 0, height: 630, position: 'relative' },
        h('img', { position: 'absolute', top: 64, left: 10, width: 360, height: 708 }, undefined, { src: `data:image/png;base64,${phone}`, width: 360, height: 708 })),
    ]);
  } else if (props.kind === 'blog') {
    tree = light('The Day+ blog', 'Small habits, explained', 'Habits');
  } else {
    tree = light(props.topic, props.title, props.topic);
  }
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
