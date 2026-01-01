# Dev Journal

Personal blog built with Astro, deployed on Cloudflare Pages.

## Tech Stack

- **Framework**: Astro (static site generator)
- **Hosting**: Cloudflare Pages (via Workers)
- **Styling**: CSS with dark mode theme, JetBrains Mono font

## Project Structure

```
src/
├── assets/          # Images (hero-home.png, hero-city.png, hero-about.png)
├── components/      # Astro components (Header, Footer, BaseHead, FormattedDate)
├── content/blog/    # Markdown blog posts
├── layouts/         # Page layouts (BlogPost.astro)
├── pages/           # Routes (index.astro, about.astro, blog/)
└── styles/          # Global CSS
```

## Commands

```sh
npm run dev      # Start dev server at localhost:4321
npm run build    # Build to ./dist/
npm run preview  # Preview build locally
```

## Deployment

Uses `wrangler deploy` with config in `wrangler.json`. Cloudflare automatically builds and deploys on push to main.

## Adding Blog Posts

Create a new `.md` file in `src/content/blog/` with frontmatter:

```markdown
---
title: 'Post Title'
description: 'Post description'
pubDate: 'Jan 01 2026'
heroImage: '../../assets/hero-city.png'
---

Post content here...
```

## Theme

Dark mode with cyan accent (#22d3ee). CSS variables defined in `src/styles/global.css`.