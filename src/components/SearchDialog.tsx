import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    pagefind: {
      init?: () => Promise<void>;
      options?: (opts: { excerptLength?: number }) => Promise<void>;
      search: (query: string) => Promise<{
        results: Array<{
          id: string;
          data: () => Promise<{
            url: string;
            meta: { title: string };
            excerpt: string;
          }>;
        }>;
      }>;
    };
  }
}

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagefindLoaded, setPagefindLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Load Pagefind script via module script tag
  useEffect(() => {
    if (pagefindLoaded) return;

    // Create a module script that imports pagefind and exposes it on window
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      try {
        const pagefind = await import('/pagefind/pagefind.js');
        window.pagefind = pagefind;
        window.dispatchEvent(new Event('pagefind-loaded'));
      } catch (e) {
        // Pagefind may not be available in dev mode
        console.debug('Pagefind not available:', e.message);
      }
    `;

    const handleLoaded = async () => {
      if (window.pagefind) {
        try {
          await window.pagefind.options?.({ excerptLength: 20 });
        } catch {
          // options might not exist in all versions
        }
        setPagefindLoaded(true);
      }
    };

    window.addEventListener('pagefind-loaded', handleLoaded, { once: true });
    document.head.appendChild(script);

    return () => {
      window.removeEventListener('pagefind-loaded', handleLoaded);
    };
  }, [pagefindLoaded]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !window.pagefind) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const search = await window.pagefind.search(searchQuery);
      const resultData = await Promise.all(
        search.results.slice(0, 8).map(async (result) => {
          const data = await result.data();
          return {
            url: data.url,
            title: data.meta.title,
            excerpt: data.excerpt,
          };
        })
      );
      setResults(resultData);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
    setIsLoading(false);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs font-sans font-light text-[var(--color-gray-400)] hover:text-white light:hover:text-black transition-colors duration-200"
        aria-label="Search"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="hidden sm:inline uppercase tracking-widest">Search</span>
      </button>

      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/80 light:bg-white/80 backdrop-blur-sm animate-fadeIn">
          <div
            ref={dialogRef}
            className="w-full max-w-lg mx-4 bg-black light:bg-white border border-[var(--color-gray-800)] light:border-[var(--color-gray-200)] overflow-hidden animate-slideUp"
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 p-5 border-b border-[var(--color-gray-800)] light:border-[var(--color-gray-200)]">
              <svg
                className="w-5 h-5 text-[var(--color-gray-500)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or theme..."
                className="flex-1 bg-transparent text-lg font-serif outline-none placeholder:text-[var(--color-gray-600)]"
              />
              {isLoading && (
                <div className="w-4 h-4 border border-white light:border-black border-t-transparent rounded-full animate-spin" />
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-sans font-light uppercase tracking-widest text-[var(--color-gray-500)] hover:text-white light:hover:text-black transition-colors"
              >
                esc
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {!pagefindLoaded ? (
                <div className="p-8 text-center text-sm font-sans text-[var(--color-gray-500)]">
                  Loading search...
                </div>
              ) : results.length > 0 ? (
                <ul className="py-2">
                  {results.map((result, index) => (
                    <li key={index}>
                      <a
                        href={result.url}
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col gap-2 px-5 py-4 hover:bg-[var(--color-gray-900)] light:hover:bg-[var(--color-gray-50)] transition-colors duration-200"
                      >
                        <span className="font-serif text-lg">
                          {result.title}
                        </span>
                        <span
                          className="text-sm font-serif text-[var(--color-gray-400)] light:text-[var(--color-gray-500)] line-clamp-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="p-8 text-center text-sm font-sans text-[var(--color-gray-500)]">
                  No results for "{query}"
                </div>
              ) : (
                <div className="p-8 text-center text-sm font-sans text-[var(--color-gray-500)]">
                  Type to search...
                </div>
              )}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div className="px-5 py-4 text-xs font-sans font-light text-[var(--color-gray-500)] border-t border-[var(--color-gray-800)] light:border-[var(--color-gray-200)]">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
