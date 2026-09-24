import React, { useEffect, useRef, useState } from "react";

type AffiliateImpressionPixelProps = {
  url: string;
  enabled: boolean;
};

/**
 * Loads one native affiliate impression image only after consent and once its
 * enclosing campaign is actually visible. This avoids hidden responsive
 * duplicates while retaining the advertiser's standard image-request signal.
 */
export default function AffiliateImpressionPixel({
  url,
  enabled,
}: AffiliateImpressionPixelProps) {
  const pixelRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setShouldLoad(false);
      return;
    }

    const target = pixelRef.current;
    if (!target) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { threshold: 0.01 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, url]);

  return (
    <img
      ref={pixelRef}
      src={shouldLoad ? url : undefined}
      alt=""
      aria-hidden="true"
      width={1}
      height={1}
      data-testid="affiliate-impression-pixel"
      className="pointer-events-none absolute h-px w-px opacity-0"
    />
  );
}
