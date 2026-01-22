import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const readings = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/readings" }),
  schema: z.object({
    // Week number (W01-W52) - primary identifier for weekly readings
    week: z.number().min(1).max(52).optional(),
    // Legacy number field for backwards compatibility
    number: z.union([z.number(), z.array(z.number())]).optional(),
    title: z.string(),
    russianTitle: z.string().optional(),
    author: z.string().optional(),
    month: z.enum([
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ]),
    type: z.enum(["weekly", "monthly"]),
    // PSS volume (41 or 42)
    volume: z.number().min(41).max(42).optional(),
    pages: z.string().optional(),
    slug: z.string(),
    description: z.string().optional(),
    // Embedded readings (for weeks with multiple pieces)
    embedded: z.array(z.string()).optional(),
  }),
});

export const collections = { readings };
