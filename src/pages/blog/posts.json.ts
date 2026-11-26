import { getPosts, card } from '../../lib/posts';

// Every published article as a small card. The blog index uses it for search and Load more.
export async function GET() {
  const posts = (await getPosts()).map(card);
  return new Response(JSON.stringify(posts), { headers: { 'Content-Type': 'application/json' } });
}
