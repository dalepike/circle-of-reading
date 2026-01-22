# Monthly Readings: Translation & Review Plan

**Date:** 2026-01-20
**Status:** Planning
**Source:** PSS Volumes 41-42 (Russian Jubilee Edition)

---

## Executive Summary

The Circle of Reading (*Krug Chteniya*) contains 12 monthly readings, one for each month. This plan covers **two parallel workstreams**:

1. **REVIEW TRACK:** Verify completeness and accuracy of existing 8 translations
2. **TRANSLATION TRACK:** Translate the remaining 4 months (January, July, September, December)

Both tracks share the same source research phase and proceed in parallel to ensure a comprehensive, consistent final collection.

---

## Project Scope Overview

| Track | Months | Deliverables |
|-------|--------|--------------|
| **Review** | Feb, Mar, Apr, May, Jun, Aug, Oct, Nov | Verification reports, corrections, enhanced notes |
| **Translation** | Jan, Jul, Sep, Dec | New translation files |
| **Unified** | All 12 | Consistency audit, style guide, final QA |

---

## Current State

### Existing Translations (8 months)

| Month | Title | Author | Pages | Words | Review Status |
|-------|-------|--------|-------|-------|---------------|
| February | From "Whom to Serve?" | A.I. Arkhangelsky (Buka) | 397-398 | ~685 | Pending |
| March | From "Whom to Serve?" | A.I. Arkhangelsky (Buka) | 398-401 | ~1,300 | Pending |
| April | From "Patriotism and Government" | Leo Tolstoy | 400-401 | ~750 | Pending |
| May | Voluntary Slavery and Military Refusal | La Boétie + Škarvan | 402-407 | ~2,900 | Pending |
| June | Life and Death of E.N. Drozhzhin | E.I. Popov | 404-405 | ~600 | Pending |
| August | From "Whom to Serve?" | A.I. Arkhangelsky (Buka) | 404-406 | ~600 | Pending |
| October | From "Whom to Serve?" | A.I. Arkhangelsky (Buka) | 407-410 | ~750 | Pending |
| November | Labor and Idleness | T.M. Bondarev (+ Tolstoy preface) | 411-421 | ~2,700 | Pending |

**Total existing:** ~10,285 words across 8 readings

### Missing Translations (4 months)

| Month | Translation Status |
|-------|-------------------|
| January | Not translated |
| July | Not translated |
| September | Not translated |
| December | Not translated |

### Observations Requiring Investigation

1. **Page overlaps** - Multiple readings cite overlapping page ranges (e.g., April 400-401 overlaps March 398-401)
2. **"Whom to Serve?" distribution** - 5 of 8 readings are excerpts from same source; verify this matches PSS structure
3. **Missing russianTitle** - Some existing files lack `russianTitle` field
4. **Censorship notes** - Some readings note censorship; verify nothing was omitted

---

## TRACK A: Review of Existing Translations

### A1. Source Verification

For each existing translation, verify against PSS source:

| Check | Description |
|-------|-------------|
| **Completeness** | Does translation include all content from cited pages? |
| **Accuracy** | Spot-check key passages against Russian original |
| **Page citations** | Are page numbers correct? |
| **Attribution** | Is author correctly identified? |
| **Omissions** | Were any sections skipped or summarized? |

#### Review Checklist per Reading

```markdown
## [Month] Monthly Reading Review

### Source Verification
- [ ] Located in PSS Volume __ pages __
- [ ] Page citation in frontmatter is correct
- [ ] All content from source pages is translated
- [ ] No unexplained omissions

### Translation Quality
- [ ] Spot-check 3 passages against Russian
- [ ] Biblical quotations use consistent style
- [ ] Proper nouns transliterated consistently
- [ ] Technical/archaic terms handled appropriately

### Translator's Notes
- [ ] Author biographical info present and accurate
- [ ] Publication history documented
- [ ] Historical context sufficient
- [ ] Censorship notes where applicable
- [ ] Cross-references to related readings

### Frontmatter
- [ ] title - correct format
- [ ] russianTitle - present and accurate
- [ ] author - correct attribution
- [ ] month - lowercase, correct
- [ ] type - "monthly"
- [ ] volume - correct (41 or 42)
- [ ] pages - verified against source
- [ ] slug - URL-safe, matches filename
```

### A2. Consistency Audit

