import { useState, useEffect } from "react";

interface MicroHeaderProps {
  week: number;
  title: string;
  month: string;
  russianTitle?: string;
  volume?: number;
  onHeaderClick: () => void; // Opens jump drawer
  onPrevClick: () => void;
  onNextClick: () => void;
  onIndexClick: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function MicroHeader({
  week,
  title,
  month,
  russianTitle,
  volume,
  onHeaderClick,
  onPrevClick,
  onNextClick,
  onIndexClick,
  hasPrev,
  hasNext,
}: MicroHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          if (hasPrev) {
            e.preventDefault();
            onPrevClick();
          }
          break;
        case "ArrowRight":
          if (hasNext) {
            e.preventDefault();
            onNextClick();
          }
          break;
        case "i":
          e.preventDefault();
          onIndexClick();
          break;
        case "j":
          e.preventDefault();
          onHeaderClick();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, onPrevClick, onNextClick, onIndexClick, onHeaderClick]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 h-14 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline px-2 py-1 text-sm font-sans font-semibold">Circle of Reading</span>
            <span className="w-8 h-8" />
          </div>
          <span className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <span className="w-8 h-8" />
            <span className="w-8 h-8" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 h-14 bg-black/80 backdrop-blur-sm border-b border-gray-800 light:bg-white/80 light:border-gray-200">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left Section: Home Link + Prev Arrow */}
        <div className="flex items-center gap-1">
          {/* Home Link */}
          <a
            href="/"
            className="hidden sm:flex items-center px-2 py-1 text-sm font-sans font-semibold tracking-tight text-white light:text-black transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2 light:focus-visible:outline-black"
            title="Home (i)"
          >
            Circle of Reading
          </a>

          {/* Prev Arrow */}
          <button
            onClick={onPrevClick}
            disabled={!hasPrev}
            className="flex items-center justify-center w-8 h-8 transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2 disabled:opacity-30 disabled:cursor-not-allowed light:focus-visible:outline-black"
            aria-label="Previous week"
            title="Previous week (←)"
          >
          <svg
            className="w-5 h-5 text-white light:text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        </div>

        {/* Center Section: Clickable Week Info (opens Jump Drawer) */}
        <button
          onClick={onHeaderClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 -mx-4 transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2 light:focus-visible:outline-black"
          aria-label={`Jump to week. Current: Week ${week}, ${title}, ${month}${russianTitle ? `, ${russianTitle}` : ""}`}
          title="Jump to week (j)"
        >
          {/* Week Badge */}
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-sans font-medium bg-gray-800 text-white rounded light:bg-gray-200 light:text-black">
            W{week.toString().padStart(2, "0")}
          </span>

          {/* Title and Month - truncated on small screens */}
          <span className="font-sans text-sm font-light text-white light:text-black truncate max-w-md">
            <span className="hidden sm:inline">{title}</span>
            <span className="hidden sm:inline mx-2 text-gray-500 light:text-gray-400">
              ·
            </span>
            <span className="text-gray-400 light:text-gray-600">{month}</span>
          </span>

          {/* Optional: Volume indicator (subtle) */}
          {volume && (
            <span className="hidden md:inline text-xs text-gray-600 light:text-gray-400">
              Vol. {volume}
            </span>
          )}
        </button>

        {/* Right Section: Index Button + Next Arrow */}
        <div className="flex items-center gap-2">
          {/* Index/Grid Button */}
          <button
            onClick={onIndexClick}
            className="flex items-center justify-center w-8 h-8 transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2 light:focus-visible:outline-black"
            aria-label="Open calendar index"
            title="Calendar index (i)"
          >
            <svg
              className="w-5 h-5 text-white light:text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {/* 3x3 Grid Icon */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h4M4 12h4M4 18h4M10 6h4M10 12h4M10 18h4M16 6h4M16 12h4M16 18h4"
              />
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            onClick={onNextClick}
            disabled={!hasNext}
            className="flex items-center justify-center w-8 h-8 transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2 disabled:opacity-30 disabled:cursor-not-allowed light:focus-visible:outline-black"
            aria-label="Next week"
            title="Next week (→)"
          >
            <svg
              className="w-5 h-5 text-white light:text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
