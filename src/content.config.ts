import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------------------------------------------------------------------
// Rackets & gear — single-product review pages
// ---------------------------------------------------------------------
const rackets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rackets' }),
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    gearType: z.enum(['racket', 'shoes', 'bag', 'accessory']).default('racket'),
    category: z.string(), // e.g. "Power", "Control", "Comfort" — free text, owner-defined
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All levels']),
    homepageRank: z.number().int().positive().optional(), // if set, shows in homepage top-rated grid
    price: z.string(), // display string e.g. "€159.90" — keep as string for currency flexibility
    image: z.string(),
    imageAlt: z.string().optional(),

    // Spec table fields
    weight: z.string().optional(),
    balance: z.string().optional(),
    shape: z.string().optional(),
    bestFor: z.string().optional(),

    prosCons: z.object({
      pros: z.array(z.string()),
      cons: z.array(z.string()),
    }),
    verdict: z.string(),

    // Centralized affiliate linking — see src/data/affiliates.json.
    // Each entry's "retailer" must match an id in that file; "productPath"
    // is appended to that retailer's base URL. Changing a program's base
    // URL only ever happens in affiliates.json, never per article.
    // A racket can link to more than one retailer — the list renders as
    // multiple "Check price at X" buttons, in the order given here.
    retailers: z
      .array(
        z.object({
          retailer: z.string(),
          retailerProductPath: z.string(),
        })
      )
      .min(1),

    relatedComparisons: z.array(reference('comparisons')).optional(),

    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
  }),
});

// ---------------------------------------------------------------------
// "X vs Y" comparisons
// ---------------------------------------------------------------------
const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comparisons' }),
  schema: z.object({
    title: z.string(),
    racketA: reference('rackets'),
    racketB: reference('rackets'),
    verdicts: z.array(
      z.object({
        playerType: z.string(), // e.g. "Beginners", "Aggressive attackers"
        winner: z.enum(['A', 'B', 'tie']),
        note: z.string(),
      })
    ),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
  }),
});

// ---------------------------------------------------------------------
// How-to / guide long-form articles
// ---------------------------------------------------------------------
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(), // e.g. "Beginner guide", "Care", "Head to head"
    excerpt: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    homepageFeatured: z.boolean().default(false),
    featuredStyle: z.enum(['default', 'accent']).default('default'),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { rackets, comparisons, guides };
