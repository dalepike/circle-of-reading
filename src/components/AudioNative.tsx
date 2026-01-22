"use client";

import { useEffect, useRef, useState, useId } from "react";

interface AudioNativeProps {
  publicUserId: string;
  size?: "small" | "large";
  textColorRgba?: string;
  backgroundColorRgba?: string;
}

export default function AudioNative({
  publicUserId,
  size = "small",
  textColorRgba = "rgba(0, 0, 0, 1)",
  backgroundColorRgba = "rgba(255, 255, 255, 1)",
}: AudioNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId] = useState(() => `elevenlabs-widget-${Math.random().toString(36).slice(2, 9)}`);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only run once
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const loadScript = () => {
      return new Promise<void>((resolve) => {
        const existingScript = document.querySelector('script[src*="audioNativeHelper"]');
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://elevenlabs.io/player/audioNativeHelper.js";
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    loadScript();

    // No cleanup - let the iframe persist
  }, []);

  const height = size === "small" ? 90 : 120;

  return (
    <div
      ref={containerRef}
      id={widgetId}
      className="elevenlabs-audionative-widget"
      data-height={height}
      data-width="100%"
      data-frameborder="no"
      data-scrolling="no"
      data-publicuserid={publicUserId}
      data-playerurl="https://elevenlabs.io/player/index.html"
      data-small={size === "small"}
      data-textcolor={textColorRgba}
      data-backgroundcolor={backgroundColorRgba}
      style={{ minHeight: `${height}px` }}
    >
      <p className="text-sm text-[var(--color-ink-400)] py-4">
        Loading audio player...
      </p>
    </div>
  );
}
