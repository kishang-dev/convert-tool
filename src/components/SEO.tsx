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
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
  'ToolBasketAI is your all-in-one free online toolkit. Convert PDFs, resize & crop images, format JSON/XML/SQL, generate hashes, build AI resumes, and 75+ free tools — 100% private & secure.';
const DEFAULT_KEYWORDS =
  'free online tools, PDF converter, PDF to Word, Word to PDF, merge PDF, compress PDF, image resizer, image converter, JSON formatter, SQL formatter, AI resume builder, OCR tool, ToolBasketAI';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
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
    if (Array.isArray(structuredData)) {
      allSchemas.push(...structuredData);
    } else {
      allSchemas.push(structuredData);
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
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={cleanCanonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
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
