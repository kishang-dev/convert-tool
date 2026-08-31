import Head from 'next/head';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  keywords?: string | string[];
  structuredData?: object | object[];
  faqItems?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  softwareCategory?: string;
  ratingValue?: string;
  ratingCount?: string;
  isHomePage?: boolean;
}

const SITE_NAME = 'ToolBasketAI';
const BASE_URL = 'https://toolbasketai.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image/index.png`;
const DEFAULT_DESCRIPTION =
  'ToolBasketAI is your all-in-one free online toolkit. Convert PDFs, merge & compress PDF without quality loss, resize & crop images, format JSON/XML/SQL client-side, generate secure hashes, build AI resumes, extract OCR text, and 75+ free tools — 100% private, fast & secure.';
const DEFAULT_KEYWORDS = [
  'free online tools',
  'free PDF converter online',
  'merge PDF free',
  'compress PDF without quality loss',
  'PDF to Word converter',
  'Word to PDF free',
  'image resizer online by pixel',
  'compress JPG PNG WebP',
  'online OCR text extractor',
  'JSON formatter and minifier client side',
  'SQL formatter online',
  'AI resume builder free download',
  'AI flowchart diagram maker',
  'Base64 encoder decoder',
  'JWT decoder online',
  'no watermark free tools',
  'ToolBasketAI'
].join(', ');

