import type { Metadata } from "next";

export const SITE = {
  name: "MyDocReady",
  url: "https://www.mydocready.com",
  description:
    "Free, privacy-focused online tools to create resumes, prepare passport photos, resize images, convert documents, and calculate everyday finances.",
  locale: "en_IN",
} as const;

/**
 * Convert a relative path into an absolute URL.
 */
export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, SITE.url).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

/**
 * Reusable metadata generator for all MyDocReady pages.
 */
export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    metadataBase: new URL(SITE.url),

    title: {
      default: title,
      template: `%s | ${SITE.name}`,
    },

    description,

    applicationName: SITE.name,

    authors: [
      {
        name: SITE.name,
        url: SITE.url,
      },
    ],

    creator: SITE.name,

    publisher: SITE.name,

    category: "technology",

    alternates: {
      canonical: url,
    },

    robots: {
      index: !noIndex,
      follow: !noIndex,

      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",

      images: [
        {
          url: absoluteUrl("/logo.png"),
          width: 512,
          height: 512,
          alt: `${SITE.name} logo`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/logo.png")],
    },
  };
}