# Homepage Redesign Brainstorm

**Date:** 2026-01-22
**Status:** Ready for planning

---

## What We're Building

A two-page homepage experience that distinguishes first-time visitors from returning readers.

### `/welcome` — Story-First Landing

For new visitors who haven't been introduced to the project:

- **Lead with your narrative** — The discovery of Tolstoy's *Krug Chteniya*, the missing weekly readings in English translations, using AI to democratize what was once scholarly work
- **Book publisher aesthetic** — Elegant, literary, restrained (Penguin/Knopf inspiration)
- **Modern minimalism** — Words as the only ornament; intentional white space
- **Clear transition** — "Read this week's entry" as primary CTA, "Browse the calendar" as secondary
- **Sets localStorage flag** — Marks visitor as "introduced" so they skip this on return

### `/` — Minimal Reader Launcher

For returning visitors (or anyone who's seen the welcome):

- **Ruthlessly minimal** — Just the essentials, no story
- **This week's reading** — Personalized link based on current date
- **Continue where you left off** — If progress exists
- **Browse calendar** — Access to full 52-week structure
- **Auto-redirect** — First-time visitors redirect to `/welcome`

---

## Why This Approach

**Problem:** The current site has good navigation concepts but lacks cohesive identity. White space feels accidental rather than purposeful.

**Solution:** Separate the two distinct user journeys:
1. **Discovery** — New visitors need context and story to understand what makes this project meaningful
2. **Reading** — Returning visitors want immediate access to content

A two-page split respects both needs fully. The welcome page can be crafted like a book's opening pages—thoughtful, unhurried. The homepage stays ruthlessly minimal.

**Why not single-page or modal?**
- Single-page scroll: Complex state management, harder to achieve "minimal" feeling for returners
- Modal: Story deserves more presence than a dismissable overlay

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Visual identity** | Modern minimalism | Clean, stark, contemporary—let words be the ornament |
| **Reference aesthetic** | Book publishers | Penguin, Knopf—elegant, literary, restrained |
| **First-time experience** | Story-first | The journey IS the hook—why this exists before what it is |
| **Primary CTA** | "This week's reading" | Personalized, relevant, immediate—not abstract browsing |
| **Return experience** | Minimal launcher | Just essentials: continue, this week, browse |
| **Architecture** | Two-page split | Clean separation; each page has one job |

---

## The Story to Tell

From your LinkedIn article:

> Your wife mentioned reading Tolstoy's *A Calendar of Wisdom*. Research revealed the original Russian title was *Krug Chteniya* (Circle of Reading), and critically—English translations omitted the weekly readings from the Russian source material.

> Using AI tools, you extracted and translated the missing weekly readings from Russian academic PDFs. Not for perfect accuracy, but to demonstrate: "A curious person with an afternoon and access to the right tools can now accomplish things that were previously impossible."

The welcome page should convey:
1. The discovery (missing content in translations)
2. The solution (AI-assisted extraction)
3. The significance (democratized capability)
4. The invitation (read with us)

---

## Open Questions

1. **Welcome page layout** — Single scrolling narrative? Sections with visual breaks? How much of the LinkedIn story verbatim vs. condensed?
2. **Typography refinement** — Current fonts (Cormorant Garamond + Inter) fit the vision, but sizing/spacing may need tuning for the "intentional white space" goal
3. **Calendar grid on homepage** — Keep the 12-month view? Simplify to just links? How minimal is minimal?
4. **Progress visualization** — Show reading progress on minimal launcher? Or keep it truly sparse?

---

## Next Steps

Run `/workflows:plan` to create detailed implementation specs for:
- `/welcome` page structure and content
- Refactored `/` homepage as minimal launcher
- localStorage visitor state management
- Visual design system refinements (spacing, typography)
