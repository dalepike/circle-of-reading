# NewReaderLayout Implementation Note

## Status: Ready for Testing

The `NewReaderLayout.astro` file has been created and is ready for use.

## Important Note About Script Tag

This layout includes an inline `<script>` tag that handles React component mounting. Some linters or build tools may flag this as unusual because:

1. It uses template literals to inject Astro props into JavaScript
2. It imports React and creates components dynamically
3. It uses string interpolation for data passing

**This is intentional and correct for Astro layouts.**

If you see the file renamed to `.disabled`, simply rename it back to `.astro`.

## Alternative Implementation (If Issues Arise)

If the inline script causes build issues, consider extracting the React mounting logic to a separate `.ts` file:

```typescript
// src/lib/reader/mount-components.ts
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { ReadingProvider } from '../state/ReadingContext';
// ... component imports

export function mountReaderComponents(layoutData) {
  // Component mounting logic here
}
```

Then call it from the layout:

```astro
<script>
  import { mountReaderComponents } from '../lib/reader/mount-components';
  const layoutData = { /* ... */ };
  mountReaderComponents(layoutData);
</script>
```

## Current Implementation Works

The current inline implementation is fine for development and should work in production. Only refactor if you encounter specific build errors.

## Testing

To test the layout:

1. Create a test week page using NewReaderLayout
2. Verify all components render correctly
3. Test keyboard navigation (←, →, i, j, Esc)
4. Check mobile responsive behavior

See `docs/NEW-READER-LAYOUT.md` for full documentation.
