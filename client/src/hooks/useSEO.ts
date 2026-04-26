/**
 * useSEO – Hook zum dynamischen Setzen von Meta-Tags im <head>
 * Aktualisiert: title, description, og:title, og:description, og:image, og:url,
 * twitter:title, twitter:description, twitter:image
 * Beim Unmount werden die ursprünglichen Werte wiederhergestellt.
 */
import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

function setMeta(selector: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    // Determine attribute type from selector
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

    // Set new values
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    if (image) setMeta('meta[property="og:image"]', image);
    if (url) setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="twitter:title"]', title);
    setMeta('meta[property="twitter:description"]', description);
    if (image) setMeta('meta[property="twitter:image"]', image);

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
    };
  }, [title, description, image, url]);
}
