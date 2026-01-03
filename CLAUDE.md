# Dev Journal

Personal blog built with Astro, deployed on Cloudflare Pages.

## Tech Stack

- **Framework**: Astro (static site generator)
- **Hosting**: Cloudflare Pages (via Workers)
- **Styling**: CSS with dark mode theme, JetBrains Mono font

## Project Structure

```
src/
├── assets/          # Images (hero-home.jpg, hero-city.png, hero-about.png)
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

## Visual Aesthetics

**Style**: Synthwave / Cyberpunk / Vaporwave
**Colors**: Neon purple and cyan on dark backgrounds
**Vibe**: Futuristic, digital, minimalist

### Current Hero Images

- `hero-home.jpg` - Wide panoramic synthwave sunset landscape (1024x399)
- `hero-agent.png` - AI/digital brain with circuits (1024x1024)
- `hero-city.png` - Cyberpunk neon city (1024x1024)
- `hero-about.png` - Aurora mountains (1024x1024)

### Image Optimization

Uses Astro's `<Picture />` component with `formats={['avif', 'webp']}` for automatic modern format delivery. Images are served at multiple `widths={[400, 720, 1020]}` for responsive loading.

### Generating New Hero Images

Use Gemini or similar AI image generator. Key elements for prompts:

**Base style keywords** (always include):
```
synthwave aesthetic, neon purple and cyan colors, dark background,
digital art, minimalist, no text
```

**Example prompts by topic**:

General/coding:
```
Glowing holographic keyboard with floating code symbols,
synthwave aesthetic, neon purple and cyan, dark background,
digital art, minimalist, no text
```

AI/agents:
```
Digital brain made of glowing circuit lines and code,
purple and cyan neon, dark cyberpunk background,
abstract minimalist art, no text
```

Landscape/abstract:
```
Synthwave digital landscape with glowing code streams and binary data,
neon purple and cyan colors, dark background, minimalist abstract art,
no text
```

Data/infrastructure:
```
Neon server racks with glowing data streams,
cyberpunk aesthetic, purple and cyan, dark background,
digital art, no text
```

Save new images as `hero-[topic].png` in `src/assets/`.

## Development Workflow

1. Run `npm run dev` to start the local server at localhost:4321
2. Make changes and verify in browser before committing
3. Use Chrome DevTools MCP (when available) to verify visual changes