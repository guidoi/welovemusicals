import React, { useEffect, useRef, useState } from "react";

type AffiliateImpressionPixelProps = {
  url: string;
  enabled: boolean;
};

/**
 * Loads one native affiliate impression image immediately after consent when
 * its responsive campaign variant is rendered. This matches standard campaign
 * impression semantics while avoiding the hidden desktop/mobile duplicate.
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

    // The same wide creative can exist in desktop and mobile markup. A hidden
    // breakpoint wrapper has no client rects, so only the active variant loads
    // its advertiser pixel; visible banners need not wait for a user scroll.
    const frame = window.requestAnimationFrame(() => {
      if (target.getClientRects().length > 0) {
        setShouldLoad(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
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
