// Blog topics: colours for the gradient covers and the locked white shape per topic
// (from day-plus-blog-D.html, option D). No stock photos, never real book covers.
export const TOPIC_NAMES = ['Science', 'Books', 'Habits', 'Routines', 'Focus', 'Sleep', 'Motivation'] as const;
export type Topic = (typeof TOPIC_NAMES)[number];

export const topicSlug = (t: Topic) => t.toLowerCase();
export const topicFromSlug = (s: string) => TOPIC_NAMES.find((t) => topicSlug(t) === s);

/** SVG shapes on a 100 × 100 canvas. var(--c1) is the topic's dark colour. */
export const TOPIC_ART: Record<Topic, string> = {
  Science: `<path d="M42 20h16M45 20v20L28 70a6 6 0 0 0 5.2 9h33.6A6 6 0 0 0 72 70L55 40V20" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M35 60h30l7 11a5 5 0 0 1-4.4 7H32.4A5 5 0 0 1 28 71z" fill="#fff" opacity=".9"/><g fill="#fff"><circle cx="58" cy="30" r="2.6" opacity=".8"/><circle cx="64" cy="20" r="1.8" opacity=".6"/><circle cx="44" cy="68" r="2.4" fill="var(--c1)" opacity=".5"/></g>`,
  Books: `<path d="M50 32C42 25 30 24 18 27v44c12-3 24-2 32 5z" fill="#fff"/><path d="M50 32c8-7 20-8 32-5v44c-12-3-24-2-32 5z" fill="#fff" opacity=".82"/><path d="M50 32v44" stroke="var(--c1)" stroke-width="1.6" opacity=".5"/><g stroke="var(--c1)" stroke-width="1.6" stroke-linecap="round" opacity=".35"><path d="M25 38c7-1.5 13-1 19 1.5M25 46c7-1.5 13-1 19 1.5M25 54c7-1.5 13-1 19 1.5M56 39.5c6-2.5 12-3 19-1.5M56 47.5c6-2.5 12-3 19-1.5M56 55.5c6-2.5 12-3 19-1.5"/></g><path d="M66 26v20l4-3.5 4 3.5V26" fill="#F0877E"/>`,
  Habits: `<g fill="#fff"><rect x="20" y="62" width="12" height="14" rx="3" opacity=".45"/><rect x="36" y="52" width="12" height="24" rx="3" opacity=".6"/><rect x="52" y="42" width="12" height="34" rx="3" opacity=".78"/><rect x="68" y="28" width="12" height="48" rx="3"/></g>`,
  Routines: `<circle cx="50" cy="66" r="18" fill="#fff"/><g stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M50 36v-9M27 45l-6-6M73 45l6-6M18 66H10M82 66h8"/></g><rect x="0" y="70" width="100" height="30" fill="var(--c1)" opacity=".55"/>`,
  Focus: `<g fill="none" stroke="#fff"><circle cx="50" cy="50" r="32" stroke-width="2" opacity=".45"/><circle cx="50" cy="50" r="21" stroke-width="2.5" opacity=".7"/></g><circle cx="50" cy="50" r="9" fill="#fff"/>`,
  Sleep: `<path d="M62 22a26 26 0 1 0 20 38 21 21 0 0 1-20-38z" fill="#fff"/><g fill="#fff"><circle cx="24" cy="26" r="2"/><circle cx="34" cy="16" r="1.4" opacity=".7"/><circle cx="80" cy="80" r="1.6" opacity=".7"/></g>`,
  Motivation: `<path d="M22 72l18-18 12 10 24-28" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M66 34h12v12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
};

/** Cover markup (also used by the blog's search and Load more). Colours come from .tp-<slug> in blog.css. */
export const coverHtml = (t: Topic, cls = 'dv') =>
  `<div class="${cls} tp-${topicSlug(t)}" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">${TOPIC_ART[t]}</svg></div>`;

/** Same colours as .tp-<slug> in blog.css, for the share images. [dark, light] */
export const TOPIC_COLORS: Record<Topic, [string, string]> = {
  Science: ['#0D5F7A', '#4FD1DB'],
  Books: ['#8A5A12', '#D9A441'],
  Habits: ['#0E6E76', '#58C7C9'],
  Routines: ['#B7791F', '#D9A441'],
  Focus: ['#24525C', '#4FD1DB'],
  Sleep: ['#2E2A5A', '#9C8CE0'],
  Motivation: ['#5E2C4F', '#E79BC0'],
};
