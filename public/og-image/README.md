# ToolBasketAI — OG Images (90 files)

## What's in this zip
- 90 PNG images, 1200×630 (standard OG/Twitter card size)
- `_manifest.csv` — maps every image to its slug, Next.js route, and page title
- Filenames match your **page router** filenames exactly, e.g. `merge-pdf.png` → `pages/merge-pdf.tsx`
- `index.png` is the homepage (`pages/index.tsx`)

## 1. Install the files
Copy the whole folder into your `public` directory:

```
public/
  og/
    index.png
    merge-pdf.png
    split-pdf.png
    ...
```

## 2. Reference them in each page (Pages Router)
Since you're on the **Pages Router**, set the OG tags with `next/head` in each page file, or centrally if you generate meta from a data object.

### Per-page example (`pages/merge-pdf.tsx`)
```tsx
import Head from "next/head";

export default function MergePdfPage() {
  return (
    <>
      <Head>
        <title>Merge PDF — ToolBasketAI</title>
        <meta property="og:title" content="Merge PDF — ToolBasketAI" />
        <meta property="og:description" content="Combine multiple PDFs into one file" />
        <meta property="og:image" content="https://toolbasketai.com/og-image/merge-pdf.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://toolbasketai.com/og-image/merge-pdf.png" />
      </Head>
      {/* page content */}
    </>
  );
}
```

### Recommended: centralize it with a shared `<SEO>` component
Create `components/Seo.tsx`:

```tsx
import Head from "next/head";

type SeoProps = {
  title: string;
  description: string;
  slug: string; // e.g. "merge-pdf" or "index" for homepage
};

export default function Seo({ title, description, slug }: SeoProps) {
  const path = slug === "index" ? "" : `/${slug}`;
  const url = `https://toolbasketai.com${path}`;
  const ogImage = `https://toolbasketai.com/og-image/${slug}.png`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
```

Then in every page:
```tsx
<Seo
  title="Merge PDF — ToolBasketAI"
  description="Combine multiple PDFs into one file"
  slug="merge-pdf"
/>
```

Pull `title`/`description`/`slug` straight from `_manifest.csv` (or turn it into a `pages.json` data file) so you never hardcode this per page.

## 3. Fallback / default image
Use `index.png` (or duplicate it as `og-default.png`) as the fallback in `_app.tsx` or `_document.tsx` for any route not explicitly covered — e.g. 404 pages.

## 4. Slugs that don't match your real routes
I generated these from what's visible on your live homepage — I could not read your actual `sitemap.xml`. Two known non-standard ones already matched your real links:
- `resume-builder` → `/resume-builder`
- `drowChart` → `/drowChart` (your AI Chart Maker route — unusual capitalization, kept as-is)

If any other slug here doesn't match your actual `pages/*.tsx` filename, just rename the PNG to match — the design doesn't need to change, only the filename.

## 5. Not included — add these once you confirm them
- Individual **blog post** OG images (unknown count/slugs — send me the list and I'll generate them in the same style)
- `contact.png` was generated but can be skipped/reused from `about.png` if you'd rather not maintain a separate one

## Category color key
| Category | Color |
|---|---|
| Core (home/about/legal) | Indigo |
| Category hubs | Sky blue |
| PDF Tools | Red/Coral |
| Documents | Blue |
| Image Tools | Teal/Green |
| AI Suite | Magenta |
| Developer | Purple |
| OCR | Gold |
