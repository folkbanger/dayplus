import { getCollection, type CollectionEntry } from 'astro:content';
import type { Topic } from './topics';
import { topicSlug } from './topics';

export type Entry = CollectionEntry<'blog'>;

/** Today's date in US Eastern time, as YYYY-MM-DD. The daily rebuild runs early morning Eastern. */
export const todayET = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

/** The article's own calendar day (frontmatter dates are read as UTC midnight). */
export const dayOf = (d: Date) => d.toISOString().slice(0, 10);

export const isScheduled = (e: Entry) => dayOf(e.data.date) > todayET();

/**
 * Published articles, newest first. Drafts and future-dated articles are left out of the
 * built site. In the local preview (npm run dev) they are shown, marked, so you can check them.
 */
export async function getPosts(): Promise<Entry[]> {
  const all = await getCollection('blog');
  const dev = import.meta.env.DEV;
  return all
    .filter((e) => dev || (!e.data.draft && !isScheduled(e)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title));
}

/** Reading time in minutes (about 230 words a minute), never under 1. */
export function minutesToRead(body = ''): number {
  const text = body
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`\[\]()!-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 230));
}

export const postUrl = (e: Entry) => `/blog/${e.id}/`;
export const topicUrl = (t: Topic) => `/blog/topic/${topicSlug(t)}/`;

export const fmtDate = (d: Date, year = true) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}), timeZone: 'UTC' });

/** 3 related posts: newest in the same topic first, then the newest others. */
export function related(posts: Entry[], self: Entry, n = 3): Entry[] {
  const others = posts.filter((p) => p.id !== self.id);
  const same = others.filter((p) => p.data.topic === self.data.topic);
  const rest = others.filter((p) => p.data.topic !== self.data.topic);
  return [...same, ...rest].slice(0, n);
}

/** Card data shared by the list, the search and Load more. */
export const card = (e: Entry) => ({
  url: postUrl(e),
  title: e.data.title,
  description: e.data.description,
  topic: e.data.topic,
  date: fmtDate(e.data.date),
  minutes: minutesToRead(e.body),
  flag: e.data.draft ? 'Draft' : isScheduled(e) ? 'Scheduled' : '',
});
export type Card = ReturnType<typeof card>;

export const PER_PAGE = 9; // desktop page size; phones show 8 and load 8 more at a time
