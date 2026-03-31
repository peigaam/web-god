# SEO Principles

---

## 1. How Search Engines Work

**Crawl → Index → Rank → Serve**

- **Crawl:** Googlebot follows links, reads robots.txt, discovers pages. Budget is finite.
- **Index:** Content is parsed, structured data extracted, page stored in index.
- **Rank:** Algorithms score pages by relevance, quality, authority, experience.
- **Serve:** Results selected based on query intent, user location, device, personalization.

Your job: Make crawling efficient, indexing accurate, and ranking signals strong.

## 2. The Four Pillars of Technical SEO

### Crawlability
- Every important page reachable within 3 clicks from homepage
- XML sitemap lists all indexable pages with accurate lastmod dates
- robots.txt allows crawling of all important resources (CSS, JS, images)
- No orphan pages (pages with no internal links pointing to them)
- Redirect chains ≤ 2 hops. Fix chains, don't add to them.

### Indexability
- Canonical URL on every page (prevents duplicate content penalties)
- noindex only on intentionally excluded pages (admin, search results, thin content)
- Pagination: use canonical to the series or self-referencing canonical per page
- JavaScript rendering: use SSR/SSG for content that must be indexed

### Content Signals
- One h1 per page containing the primary keyword
- Title tag: 50-60 chars, primary keyword first, brand last
- Meta description: 150-160 chars, includes keyword and call-to-action
- Internal links with descriptive anchor text (not "click here" or "read more")
- Image alt text that describes the image AND is keyword-relevant

### Authority Signals
- HTTPS (ranking signal since 2014)
- Core Web Vitals (ranking signal since 2021)
- Mobile-friendly (ranking signal since 2015)
- Structured data (enables rich results, not a direct ranking signal)

## 3. Structured Data Reference

### Required Schema Types by Page

| Page Type | Schema | Rich Result |
|---|---|---|
| Homepage | Organization, WebSite (w/ SearchAction) | Sitelinks search box |
| Product | Product, Offer, AggregateRating | Product snippets, price |
| Article | Article, Author, BreadcrumbList | Article snippet, date |
| FAQ | FAQPage | FAQ dropdowns in SERP |
| How-to | HowTo | Step-by-step in SERP |
| Event | Event | Event listing |
| Recipe | Recipe | Recipe card |
| Local business | LocalBusiness | Knowledge panel |

### JSON-LD Template (Article)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20",
  "image": "https://example.com/image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Company",
    "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" }
  }
}
```

## 4. Core Web Vitals for SEO

Google uses CWV as a ranking factor. The thresholds that matter:
- LCP < 2.5s (good), 2.5-4s (needs improvement), > 4s (poor)
- INP < 200ms (good), 200-500ms (needs improvement), > 500ms (poor)
- CLS < 0.1 (good), 0.1-0.25 (needs improvement), > 0.25 (poor)

CWV alone won't make a bad page rank. But between two equally relevant pages, CWV can tip the scale.

## 5. Next.js SEO Patterns

- Use `metadata` export for static pages, `generateMetadata` for dynamic
- Use `sitemap.ts` for programmatic sitemap generation
- Use `robots.ts` for programmatic robots.txt
- Use `opengraph-image.tsx` for dynamic OG images
- Set `metadataBase` in root layout for absolute URL resolution
