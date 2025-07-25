import { useEffect } from "react";

export interface ISEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile" | "book";
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  ogLocale?: string;
  twitterCreator?: string;
  twitterSite?: string;
}

const DEFAULT_SEO = {
  title: "React Auth App - Secure Authentication",
  description:
    "A modern React authentication application with secure login, registration, and password reset functionality.",
  keywords: "react, authentication, login, register, password reset, security",
  author: "React Auth App",
  type: "website" as const,
  twitterCard: "summary_large_image" as const,
  ogLocale: "en_US",
};

function SEO({
  title,
  description,
  keywords,
  author,
  image,
  url,
  type = DEFAULT_SEO.type,
  twitterCard = DEFAULT_SEO.twitterCard,
  noIndex = false,
  noFollow = false,
  canonical,
  ogLocale = DEFAULT_SEO.ogLocale,
  twitterCreator,
  twitterSite,
}: ISEOProps) {
  const finalTitle = title
    ? `${title} | ${DEFAULT_SEO.title}`
    : DEFAULT_SEO.title;

  const finalDescription = description || DEFAULT_SEO.description;
  const finalKeywords = keywords || DEFAULT_SEO.keywords;
  const finalAuthor = author || DEFAULT_SEO.author;
  const finalUrl = url || window.location.href;
  const finalImage = image || "/og-image.jpg";

  useEffect(() => {
    document.title = finalTitle;

    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMetaTag("description", finalDescription);
    updateMetaTag("keywords", finalKeywords);
    updateMetaTag("author", finalAuthor);

    const robotsContent = [];

    if (noIndex) robotsContent.push("noindex");
    if (noFollow) robotsContent.push("nofollow");
    if (robotsContent.length === 0) robotsContent.push("index", "follow");

    updateMetaTag("robots", robotsContent.join(", "));

    updatePropertyTag("og:title", finalTitle);
    updatePropertyTag("og:description", finalDescription);
    updatePropertyTag("og:type", type);
    updatePropertyTag("og:url", finalUrl);
    updatePropertyTag("og:image", finalImage);
    updatePropertyTag("og:locale", ogLocale);
    updatePropertyTag("og:site_name", DEFAULT_SEO.title);

    updateMetaTag("twitter:card", twitterCard);
    updateMetaTag("twitter:title", finalTitle);
    updateMetaTag("twitter:description", finalDescription);
    updateMetaTag("twitter:image", finalImage);
    if (twitterCreator) updateMetaTag("twitter:creator", twitterCreator);
    if (twitterSite) updateMetaTag("twitter:site", twitterSite);

    if (canonical) {
      let link = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: finalTitle,
      description: finalDescription,
      url: finalUrl,
      author: {
        "@type": "Organization",
        name: finalAuthor,
      },
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web Browser",
    };

    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");

    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);

    document.head.appendChild(script);
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalAuthor,
    finalUrl,
    finalImage,
    type,
    twitterCard,
    noIndex,
    noFollow,
    canonical,
    ogLocale,
    twitterCreator,
    twitterSite,
  ]);

  return null;
}

export default SEO;
