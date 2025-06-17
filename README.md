# Dry Eyes - Marketing Website

A highly performant, minimalist marketing website built with Next.js 15 and Contentful CMS. Features a clean black and white design with composable content blocks for maximum flexibility.

## Tech Stack

- **Framework**: Next.js 15 (with React 19)
- **CMS**: Contentful (Headless)
- **Styling**: Tailwind CSS
- **Data Fetching**: Contentful GraphQL API
- **Deployment**: Vercel

## Project Features

- **Server-first architecture** with React Server Components
- **Static Site Generation (SSG)** with Incremental Static Regeneration (ISR)
- **Composable content blocks** managed through Contentful
- **Fully typed** with TypeScript and generated Contentful types
- **Minimalist design** with black and white theme
- **Performance optimized** with custom lightweight components

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- Contentful account and space

### Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd dry-eyes
   pnpm install
   ```

2. **Configure Contentful:**

   ```bash
   # Copy environment variables
   cp .env.local.example .env.local

   # Add your Contentful credentials to .env.local
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   ```

3. **Setup Contentful content models:**

   ```bash
   pnpm run setup:contentful
   ```

4. **Generate TypeScript types:**

   ```bash
   pnpm run generate:types
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── blocks/            # Content block components
│   └── ui/                # UI components
├── lib/                   # Contentful API and utilities
│   ├── queries/          # GraphQL queries
│   └── types.ts          # Generated types
└── scripts/              # Setup and build scripts
```

## Future Improvements

1. **Contentful Image API Integration** - Responsive image transformations and format optimization
2. **ISR Cache Invalidation** - API route handlers for webhook-based cache invalidation
3. **GraphQL Typegen** - Automated GraphQL schema to TypeScript type generation
4. **Analytics Integration** - Google Analytics or Plausible for performance tracking
5. **Multi-language Support** - Contentful localization for international markets

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
