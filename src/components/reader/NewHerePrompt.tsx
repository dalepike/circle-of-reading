/**
 * NewHerePrompt - Subtle prompt for deep link visitors who haven't been introduced
 * Shows only if: no visitor state AND no existing progress
 */

import { useState, useEffect } from 'react';
import { loadVisitorState, hasExistingProgress } from '../../lib/state/visitor';

export function NewHerePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const state = loadVisitorState();
    // Show only if: no visitor state AND no existing progress
    if (!state && !hasExistingProgress()) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    // Return focus to main content
    document.querySelector<HTMLElement>('main')?.focus();
  };

  if (!show) return null;

  return (
    <aside
      role="complementary"
      aria-label="Introduction prompt"
      className="fixed bottom-4 right-4 bg-[var(--color-gray-900)] light:bg-white border border-[var(--color-gray-700)] light:border-[var(--color-gray-200)] p-4 rounded-lg shadow-lg max-w-xs z-50"
    >
      <p className="text-sm font-serif text-[var(--color-gray-200)] light:text-[var(--color-gray-700)] mb-3">
        New here?
      </p>
      <div className="flex items-center gap-3">
        <a
          href="/welcome/"
          className="text-sm font-sans underline text-[var(--color-gray-300)] light:text-[var(--color-gray-600)] hover:text-white light:hover:text-black hover:no-underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Learn about this project
        </a>
        <button
          onClick={handleDismiss}
          className="text-sm font-sans text-[var(--color-gray-500)] hover:text-[var(--color-gray-300)] light:hover:text-[var(--color-gray-700)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          aria-label="Dismiss introduction prompt"
        >
          Dismiss
        </button>
      </div>
    </aside>
  );
}
