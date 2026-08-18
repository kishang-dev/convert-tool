import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export type AdFormatType =
  | "responsive"     // Horizontal / Leaderboard (728x90 or Fluid)
  | "rectangle"      // Medium Rectangle (300x250)
  | "in-article"     // Native In-Article Fluid
  | "vertical"       // Skyscraper / Side banner (160x600 / 300x600)
  | "multiplex"      // Recommendation Grid (autorelaxed)
  | "sticky-bottom";  // Fixed bottom bar anchor ad

interface AdBannerProps {
  adSlot?: string;
  adFormat?: AdFormatType;
  adLayout?: string;
  adLayoutKey?: string;
  client?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  forcePreview?: boolean;
}

const DEFAULT_CLIENT_ID = "ca-pub-4813321349853858";
const DEFAULT_SLOT_ID = "2285841467";

export default function AdBanner({
  adSlot = DEFAULT_SLOT_ID,
  adFormat = "responsive",
  adLayout,
  adLayoutKey,
  client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || DEFAULT_CLIENT_ID,
  className = "",
  style,
  label,
  forcePreview = false,
}: AdBannerProps) {
  const router = useRouter();
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);
  const [unfilled, setUnfilled] = useState<boolean>(false);

  // Track route changes so SPA navigation generates a clean, fresh ad element
  const currentPath = router?.asPath || "";

  useEffect(() => {
    if (forcePreview) return;

    pushedRef.current = false;
    setUnfilled(false);
    let timerId: NodeJS.Timeout | null = null;
    let rafId: number | null = null;

    // Detect if the AdSense script failed to load (ad blocker, network error, etc.)
    const blockCheckTimer = setTimeout(() => {
      if (typeof window !== "undefined" && !(window as any).adsbygoogle?.loaded) {
        setBlocked(true);
      }
    }, 3500);

    // Observe AdSense status attributes for unfilled ads
    let observer: MutationObserver | null = null;
    if (adRef.current && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => {
        const adStatus = adRef.current?.getAttribute("data-ad-status");
        if (adStatus === "unfilled") {
          setUnfilled(true);
        }
      });
      observer.observe(adRef.current, {
        attributes: true,
        attributeFilter: ["data-ad-status", "data-adsbygoogle-status"],
      });
    }

    const tryPushAd = () => {
      if (typeof window === "undefined" || !adRef.current || pushedRef.current) {
        return;
      }

      // Check if this specific DOM node was already processed by Google AdSense
      const status = adRef.current.getAttribute("data-adsbygoogle-status");
      if (status) {
        pushedRef.current = true;
        return;
      }

      // Guard against pushing into a zero-width container during initial hydration/render
      const width = adRef.current.offsetWidth;
      if (width === 0) {
        rafId = requestAnimationFrame(tryPushAd);
        return;
      }

      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn("AdSense push warning:", err);
      }
    };

    // Defer push slightly to ensure Next.js route transition and layout settlement are finished
    timerId = setTimeout(() => {
      rafId = requestAnimationFrame(tryPushAd);
    }, 200);

    return () => {
      if (timerId) clearTimeout(timerId);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(blockCheckTimer);
      if (observer) observer.disconnect();
    };
  }, [forcePreview, adSlot, currentPath]);

  // Dimension helpers for preview blueprints
  const getFormatSpecs = () => {
    switch (adFormat) {
      case "rectangle":
        return { name: "Medium Rectangle Ad", size: "300 x 250", height: "min-h-[250px]", width: "w-full max-w-[300px]" };
      case "in-article":
        return { name: "In-Article Native Ad", size: "Fluid Content Flow", height: "min-h-[120px]", width: "w-full" };
      case "vertical":
        return { name: "Skyscraper / Vertical Ad", size: "160 x 600 or 300 x 600", height: "min-h-[600px]", width: "w-full max-w-[300px]" };
      case "multiplex":
        return { name: "Multiplex Content Grid", size: "Grid Recommendations", height: "min-h-[280px]", width: "w-full" };
      case "sticky-bottom":
        return { name: "Sticky Bottom Anchor Ad", size: "728 x 90 Fixed Footer", height: "min-h-[90px]", width: "w-full" };
      case "responsive":
      default:
        return { name: "Display Leaderboard Banner", size: "728 x 90 or Responsive", height: "min-h-[90px]", width: "w-full" };
    }
  };

  const specs = getFormatSpecs();

  // If forced preview or dev mode with placeholder request, render visual AdSense blueprint card
  if (forcePreview) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-dashed border-[var(--accent)]/40 bg-[var(--surface)]/80 p-4 text-center transition-all ${specs.width} ${specs.height} ${className} flex flex-col items-center justify-center shadow-sm`}
        style={style}
      >
        <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
          AdSense Preview ({adFormat})
        </div>

        <div className="z-10 flex flex-col items-center justify-center gap-1">
          <span className="font-['Sora',sans-serif] text-xs uppercase tracking-wider font-extrabold text-[var(--text-muted)]">
            {label || specs.name}
          </span>
          <span className="text-[13px] font-medium text-[var(--text)]">
            Format: <code className="text-[var(--accent)]">{adFormat}</code> | Spec: <span className="font-semibold">{specs.size}</span>
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            Pub ID: <span className="font-mono">{client}</span> | Slot: <span className="font-mono">{adSlot}</span>
          </span>
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>
    );
  }

  // If Google AdSense returns no ad for this slot, collapse container completely (no blank space)
  if (unfilled) {
    return null;
  }

  // Sticky bottom wrapper container
  if (adFormat === "sticky-bottom") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 border-t border-[var(--border)] backdrop-blur-md py-2 px-4 shadow-lg flex justify-center items-center w-full">
        <div className="w-full max-w-[1200px] flex justify-center">
          <ins
            key={`sticky-${adSlot}-${currentPath}`}
            ref={adRef}
            className="adsbygoogle block w-full bg-transparent"
            style={style || { display: "block", width: "100%", height: "90px", minHeight: "90px", backgroundColor: "transparent" }}
            data-ad-client={client}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // Standard Google AdSense <ins> tag rendering
  return (
    <div className={`adsense-wrapper my-4 flex flex-col items-stretch w-full ${className}`}>
      {label && (
        <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider mb-1 text-center">
          {label}
        </span>
      )}

      {/* Guarantees a non-zero width & height container before adsbygoogle.js measures layout */}
      <div className={`w-full flex justify-center ${specs.height}`}>
        <ins
          key={`${adSlot}-${currentPath}`}
          ref={adRef}
          className="adsbygoogle block w-full bg-transparent"
          style={
            style ||
            (adFormat === "rectangle"
              ? { display: "inline-block", width: "300px", height: "250px", minHeight: "250px", backgroundColor: "transparent" }
              : adFormat === "vertical"
                ? { display: "inline-block", width: "300px", height: "600px", minHeight: "600px", backgroundColor: "transparent" }
                : { display: "block", width: "100%", minHeight: "90px", backgroundColor: "transparent" })
          }
          data-ad-client={client}
          data-ad-slot={adSlot}
          {...(adFormat === "in-article"
            ? { "data-ad-layout": "in-article", "data-ad-format": "fluid" }
            : adFormat === "multiplex"
              ? { "data-ad-format": "autorelaxed" }
              : { "data-ad-format": "auto", "data-full-width-responsive": "true" })}
          {...(adLayout ? { "data-ad-layout": adLayout } : {})}
          {...(adLayoutKey ? { "data-ad-layout-key": adLayoutKey } : {})}
        />
      </div>

      {blocked && (
        <span className="text-[10px] text-[var(--text-faint)] mt-1 text-center">
          Ad blocked — disable your ad blocker to support this site.
        </span>
      )}
    </div>
  );
}