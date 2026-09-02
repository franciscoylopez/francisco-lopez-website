---
canonical: https://franciscolopez.es/en/accesibilidad
lang: en
title: Accessibility
description: "How this site is built to be usable by everyone: WCAG 2.2 AA met, a colour system at AAA, what gets inherited from the component layer, and what the manual screen reader pass turned up."
last-updated: 2026-08-10
---

1. [Home](https://franciscolopez.es/en)
2. Accessibility

Commitment

# Accessibility

Here accessibility is a release gate, not an add-on: anyone (using a mouse, a keyboard or a screen reader, with or without colour vision) can read and navigate this site without barriers. And it's not a promise: it's measured.

AA

WCAG 2.2 conformance

AAA

Colour system

0

axe violations

100

Lighthouse accessibility

Contents

Every section closes on its own: you can read it in chunks, in any order. **8** sections

1. [01 · Conformance](#s01)
2. [02 · What's been done](#s02)
3. [03 · Inherited accessibility](#s03)
4. [04 · Verification](#s04)
5. [05 · The blind spot](#s05)
6. [06 · Limits](#s06)
7. [07 · The word](#s07)
8. [08 · Contact](#s08)

## What it meets, and how that is proven

The declared level, the checks that close every page, what is inherited from the component layer, and who verifies it.

- 01 · Conformance
- 02 · What's been done
- 03 · Inherited accessibility
- 04 · Verification

01 — Conformance

## 01. WCAG 2.2 AA met, with contrast measured

Contrast is measured, not estimated. Body text reaches 13.79:1 in light and 15.32:1 in dark; links and action buttons exceed 7:1 in both themes. AA requires 4.5:1, cleared with room to spare.

Last accessibility review: 27 August 2026 (2026-08-27).

### Standard

WCAG 2.2, levels A and AA.

### Status

AA met across the whole site.

### Colour system

AAA in light and dark, with contrast measured.

### European standard

Aligned with the criteria of EN 301 549, which points to WCAG.

The [European Accessibility Act](https://eur-lex.europa.eu/eli/dir/2019/882/oj) covers commercial products and services (e-commerce, banking, transport), not a personal site: saying this one «complies with the EAA» would be inaccurate. What does apply is its technical reference standard, [EN 301 549 (PDF)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf), which points to [WCAG](https://www.w3.org/TR/WCAG22/). That is the criterion followed here.

1 of 8

[Contents](#indice) · [Next: 02 · What's been done](#s02)

02 — What's been done

## 02. The same checks that close every page

In plain language and with the WCAG criterion each one covers.

1. Contrast measured in both themes
  
  WCAG 1.4.3 · 1.4.11
  
  Every piece of text and every control is checked with a number in light and dark, including hover and focus states. The few cases where the background is a photo or a translucent bar are set aside: there is no single colour to measure there, so they get looked at by eye.
2. Focus always visible
  
  WCAG 2.4.7
  
  Every interactive element shows a 2px focus ring with an offset; the indicator is never removed without a replacement.
3. Generous tap areas
  
  WCAG 2.5.8 (exceeded)
  
  Touch targets are at least 44×44px, including small controls like the breadcrumb or the theme switch.
4. Logical structure and order
  
  WCAG 1.3.1 · 2.4.6
  
  A single main heading per page and a hierarchy with no skipped levels; reading order matches source order, for screen readers and keyboard navigation.
5. Clear location
  
  WCAG 2.4.8
  
  Inner pages carry a breadcrumb that shows where you are within the site.
6. Never colour alone
  
  WCAG 1.4.1
  
  No state or category is signalled by colour only: there's always text or shape as well.
7. Reduced motion respected
  
  WCAG 2.3.3
  
  If your system asks for less animation, transitions and reveals are turned off.
8. Text alternatives
  
  WCAG 1.1.1
  
  Images that carry information have alt text; decorative ones are hidden from assistive technology.
9. A keyboard way out
  
  WCAG 2.4.1
  
  The first element the tab key reaches is a link that jumps straight to the content, so you don't have to walk the whole menu on every page.

Of these nine points, four are not checked page by page, and that is exactly the point: contrast, the focus ring, the tap area and reduced motion already live inside the button, the link and the form field. A new section is born with them in place and cannot negotiate them. The next section explains how.

2 of 8

[Contents](#indice) · [Next: 03 · Inherited accessibility](#s03)

03 — Inherited accessibility

## 03. Accessibility is inherited, not rewritten

Meeting the bar on one page is easy. The hard part is page number fifteen being born compliant without anyone having to remember. This is what makes that happen, and it's the part you can't see by looking at the site.

The nine checklist points, each assigned to the layer that puts it and to whoever verifies it. Eight are checked by a machine; one, by a person.

### No control is written by hand

Everything you press (buttons, links, chips, tabs, the theme switch) comes from one shared component layer. The focus ring, the 44-pixel tap target and the contrast of every state live inside it: changing them changes them everywhere at once.

### The background picks the grey, not the author

Dimmed text on the page background and that same text inside a card cannot be the same grey: the second one would read worse. It isn't a choice here. Each surface recomputes its own dimmed tone from the background beneath it, hover included.

### The frame comes from the shell, not the author

The skip link, the document language and the two navigation landmarks come from the shell the fourteen pages share: a new page is born with them. The breadcrumb and the heading hierarchy depend on what each page says, so they are checked against the generated HTML.

### A machine decides when to measure again

Measuring colour in full is expensive: the site has to be served and walked with a real browser, so it isn't repeated on every change, only when something new shows up. A check keeps a fingerprint of what was measured and turns red naming what wasn't.

This is what holds up the figure at the top. The colour system sits at AAA, the strictest level WCAG defines, across the fourteen pages and both themes, at rest and under the cursor. It isn't kept there by review passes: it's kept there because the components pick the colours, and because measuring again is mandatory the moment one appears that nobody has measured.

System pieces · live figure · `components/ui/`

Eight pieces in the core, and none is written by hand

[See the catalogue](https://franciscolopez.es/en/design-system)

13.79:1 · AAA

3 of 8

[Contents](#indice) · [Next: 04 · Verification](#s04)

04 — Verification

## 04. Not a self-assessment on my word

Every page is checked in light mode and in dark mode, with real tools ([axe-core](https://github.com/dequelabs/axe-core), [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)) and by hand as well. The automated ones do their job well, but they can only look at what somebody has turned into a rule.

### axe-core

The most widely used WCAG rules engine, run over the already generated HTML of the fourteen pages in both languages. Zero violations.

### Lighthouse

Chrome's accessibility audit. Score of 100 in production.

### getWCAG

A third-party commercial scanner that knows nothing about this repository: its own rules, its own configuration. Zero violations, the same zero ours reports. It looks at a single page and runs separately, not with every change, so it replaces none of the others: what it adds is that the zero doesn't depend on our own harness.

### Contrast census

Colour by colour and with a number, walking the served site and reading the colour the browser actually paints. States included: the grey of a card under the cursor is another pair to measure.

### Outline census

A second pass that measures the edge of every control rather than its text. It's WCAG criterion 1.4.11, and no automated tool on the market implements it: if a form field doesn't stand out from the background, nothing tells you that's where you type.

### Page frame

Checks what axe waves through: that the skip link exists, that there is a single main heading, that the hierarchy skips no levels, that the breadcrumb is in place and that the structured data points at something real.

### Figure labels

Diagrams are drawn on a canvas that scales, so a label declared at 11 pixels can end up painted at 5. The real size of every label is measured at 360 pixels wide, which is an ordinary phone.

### Keyboard and focus

Manual review of keyboard navigation and of the order in which focus walks the page.

### Screen reader

NVDA on Chrome, walking the whole site rather than page by page, which is how it actually gets used.

They don't all fit in the same place, and saying so matters. The ones that only need to read the code run on their own with every change, before anything ships. The two colour measurements need a browser actually painting the page, so they're launched by hand. And the last two need a person in front of the screen. There's also a check that watches the others: it takes each one, plants the exact fault it should catch, and confirms it fires. There are 22 checks and 52 planted faults, because a review that comes back with an empty list looks far too much like a pass.

4 of 8

[Contents](#indice) · [Next: 05 · The blind spot](#s05)

## Where it falls short, and how that is said

What no automated tool finds, the limits that remain, the term used here, and the way to report a barrier.

- 05 · The blind spot
- 06 · Limits
- 07 · The word
- 08 · Contact

05 — The blind spot

## 05. What no automated tool finds

A site can satisfy every rule and still be awkward to use. Tools check rules; the rest only shows up when you actually use it.

The five layers this site is checked with, each covering what the one before it cannot see. The zone on the right, what breaks no rule, is reached only by the last of them: a person.

### The case that proves it

None of the tools spotted that the link that jumps to the content was missing, and that was a level A failure, the most basic WCAG defines. It isn't their fault either: their rule is satisfied if the page has its regions and headings properly in place, and it did. What was missing was the link.

### A full pass with a screen reader

NVDA on Chrome, walking six complete journeys: the skip link, navigation, the cookie dialog, data tables, the theme switch and reading order. The whole site in one go, not page by page.

### Five things that broke no rule

Which is why no tool had anything to say. The mobile menu didn't close with the Escape key. The theme button didn't say which theme you were in, nor that it had changed. The cookie notice was read last, even though on screen it's the first thing you see. The navigation bar wasn't announced as navigation. And the number of each section wasn't spoken when jumping from heading to heading.

### All five are fixed

And three of them weren't one page's fix: they changed the shell all fourteen share. The cookie notice now announces itself as it appears and sits at the start of the document, the navigation bar is a region with a name of its own, and the section number is spoken when walking the headings. That is the difference between a manual pass and a report: the report would have come back green both times.

What this pass doesn't cover is right below, in the limits: one screen reader ([NVDA](https://www.nvaccess.org/)), one browser, and nobody who uses assistive technology every day.

5 of 8

[Contents](#indice) · [Next: 06 · Limits](#s06)

06 — Limits

## 06. Being honest is accessibility too

What doesn't meet the bar yet, and what it would take.

### User testing

Everything on this page was measured by me. Nobody (that I know of) who uses assistive technology every day has tried this site so far, and that is the check no number replaces. If you'd like to be the first, the section below is exactly for that.

### One reader, one browser

The manual pass was done with NVDA on Chrome. Not VoiceOver, not JAWS, not TalkBack on mobile. Each combination behaves differently, so what works here isn't proven on the others. Widening it is on the roadmap.

### Text over photography

The contrast census deliberately abstains on sixteen pairs: the eight pieces of text that sit over a photograph, measured in both themes. There the background is decided by the image and not by the colour system, so measuring them means reading the painted pixel one by one. They're identified and pending.

### Very narrow screens

Below 320 pixels wide, three pages overflow horizontally. It isn't the layout scaffolding: they're long words that don't fit in a 240 pixel column. Measured at 280 and pending.

### Two diagrams measured but not judged

The check that measures figure labels abstains on two of them: they're wide diagrams that scroll horizontally instead of shrinking, so their size isn't decided by the width of the screen. Their labels end up painted at 5 pixels, and that is too small. The fix isn't to narrow them but to redraw them, and it's pending.

### CV as a PDF

It's selectable, tagged text, but a PDF never matches a web page for accessibility. If you need it in another format, write to me.

None of this is here for completeness. A limits section that only says «continuous improvement» tells you nothing. If anything on this list affects you, write to me: it moves up the list.

6 of 8

[Contents](#indice) · [Next: 07 · The word](#s07)

07 — The word

## 07. What A11y is, and why we use it

It's the word the trade uses daily and almost never explains. This page was using it the same way: once, on the first screen, without saying what it meant.

A11y is the shorthand web development uses for the word accessibility. It's built from its first letter, its last letter, and the number of letters in between: eleven. What it names is designing sites and apps so that anyone can use them, whether or not they have physical, visual, hearing or cognitive limitations.

[The A11Y Project](https://www.a11yproject.com/) is the open space where the trade gathers the accessibility principles and patterns that work, from design through to deployment. Its underlying idea is the one this site follows: accessibility isn't a layer added at the end, it's a closing criterion. Here that turns into three concrete things. The checklist goes into the task before the work starts, not when it gets reviewed. Four of its nine points are no longer checked page by page, because the component layer supplies them. And everything that could become an automated check became one.

7 of 8

[Contents](#indice) · [Next: 08 · Contact](#s08)

08 — Contact

## 08. If something blocks you, I want to know

If anything on this site is hard to use with your assistive technology, telling me is the best way to get it fixed. Tell me which page you were on, what happened and which assistive tech you use, and I'll reply.

[franciscojavier.lopezmartinez@gmail.com](mailto:franciscojavier.lopezmartinez@gmail.com?subject=Accessibility%20barrier%20on%20franciscolopez.es)

8 of 8

[Contents](#indice)

From the same system

[Brand Kit · The identity: the logo and its geometry, the two-layer palette, the typography and the rules that govern its use.](https://franciscolopez.es/en/brand-kit) · [Design System · The skeleton: grid, layout tokens, vertical rhythm, typography, motion and measured accessibility.](https://franciscolopez.es/en/design-system)
