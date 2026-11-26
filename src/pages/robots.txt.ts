import { SITE_URL } from '../config';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', SITE_URL).href}\n`, { headers: { 'Content-Type': 'text/plain' } });
}
