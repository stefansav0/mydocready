import type { Metadata } from "next";

export const SITE = {
  name: "MyDocReady",
  url: "https://mydocready.com",
  description:
    "Free, privacy-focused tools to create resumes, prepare passport photos, resize images, convert documents, and calculate everyday finances.",
  locale: "en_IN",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE.url).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: path },
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
      title: `${title} | ${SITE.name}`,
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
      card: "summary",
      title: `${title} | ${SITE.name}`,
      description,
      images: [absoluteUrl("/logo.png")],
    },
  };
}
