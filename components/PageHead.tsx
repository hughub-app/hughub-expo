import Head from "expo-router/head";
import React from "react";

interface PageHeadProps {
  title?: string;
  description?: string;
  image?: string; // for social/OG preview
  noIndex?: boolean; // useful for private pages
}

export function PageHead({
  title,
  description,
  image,
  noIndex = false,
}: PageHeadProps) {
  const appName = "HugHub";
  const fullTitle = title ? `${title} | ${appName}` : appName;

  return (
    <Head>
      {/* Basic */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* SEO control */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={appName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}