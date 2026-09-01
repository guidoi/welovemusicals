/**
 * useSEO – Hook zum dynamischen Setzen von Meta-Tags im <head>
 * Aktualisiert: title, description, og:title, og:description, og:image, og:url,
 * twitter:title, twitter:description, twitter:image, twitter:url
 * Setzt außerdem einen <link rel="canonical"> für jede Seite.
 * Beim Unmount werden die ursprünglichen Werte wiederhergestellt.
 */
import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function toAbsoluteUrl(value: string, baseUrl = "https://welovemusicals.com/"): string {
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return value;
  }
}

function setMeta(selector: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (selector.includes('property="')) {
      const prop = selector.match(/property="([^"]+)"/)?.[1] ?? "";
      el.setAttribute("property", prop);
    } else {
      const name = selector.match(/name="([^"]+)"/)?.[1] ?? "";
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string): () => void {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const prev = el?.getAttribute("href") ?? null;
  const created = !el;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
  return () => {
    const canon = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canon) return;
    if (created) {
      canon.remove();
    } else if (prev) {
      canon.setAttribute("href", prev);
    }
  };
}

export function useSEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const prevOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "";
    const prevOgDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? "";
    const prevOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";
    const prevOgUrl = document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "";
    const prevTwTitle = document.querySelector('meta[property="twitter:title"]')?.getAttribute("content") ?? "";
    const prevTwDesc = document.querySelector('meta[property="twitter:description"]')?.getAttribute("content") ?? "";
    const prevTwImage = document.querySelector('meta[property="twitter:image"]')?.getAttribute("content") ?? "";
    const prevTwUrl = document.querySelector('meta[property="twitter:url"]')?.getAttribute("content") ?? "";

    // Set new values
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    if (image) setMeta('meta[property="og:image"]', toAbsoluteUrl(image, window.location.origin));
    if (url) setMeta('meta[property="og:url"]', toAbsoluteUrl(url, window.location.origin));
    setMeta('meta[property="twitter:title"]', title);
    setMeta('meta[property="twitter:description"]', description);
    if (image) setMeta('meta[property="twitter:image"]', toAbsoluteUrl(image, window.location.origin));
    if (url) setMeta('meta[property="twitter:url"]', toAbsoluteUrl(url, window.location.origin));

    // Canonical tag
    const removeCanonical = url ? setCanonical(url) : () => {};

    return () => {
      document.title = prevTitle;
      setMeta('meta[name="description"]', prevDesc);
      setMeta('meta[property="og:title"]', prevOgTitle);
      setMeta('meta[property="og:description"]', prevOgDesc);
      setMeta('meta[property="og:image"]', prevOgImage);
      setMeta('meta[property="og:url"]', prevOgUrl);
      setMeta('meta[property="twitter:title"]', prevTwTitle);
      setMeta('meta[property="twitter:description"]', prevTwDesc);
      setMeta('meta[property="twitter:image"]', prevTwImage);
      setMeta('meta[property="twitter:url"]', prevTwUrl);
      removeCanonical();
    };
  }, [title, description, image, url]);
}
