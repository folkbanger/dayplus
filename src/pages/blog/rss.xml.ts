// RSS feed of the newest 50 published articles.
import { getPosts, postUrl } from '../../lib/posts';
import { SITE_URL } from '../../config';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c] as string);

export async function GET() {
  const posts = (await getPosts()).filter((p) => !p.data.draft).slice(0, 50);
  const abs = (p: string) => new URL(p, SITE_URL).href;
  const items = posts
    .map((p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${abs(postUrl(p))}</link>
      <guid isPermaLink="true">${abs(postUrl(p))}</guid>
      <description>${esc(p.data.description)}</description>
      <category>${esc(p.data.topic)}</category>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
    </item>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Day+ Blog</title>
    <link>${abs('/blog/')}</link>
    <atom:link href="${abs('/blog/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>Small habits, explained: the science of habits and the books about them, made short and practical.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml' } });
}
