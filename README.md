# Circle of Reading

Leo Tolstoy's *Krug Chteniya* (*Circle of Reading*) — 53 weekly readings and 8 monthly essays, newly translated from the Russian Jubilee Edition.

A literary web application built with Astro for comfortable long-form reading.

## Features

- 61 translations rendered with elegant, literary typography
- Month-based navigation for the year-long reading cycle
- Dark/light mode toggle
- Full-text search (Pagefind)
- Responsive design optimized for reading
- Zero JavaScript by default (hydrated only for search and theme toggle)

## Stack

- **Framework:** Astro (content-first, zero-JS by default)
- **Styling:** Tailwind CSS v4 with custom literary theme
- **Interactive components:** React islands (search, theme toggle)
- **Search:** Pagefind (client-side full-text search)
- **Deployment:** Cloudflare Pages

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production (includes Pagefind indexing)
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── content/readings/     # Markdown files with frontmatter
│   ├── january/         # Weekly readings by month
│   ├── february/
│   └── monthly/         # Monthly readings collection
├── layouts/
│   ├── BaseLayout.astro # HTML shell, fonts, theme
│   └── ReadingLayout.astro # Reading page template
├── components/
│   ├── Navigation.astro # Month-based nav
│   ├── ReadingCard.astro # Index page cards
│   ├── ThemeToggle.tsx  # Dark/light mode
│   └── SearchDialog.tsx # Cmd+K search
├── pages/
│   ├── index.astro      # Home with all readings
│   ├── [month]/index.astro # Month index
│   ├── [month]/[slug].astro # Individual reading
│   └── monthly/         # Monthly readings
└── styles/
    └── global.css       # Typography and theme
```

## Deployment

### Cloudflare Pages

```bash
# Deploy with Wrangler
npx wrangler pages deploy dist
```

Or connect to GitHub for automatic deployments.

## Typography

- **Font:** Source Serif 4 (serif stack fallback)
- **Reading width:** 65ch (optimal measure)
- **Line height:** 1.75 (generous for long-form)
- **Light theme:** Warm cream background, dark brown text
- **Dark theme:** Near-black, warm white text, soft gold accents

## Source

Translations from Volumes 41-42 of the Complete Collected Works (Jubilee Edition):
- *Polnoe Sobranie Sochinenii* (PSS), Volumes 41-42
- Published by the Russian Academy of Sciences, 1928-1958

## License

Translations and web application content are provided for personal and educational use.

<!-- Migration verified 2026-02-05 -->
