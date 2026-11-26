// sitemap.xml: every public page. Only published articles (no drafts, nothing scheduled);
// topic pages only when they have articles.
import { getPosts, PER_PAGE, postUrl, topicUrl } from '../lib/posts';
import { TOPIC_NAMES } from '../lib/topics';
import { SITE_URL } from '../config';

export async function GET() {
  const posts = await getPosts();
  const abs = (p: string) => new URL(p, SITE_URL).href;
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const urls: { loc: string; lastmod?: string }[] = [];
  const newest = posts[0] ? day(posts[0].data.updated ?? posts[0].data.date) : undefined;
  urls.push({ loc: abs('/') }, { loc: abs('/blog/'), lastmod: newest });
  const pages = (n: number) => Math.ceil(Math.max(0, n - 1) / PER_PAGE);
  for (let i = 2; i <= pages(posts.length); i++) urls.push({ loc: abs(`/blog/page/${i}/`) });
  for (const t of TOPIC_NAMES) {
    const tp = posts.filter((p) => p.data.topic === t);
    if (!tp.length) continue;
    urls.push({ loc: abs(topicUrl(t)), lastmod: day(tp[0].data.updated ?? tp[0].data.date) });
    for (let i = 2; i <= pages(tp.length); i++) urls.push({ loc: abs(`${topicUrl(t)}page/${i}/`) });
  }
  for (const p of posts) urls.push({ loc: abs(postUrl(p)), lastmod: day(p.data.updated ?? p.data.date) });
  urls.push({ loc: abs('/privacy/') }, { loc: abs('/terms/') }, { loc: abs('/support/') });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