Cross-translation consistency checks:

| Element | Standard | Check |
|---------|----------|-------|
| Biblical quotes | Match established style (KJV-adjacent) | Compare across all 8 |
| Names | Consistent transliteration | Create name index |
| Dates | Consistent format | Review all date references |
| Terminology | Key terms translated consistently | Build glossary |
| Tone | Formal literary English | Style comparison |

### A3. Structural Verification

Verify the "Whom to Serve?" serialization:

| Month | Chapter/Section | Verified |
|-------|-----------------|----------|
| February | Chapter IV | Pending |
| March | Chapter III | Pending |
| August | [Unknown] | Pending |
| October | [Unknown] | Pending |

**Question:** Are these excerpts presented in the correct order? Does the original work have more chapters that should be included?

### A4. Review Deliverables

For each existing translation:

1. **Verification Report** (markdown file)
   - Source confirmation
   - Quality assessment
   - Issues found
   - Corrections needed

2. **Corrections** (if needed)
   - Updated translation text
   - Enhanced translator's notes
   - Frontmatter fixes

3. **Consistency Updates**
   - Terminology standardization
   - Style alignment

---

## TRACK B: Translation of Missing Months

### B1. Source Identification

**Research tasks:**

1. **Obtain PSS Volume 42 table of contents**
   - Source: [Wikimedia Commons PSS Volume 42 PDF](https://commons.wikimedia.org/wiki/File:L._N._Tolstoy._All_in_90_volumes._Volume_42.pdf)
   - Identify section: "Недельные чтения" or equivalent
   - Locate pages for January, July, September, December

2. **Check PSS Volume 41**
   - Volume 41 contains first part of Krug Chteniya
   - Some monthly readings may be there

3. **Verify 1906 edition structure**
   - Original *Krug Chteniya* (Посредник, 1906)
   - Free Word Press editions for censored material

4. **Confirm 12-month structure**
   - Did Tolstoy actually include readings for all 12 months?
   - Or were some months intentionally without monthly readings?

### B2. Content Identification

Probable content for missing months (to be verified):

| Month | Probable Content | Research Notes |
|-------|------------------|----------------|
| January | Opening/thematic introduction | First month may set annual theme |
| July | Continuation of serialized work | Pattern suggests more "Whom to Serve?" or similar |
| September | Essay on faith/labor/non-resistance | Fits thematic pattern |
| December | Concluding essay or synthesis | Final month may conclude cycle |

### B3. Translation Scope

| Month | Est. Russian | Est. English | Complexity |
|-------|--------------|--------------|------------|
| January | 1,500-2,500 | 1,200-2,200 | Unknown |
| July | 1,000-2,000 | 800-1,800 | Unknown |
| September | 1,500-3,000 | 1,200-2,700 | Unknown |
| December | 2,000-3,500 | 1,700-3,000 | Unknown |
| **Total** | **6,000-11,000** | **5,000-9,700** | — |

### B4. Translation Deliverables

Each new translation:

```markdown
---
title: '[Month] Monthly Reading: [Title]'
russianTitle: "[Russian title]"
author: "[Author name]"
month: "[month]"
type: "monthly"
volume: [41 or 42]
pages: "[page range]"
slug: "[month]-monthly-[title-slug]"
---

[Main content translation]

---

**Translator's Notes:**
- [Historical context]
- [Biographical information]
- [Source references]
- [Censorship notes if applicable]
```

---

## UNIFIED: Cross-Project Deliverables

### Style Guide

Create `TRANSLATION-STYLE-GUIDE.md` documenting:

1. **Transliteration system** (Russian names, titles)
2. **Biblical quotation style** (which English Bible version)
3. **Date formats** (Julian vs. Gregorian calendar handling)
4. **Terminology glossary** (key philosophical/religious terms)
5. **Footnote conventions** (translator's notes format)
6. **Frontmatter standards** (required fields, formats)

### Name & Term Index

Create reference document:

| Russian | English | Notes |
|---------|---------|-------|
| Бука | Buka | Pen name of Arkhangelsky |
| Недельные чтения | Weekly readings | — |
| ... | ... | ... |

### Final QA Checklist

Before declaring project complete:

- [ ] All 12 monthly readings present
- [ ] All pass source verification
- [ ] Consistency audit complete
- [ ] Style guide followed
- [ ] Build passes
- [ ] Search indexes all readings
- [ ] Navigation works correctly

---

## Project Phases (Integrated Timeline)

### Phase 1: Source Research (Weeks 1-2)

**Shared work for both tracks:**

- [ ] Download PSS Volume 42 PDF
- [ ] Download PSS Volume 41 PDF
- [ ] Create table of contents for monthly readings section
- [ ] Identify all 12 monthly readings in source
- [ ] Document page ranges for each month
- [ ] Note any censorship or variant editions
- [ ] Photograph/scan relevant pages for reference

**Outputs:**
- Source mapping document
- Page-by-page index
- Censorship notes

### Phase 2: Parallel Execution (Weeks 3-10)

#### Track A: Review (Weeks 3-6)

| Week | Readings | Deliverables |
|------|----------|--------------|
| 3 | February, March | 2 verification reports |
| 4 | April, May | 2 verification reports |
| 5 | June, August | 2 verification reports |
| 6 | October, November | 2 verification reports |

#### Track B: Translation (Weeks 3-10)

| Week | Activity | Deliverable |
|------|----------|-------------|
| 3-4 | January translation | Draft + notes |
| 5-6 | July translation | Draft + notes |
| 7-8 | September translation | Draft + notes |
| 9-10 | December translation | Draft + notes |

### Phase 3: Consistency & Integration (Weeks 11-12)

- [ ] Cross-translation consistency audit
- [ ] Create style guide from patterns
- [ ] Apply corrections to existing translations
- [ ] Finalize new translations
- [ ] Build terminology glossary

### Phase 4: Technical Integration (Week 13)

- [ ] Update/create all markdown files
- [ ] Verify frontmatter consistency
- [ ] Build and test locally
- [ ] Verify monthly index page
- [ ] Test search indexing
- [ ] Deploy to production

### Phase 5: Final QA (Week 14)

- [ ] Complete QA checklist
- [ ] User acceptance testing
- [ ] Documentation finalization
- [ ] Project closeout

---

## Resource Requirements

### Source Materials

| Material | Purpose | Source |
|----------|---------|--------|
| PSS Volume 41 | First half of Krug Chteniya | Wikimedia Commons |
| PSS Volume 42 | Second half + editorial notes | Wikimedia Commons |
| 1906 Посредник edition | Original publication comparison | Archive.org / libraries |
| Free Word Press editions | Censored material | Archive.org |

### Reference Materials

- Russian-English dictionary (19th century religious vocabulary)
- Bible, Synodal translation (Russian biblical quotes)
- Bible, KJV/RSV (English biblical quotes)
- Existing translations (style reference)

### Tools

- PDF reader with annotation
- Russian OCR (if needed for scans)
- Translation memory software (optional)
- Markdown editor
- Version control (git)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Source unavailable | Low | High | Multiple sources (PSS, archive.org, libraries) |
| Fewer than 12 readings exist | Medium | Medium | Document actual structure; adjust scope |
| Existing translations have significant errors | Low | High | Budget time for corrections |
| Censorship makes reconstruction difficult | Medium | Medium | Use Free Word Press editions |
| Translation complexity exceeds estimate | Medium | Medium | Build in buffer; prioritize |
| Inconsistency across translations | Medium | Medium | Style guide + consistency pass |

---

## Success Criteria

### Completeness
- [ ] All 12 monthly readings available (or documented why fewer exist)
- [ ] Each reading verified against PSS source

### Accuracy
- [ ] Source verification complete for all translations
- [ ] Spot-checks pass for each reading
- [ ] No significant omissions

### Consistency
- [ ] Style guide created and followed
- [ ] Terminology consistent across all 12
- [ ] Frontmatter standardized

### Documentation
- [ ] Translator's notes complete for each reading
- [ ] Source citations accurate
- [ ] Historical context provided

### Technical
- [ ] All readings build without errors
- [ ] Search indexes correctly
- [ ] Navigation functions properly
- [ ] Deployed to production

---

## Appendix A: Existing Translation Analysis

### Structural Patterns

**Title Format:**
- `[Month] Monthly Reading: [Topic or "From [Title]"]`

**Author Attribution:**
- Primary author in `author` field
- Additional contributors in title or body
- Tolstoy prefaces noted when present

**Translator's Notes Content:**
1. Biographical information about author
2. Publication history of source text
3. Historical context for events mentioned
4. Cross-references to related readings
5. Notes on censorship when applicable

**Word Count Distribution:**
- Short: ~600 words (June, August)
- Medium: ~750-1,300 words (February, March, April, October)
- Long: ~2,700-2,900 words (May, November)

### "Whom to Serve?" Analysis

Five readings draw from Arkhangelsky's "Whom to Serve?" (*Komu sluzhit'?*):

| Month | Pages | Chapter | Content Focus |
|-------|-------|---------|---------------|
| February | 397-398 | IV | Idol worship in religion and society |
| March | 398-401 | III | Old Testament kings, Samuel |
| August | 404-406 | ? | Dialogue with police inspector |
| October | 407-410 | ? | Religious persecution, reason vs. institutions |
| [Others?] | ? | ? | To be determined |

**Questions to resolve:**
1. How many chapters does "Whom to Serve?" have?
2. Are all chapters represented in monthly readings?
3. Are they presented in order?
4. Should missing chapters be translated?

---

## Appendix B: Frontmatter Field Reference

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| title | Yes | String | "February Monthly Reading: From 'Whom to Serve?'" |
| russianTitle | Yes | String (transliterated) | "Iz 'Komu sluzhit'?'" |
| author | Yes | String | "A. I. Arkhangelsky (pen name: Buka)" |
| month | Yes | Lowercase string | "february" |
| type | Yes | "monthly" | "monthly" |
| volume | Yes | Number | 42 |
| pages | Yes | String | "397-398" |
| slug | Yes | URL-safe string | "february-monthly-whom-to-serve" |

---

## Appendix C: Review Report Template

```markdown
# [Month] Monthly Reading: Review Report

**Reviewed:** [Date]
**Reviewer:** [Name]
**Source:** PSS Volume [#], pages [###-###]

## Source Verification

### Page Citation
- **Frontmatter states:** pages [X-Y]
- **Actual location:** pages [X-Y]
- **Status:** ✅ Correct / ⚠️ Incorrect (should be [Z])

### Completeness
- **Source content:** [X] paragraphs / [Y] words
- **Translation content:** [X] paragraphs / [Y] words
- **Status:** ✅ Complete / ⚠️ Partial ([details])

### Omissions
- [ ] None found
- [ ] Omissions identified: [list]

## Translation Quality

### Spot-Check Results

| Passage | Russian | Translation | Assessment |
|---------|---------|-------------|------------|
| Opening | [quote] | [quote] | ✅/⚠️ |
| Key term | [quote] | [quote] | ✅/⚠️ |
| Closing | [quote] | [quote] | ✅/⚠️ |

### Biblical Quotations
- [ ] Style consistent with other readings
- [ ] Source identified in notes

### Terminology
- [ ] Key terms consistent with glossary
- [ ] Archaic terms handled appropriately

## Translator's Notes

- [ ] Author biography: ✅ Present / ⚠️ Missing/Incomplete
- [ ] Publication history: ✅ Present / ⚠️ Missing/Incomplete
- [ ] Historical context: ✅ Present / ⚠️ Missing/Incomplete
- [ ] Censorship notes: ✅ Present / ⚠️ Missing / N/A

## Frontmatter

| Field | Value | Status |
|-------|-------|--------|
| title | [value] | ✅/⚠️ |
| russianTitle | [value] | ✅/⚠️ |
| author | [value] | ✅/⚠️ |
| month | [value] | ✅/⚠️ |
| type | [value] | ✅/⚠️ |
| volume | [value] | ✅/⚠️ |
| pages | [value] | ✅/⚠️ |
| slug | [value] | ✅/⚠️ |

## Issues Found

1. [Issue description]
2. [Issue description]

## Corrections Needed

1. [Correction description]
2. [Correction description]

## Overall Assessment

- [ ] ✅ Approved - no changes needed
- [ ] ⚠️ Minor corrections needed
- [ ] ❌ Significant revision required
```

---

## Next Steps

1. **Immediate:** Acquire PSS Volumes 41-42 PDFs
2. **This week:** Create source mapping for all 12 months
3. **Begin Phase 2:** Start review of February reading + January source identification in parallel

---

*Document created: 2026-01-20*
*Last updated: 2026-01-20*
*Version: 2.0 - Expanded to include review track*
