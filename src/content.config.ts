import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPIC_NAMES } from './lib/topics';

// One file per article in src/content/blog/. The file name is the address:
// how-long-to-form-a-habit.mdx → /blog/how-long-to-form-a-habit/
// Files starting with "_" (the template) are ignored.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(10).max(90),
    description: z.string().min(20).max(170),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topic: z.enum(TOPIC_NAMES),
    sources: z.array(z.string().min(10)).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