const ROUTE_OG_MAP: Record<string, string> = {
  '/': '/og-image/index.png',
  '/about': '/og-image/about.png',
  '/contact': '/og-image/contact.png',
  '/blog': '/og-image/blog.png',
  '/privacy': '/og-image/privacy.png',
  '/terms': '/og-image/terms.png',
  '/tools': '/og-image/tools.png',
  '/merge-pdf': '/og-image/merge-pdf.png',
  '/split-pdf': '/og-image/split-pdf.png',
  '/compress-pdf': '/og-image/compress-pdf.png',
  '/editor': '/og-image/pdf-editor.png',
  '/protect-pdf': '/og-image/protect-pdf.png',
  '/pdf-unlock': '/og-image/unlock-pdf.png',
  '/rotate-pdf': '/og-image/rotate-pdf.png',
  '/pdf-to-image': '/og-image/pdf-to-image.png',
  '/pdf-watermark': '/og-image/pdf-watermark.png',
  '/pdf-number': '/og-image/pdf-page-numberer.png',
  '/pdf-extract-pages': '/og-image/pdf-page-extractor.png',
  '/pdf-delete-pages': '/og-image/pdf-page-delete.png',
  '/pdf-grayscale': '/og-image/pdf-grayscale.png',
  '/pdf-metadata': '/og-image/pdf-metadata-editor.png',
  '/pdf-reorder': '/og-image/pdf-page-reorder.png',
  '/pdf-to-word': '/og-image/pdf-to-word.png',
  '/word-to-pdf': '/og-image/word-to-pdf.png',
  '/pdf-to-excel': '/og-image/pdf-to-excel.png',
  '/ppt-to-pdf': '/og-image/ppt-to-pdf.png',
  '/html-to-pdf': '/og-image/html-to-pdf.png',
  '/pdf-to-html': '/og-image/pdf-to-html.png',
  '/pdf-to-text': '/og-image/pdf-to-text.png',
  '/text-to-pdf': '/og-image/text-to-pdf.png',
  '/csv-to-pdf': '/og-image/csv-to-pdf.png',
  '/pdf-to-csv': '/og-image/pdf-to-csv.png',
  '/pdf-to-speech': '/og-image/pdf-to-speech.png',
  '/speech-to-pdf': '/og-image/speech-to-pdf.png',
  '/video-to-pdf': '/og-image/video-to-pdf-notes.png',
  '/audio-to-transcript': '/og-image/audio-to-transcript.png',
  '/word-to-text': '/og-image/word-to-text.png',
  '/excel-to-csv': '/og-image/excel-to-csv.png',
  '/csv-to-excel': '/og-image/csv-to-excel.png',
  '/text-to-word': '/og-image/text-to-word.png',
  '/html-to-word': '/og-image/html-to-word.png',
  '/image-resizer': '/og-image/image-resizer.png',
  '/image-cropper': '/og-image/image-cropper.png',
  '/image-converter': '/og-image/image-converter.png',
  '/convert-to-jpg': '/og-image/convert-to-jpg.png',
  '/convert-to-png': '/og-image/convert-to-png.png',
  '/svg-to-image': '/og-image/svg-to-image.png',
  '/image-watermark': '/og-image/image-watermark.png',
  '/image-compressor': '/og-image/image-compressor.png',
  '/png-to-webp': '/og-image/png-to-webp.png',
  '/jpg-to-webp': '/og-image/jpg-to-webp.png',
  '/image-palette': '/og-image/image-color-palette.png',
  '/svg-optimizer': '/og-image/svg-optimizer.png',
  '/text-to-image': '/og-image/text-to-image.png',
  '/resume-builder': '/og-image/resume-builder.png',
  '/drowChart': '/og-image/drowChart.png',
  '/base64': '/og-image/base64-encoder-decoder.png',
  '/jwt': '/og-image/jwt-decoder.png',
  '/json-formatter': '/og-image/json-formatter.png',
  '/json-validator': '/og-image/json-validator.png',
  '/json-diff': '/og-image/json-diff-checker.png',
  '/yaml-json': '/og-image/yaml-json-converter.png',
  '/csv-json': '/og-image/csv-json-converter.png',
  '/regex-tester': '/og-image/regex-tester.png',
  '/xml-tool': '/og-image/xml-formatter.png',
  '/sql-formatter': '/og-image/sql-formatter.png',
  '/sql-query-builder': '/og-image/sql-query-builder.png',
  '/markdown-editor': '/og-image/markdown-editor.png',
  '/code-minifier': '/og-image/code-minifier.png',
  '/hash-generator': '/og-image/uuid-hash-generator.png',
  '/url-encoder': '/og-image/url-encoder-parser.png',
  '/json-to-xml': '/og-image/json-to-xml.png',
  '/html-formatter': '/og-image/html-formatter.png',
  '/css-formatter': '/og-image/css-formatter.png',
  '/js-formatter': '/og-image/js-ts-formatter.png',
  '/case-converter': '/og-image/string-case-converter.png',
  '/text-diff': '/og-image/text-diff-checker.png',
  '/ocr': '/og-image/ocr.png',
  '/image-to-text': '/og-image/image-to-text-ocr.png',
  '/handwriting-ocr': '/og-image/handwriting-ocr.png',
  '/receipt-ocr': '/og-image/receipt-invoice-ocr.png',
  '/pdf-ocr-text': '/og-image/pdf-text-ocr.png',
  '/multilingual-ocr': '/og-image/multi-language-ocr.png',
};

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noIndex = false,
  keywords = DEFAULT_KEYWORDS,
  structuredData,
  faqItems,
  breadcrumbs,
  softwareCategory = 'BrowserApplication',
  ratingValue = '4.9',
  ratingCount = '1250',
  isHomePage = false,
}: SEOProps) {
  const keywordString = Array.isArray(keywords) ? keywords.join(', ') : (keywords || DEFAULT_KEYWORDS);
  const activeCanonical = canonicalUrl || canonical;

  // Format Title: Avoid repeating site name if already present in custom title
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Free Online PDF, Image, Developer & AI Tools`;

  // Format Canonical URL
  const cleanCanonical = activeCanonical
    ? activeCanonical.startsWith('http')
      ? activeCanonical
      : `${BASE_URL}${activeCanonical.startsWith('/') ? '' : '/'}${activeCanonical}`
    : BASE_URL;

  // Resolve OG Image URL
  let rawOgImage = ogImage;
  if (!ogImage || ogImage === DEFAULT_OG_IMAGE) {
    let routePath = '';
    if (activeCanonical) {
      try {
        routePath = activeCanonical.startsWith('http')
          ? new URL(activeCanonical).pathname
          : activeCanonical;
      } catch (e) {
        routePath = activeCanonical;
      }
    }
    if (routePath && ROUTE_OG_MAP[routePath]) {
      rawOgImage = ROUTE_OG_MAP[routePath];
    } else {
      rawOgImage = '/og-image/index.png';
    }
  }

  const finalOgImage = rawOgImage!.startsWith('http')
    ? rawOgImage!
    : `${BASE_URL}${rawOgImage!.startsWith('/') ? '' : '/'}${rawOgImage!}`;

  // WebSite Schema for Homepage with SearchAction
  const websiteSchema = isHomePage
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SITE_NAME,
        'url': BASE_URL,
        'description': DEFAULT_DESCRIPTION,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${BASE_URL}/?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
    : null;

  // SoftwareApplication / WebApplication Schema
  const applicationSchema =
    title && !isHomePage
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': title,
          'description': description,
          'applicationCategory': softwareCategory,
          'operatingSystem': 'All (Windows, Mac, Linux, iOS, Android)',
          'url': cleanCanonical,
          'image': finalOgImage,
          'offers': {
            '@type': 'Offer',
            'price': '0.00',
            'priceCurrency': 'USD',
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': ratingValue,
            'ratingCount': ratingCount,
            'bestRating': '5',
            'worstRating': '1',
          },
          'author': {
            '@type': 'Organization',
            'name': SITE_NAME,
            'url': BASE_URL,
          },
        }
      : null;

  // FAQ Schema
  const faqSchema =
    faqItems && faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqItems.map((item) => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': item.answer,
            },
          })),
        }
      : null;

  // Breadcrumb Schema
  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': BASE_URL,
            },
            ...breadcrumbs.map((b, idx) => ({
              '@type': 'ListItem',
              'position': idx + 2,
              'name': b.name,
              'item': b.item.startsWith('http') ? b.item : `${BASE_URL}${b.item.startsWith('/') ? '' : '/'}${b.item}`,
            })),
          ],
        }
      : null;

  // Collect all structured data schemas into an array
  const allSchemas: object[] = [];
  if (websiteSchema) allSchemas.push(websiteSchema);
  if (applicationSchema) allSchemas.push(applicationSchema);
  if (faqSchema) allSchemas.push(faqSchema);
  if (breadcrumbSchema) allSchemas.push(breadcrumbSchema);

  if (structuredData) {
    const customList = Array.isArray(structuredData) ? structuredData : [structuredData];
    for (const item of customList) {
      if (item && typeof item === 'object') {
        const itemType = (item as any)['@type'];
        // If an application schema is already generated by SEO component, skip duplicate SoftwareApplication/WebApplication
        if ((itemType === 'WebApplication' || itemType === 'SoftwareApplication') && applicationSchema) {
          continue;
        }
        // If standalone SoftwareApplication or WebApplication is passed, guarantee aggregateRating exists
        if (itemType === 'WebApplication' || itemType === 'SoftwareApplication') {
          if (!(item as any).aggregateRating && !(item as any).review) {
            (item as any).aggregateRating = {
              '@type': 'AggregateRating',
              'ratingValue': ratingValue,
              'ratingCount': ratingCount,
              'bestRating': '5',
              'worstRating': '1',
            };
          }
        }
        allSchemas.push(item);
      }
    }
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordString} />
      <meta name="author" content="ToolBasketAI" />
      <link rel="canonical" href={cleanCanonical} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={cleanCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={cleanCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:site" content="@toolbasketai" />
      <meta name="twitter:creator" content="@toolbasketai" />

      {/* Structured Data (JSON-LD) */}
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}
