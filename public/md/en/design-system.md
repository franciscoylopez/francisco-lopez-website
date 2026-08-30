---
url: https://franciscolopez.es/en/design-system
lang: en
title: Design System
---

1. [Home](https://franciscolopez.es/en)
2. Design System

Design foundations

# Design System

A design system isn't there to make everything look alike: it's there so a decision gets made once. Change a button's hover or its touch target here and it reaches every page at the same time.

1360px

Max container width

4 Breakpoints

640 · 768 · 1024 · 1280

42rem

Reading measure (~91 char.)

AA→AAA

Accessibility target

Contents

Every section closes on its own: you can read it in chunks, in any order. **12** sections

1. [01 · Grid and measures](#s01)
2. [02 · Rhythm and spacing](#s02)
3. [03 · Type and headers](#s03)
4. [04 · Light and dark](#s04)
5. [05 · Motion](#s05)
6. [06 · Links](#s06)
7. [07 · Buttons and actions](#s07)
8. [08 · Labels](#s08)
9. [09 · Form](#s09)
10. [10 · Page composition](#s10)
11. [11 · Closing checklist](#s11)
12. [12 · Long article](#s12)

## Fundamentals

The five decisions everything else hangs from. They are made once and reach every page at the same time.

- 01 · Grid and measures
- 02 · Rhythm and spacing
- 03 · Type and headers
- 04 · Light and dark
- 05 · Motion

01 — Grid and measures

## 01. Wide to lay out, narrow to read

Hide grid

Twelve columns, a container that caps at 1360 and a reading measure that never uses all of it. Everything laid out on this site rests on those three numbers.

Base grid: **12 columns** · Gutter: **var(--gutter) · 16–24px** · The band marks the 12 columns; the button above toggles it.

### Reading measure

Running text never exceeds 42rem (~91 characters) however wide the container gets. It sits above the classic measure on purpose.

### Margins

clamp(1.25rem, 5vw, 2.5rem): 20px on mobile, 40px on desktop. Past xl they grow, never the content.

### What this system adds to Tailwind

The tokens Tailwind's scale doesn't ship. They live in the site's :root, so changing one changes it across every page at the same time.

:root { } · Copy at a glance

--container: · 1360px;

--page-x: · clamp(1.25rem, 5vw, 2.5rem);

--gutter: · clamp(1rem, 2.2vw, 1.5rem);

--measure: · 42rem;

--section-y: · clamp(4.5rem, 9vw, 9rem);

### The cuts

They match Tailwind's scale. Nothing jumps between one and the next: type and spacing interpolate with clamp().

**The cuts**

| Token / min-width | Context | What changes |
| --- | --- | --- |
| `base` · 0 – 639px | Mobile | One column, everything stacked. Type at the clamp minimum. |
| `sm` · ≥ 640px | Large mobile | Buttons and metadata in a row; still one column. |
| `md` · ≥ 768px | Tablet | The two-column grid appears and margins grow. |
| `lg` · ≥ 1024px | Desktop | Full 12-column grid and groups of three cards. |
| `xl` · ≥ 1280px | Wide desktop | Container at its cap; margins absorb the extra width. |

`base` · 0 – 639px

Mobile

One column, everything stacked. Type at the clamp minimum.

`sm` · ≥ 640px

Large mobile

Buttons and metadata in a row; still one column.

`md` · ≥ 768px

Tablet

The two-column grid appears and margins grow.

`lg` · ≥ 1024px

Desktop

Full 12-column grid and groups of three cards.

`xl` · ≥ 1280px

Wide desktop

Container at its cap; margins absorb the extra width.

### The skeleton of the home page

The same page without content: only the vertical rhythm and the grid its sections share.

Showing the mobile version; comparing devices needs a wide screen.

Desktop

Tablet

Mobile

(01) · Hero

(02) · Milestones

(03) · How I work

(04) · Beyond the PM

(05) · Career

(06) · Education

(07) · Toolkit

(08) · Contact

1 of 12

[Contents](#indice) · [Next: 02 · Rhythm and spacing](#s02)

02 — Rhythm and spacing

## 02. Whitespace is the hierarchy tool

A 4px base scale (Tailwind).

### Spacing scale

2xs · 8px

xs · 12px

sm · 16px

md · 24px

lg · 32px

xl · 48px

2xl · 64px

3xl · 96px

4xl · 128px

### Rhythm between sections

--section-y · clamp(72 → 144px)

- Between major sections: --section-y, from 72px on mobile to 144px on desktop.
- Section title → content: 40px (2.5rem).
- Between blocks within a section: 24–32px. Optional hairline divider.
- Every section opens with a 1px var(--border) divider full width.

2 of 12

[Contents](#indice) · [Next: 03 · Type and headers](#s03)

03 — Type and headers

## 03. Width decides the size, not the device

Bricolage Grotesque for headlines, Inter for text and UI. Mobile is the clamp minimum; desktop, the maximum.

Discovery

Level · Display

Font · Bricolage 600

Desktop · 80px / 5rem

Mobile · 44px

Line height · 1.0

Use · Hero only

Milestones

Level · H1

Font · Bricolage 600

Desktop · 52px / 3.25rem

Mobile · 32px

Line height · 1.05

Use · Section title

How I work

Level · H2

Font · Bricolage 600

Desktop · 32px / 2rem

Mobile · 24px

Line height · 1.15

Use · Subsection

TheTool · SaaS B2B

Level · H3

Font · Bricolage 600

Desktop · 20px / 1.25rem

Mobile · 18px

Line height · 1.3

Use · Card / case title

Results

Level · H4

Font · Bricolage 600

Desktop · 16px / 1rem

Mobile · 16px

Line height · 1.4

Use · Minor heading

I research, prototype, build and measure.

Level · Body L

Font · Inter 400

Desktop · 18px / 1.125rem

Mobile · 17px

Line height · 1.6

Use · Subheadline, intro

Senior Product Manager with 10+ years in B2B and B2C SaaS.

Level · Body

Font · Inter 400

Desktop · 16px / 1rem

Mobile · 16px

Line height · 1.65

Use · Running text (max 42rem)

Cofounder & PM · May 2016 – Oct 2021

Level · Small / meta

Font · Inter 400–500

Desktop · 14px

Mobile · 14px

Line height · 1.5

Use · Dates, captions, labels

SENIOR PRODUCT MANAGER · UX · SAAS

Level · Eyebrow

Font · Inter 600 · UPPER

Desktop · 13px

Mobile · 13px

Line height · 1.4

Use · Kicker above title

### The header that applies it

A short label above, a headline below. They come from a single piece, so the headline's size also decides the gap between them.

Design fundamentals

Design System

gap · mb-5

lead · mb-6

Where it's used · The h1 that opens a page.

Who's behind this

About me

gap · mb-5

lead · mb-4

Where it's used · The h1 of long-read pages.

Journey

Career

gap · mb-3

lead · mb-[1.4rem]

Where it's used · The h2 that opens a section.

Header layer

Headers

gap · mb-3

lead · mb-4

Where it's used · A section of a long index, like the ones on this page.

Discovery

gap · mb-2

lead · mb-3

Where it's used · The headline of a piece inside a grid.

The product that already existed

gap · mb-2

lead · mb-3

Where it's used · The h3 of a subsection, with no label above.

Before and after

gap · mb-2

lead · mb-3

Where it's used · One step below: a supporting block inside a section.

### The other small-caps label, which is not this one

They look alike and do different jobs, so they are two pieces: one opens a section paired with a headline, the other labels a value inside the content.

Career

Ten years of product

Opens a section · `eyebrowVariants`

It always sits above a headline, and the gap between them comes from the size of the headline below it.

Length

5 years and 6 months

Labels a value · `dataLabelVariants`

With no headline beside it there is no gap to derive: the margin is set by whoever uses it. It runs a point smaller and less open.

### Below the headline, the row of figures

When an opening sums something up in numbers, the page doesn't assemble the row: a piece brings it with its hairline, its gap and its grid.

1360px

Maximum container width

4 breakpoints

640 · 768 · 1024 · 1280

AA→AAA

Contrast floor and target

Row of figures · `StatRow · Stat`

StatRow sets the hairline, the gap and the grid that splits the columns. Stat sets the figure, its unit and the label below.

### What the variant decides and what the call site does

- The size picks the gap between label and headline, and the line height too.
- The call site only sets what depends on the content: the maximum width, or the balance of a headline that breaks badly.
- The seven sizes aren't drift, they're hierarchy: the h1 that opens a page is not the h2 that opens a section.

3 of 12

[Contents](#indice) · [Next: 04 · Light and dark](#s04)

04 — Light and dark

## 04. Depth comes from hairlines, not shadows

Same skeleton and same surface hierarchy: background → card → border. Light is warm paper; dark is deep blue.

Light mode · From discovery to data.

Download CV

bg #F7F3EC · card #FCFAF6 · border #E2DED4

Dark mode · From discovery to data.

Download CV

bg #191D21 · card #21262B · border #2E353C

### Colour rule

- primary is the only action colour. secondary, muted and accent stay neutral.
- Links follow two rules: primary inside content; foreground or muted-foreground in navigation chrome.
- Brand tones decorate or sign the logo. Splits and pastels, never as text.

Use the header toggle to see this same page in both modes.

### The dimmed grey is set by the surface

The two labels below come from the same class, with nothing to tell them apart where they are used. They paint differently because the background underneath them is not the same.

Design fundamentals

On the page background

`--background`

The system grey, tuned against this background and only against it.

The next step

On the contact band

`--muted`

Over any other surface it is recomputed: it blends 85% into the background underneath. Nobody has to ask for it.

4 of 12

[Contents](#indice) · [Next: 05 · Motion](#s05)

05 — Motion

## 05. Restrained: it never competes with the content

Durations aren't picked by taste: each one matches a kind of change on screen.

150ms · Micro-interactions: hover, focus, buttons.

250ms · State changes: accordions, tabs.

280ms · Section scroll-reveal on entry.

easing · cubic-bezier(0, 0, .2, 1): ease-out on entry.

- Reveal = fade + 14px rise, once on entering the viewport and never on a loop. A group entering together staggers its pieces (80ms in this demo).
- prefers-reduced-motion: transforms and auto-scroll are disabled. Content always appears, even if the JS fails.

Scroll-reveal demo

Replay ▸

### Nav transition · shared across the whole site

- Symbol 48 → 28px and bar 80 → 64px, continuously with the scroll.
- The split's colour layers fade out before the symbol drops below 48px: it never passes through a badly registered state.
- The wordmark fades in opacity without clipping glyphs: the gap only collapses once it is already invisible.
- Under reduced motion, it jumps between states instead of interpolating.

Francisco López · on load · 80px

on scroll · 64px · flat

It's the transition you're seeing right now in this page's header.

5 of 12

[Contents](#indice) · [Next: 06 · Links](#s06)

## Pieces

The catalogue of what you press and what labels. None of them is written with loose classes: if a case does not fit a variant, the variant gets created.

- 06 · Links
- 07 · Buttons and actions
- 08 · Labels
- 09 · Form

06 — Links

## 06. Its function decides, not where it sits

Inside content, cyan is the reward for interacting. Inside a block that is already navigation, cyan tells you nothing and only adds noise.

Every decision on this page is [documented and measured](#top) before it reaches the code.

Content · `.link-content`

At rest, foreground text with a thin primary underline. On hover or focus, a solid fill grows from the bottom up and the text flips.

It reuses the already verified «text on button» contrast pair instead of inventing a new one.

[Home](#top) · [About](#top) · [Brand Kit](#top)

Navigation chrome · `.link-chrome`

Nav, breadcrumb, footer and menus: foreground or muted-foreground, never primary. On hover and focus, a muted background pill.

They read as links by their position, and the pill works without telling hues apart.

Icon-only chrome · `.icon-chrome`

Theme toggle, menu and social icons: the same pill as the rest of the chrome, filling the full 44px touch target.

A control with no label needs the same affordance as one with text.

Hover over them ▸

An inverted band is one painted in the text colour that then writes on top in the background colour. Inside it, [a content link](#top) still behaves the same way: a thin underline at rest and a solid fill on hover.

Content, on an inverted band · `.link-content · data-surface`

There the page's text colour IS the background, so the link doesn't pick its own: the band resolves it by declaring which surface it is.

The three colours are the other theme's, not new values. The surface overrules the variant.

### Why cyan does not live in the text

- Cyan is the system's only action colour: if it also tints every link at rest, it stops signalling anything.
- Holding it back for the moment of interaction turns it back into a signal instead of a paragraph colour.
- No state is encoded by colour alone: underline, fill and pill are changes of shape, not of hue.

The chrome's tone isn't decoration either: the secondary one lifts to foreground in the same gesture that brings the pill, because without that jump the pair drops to AA right on hover.

6 of 12

[Contents](#indice) · [Next: 07 · Buttons and actions](#s07)

07 — Buttons and actions

## 07. A button doesn't pick its look: its role does

How many actions compete beside it, and whether it carries state, decide the variant. The variant already resolves hover, focus and touch target.

Hover to see it ▸

Show the focus ring

[Get in touch](#top)

Primary action · `solid`

The only cyan fill on screen. On hover the fill blends toward the text colour instead of lightening, which raises the contrast rather than lowering it.

[Download CV](#top)

Content action · `outline-primary`

Cyan on the border and the text, turning into a full fill on hover. For actions that stand alone, with no other button beside them to compete with.

[Cancel](#top) · [Preferences](#top)

Utility · `outline-neutral · ghost`

No cyan: neutral border or no box, and a grey pill on hover. It's what a button wears when it sits next to a solid one in the same group.

With cyan, two buttons in the same group would both claim to be the main action.

Active · Inactive

Switch · `toggle-primary`

A lone control that turns on something that wasn't there. On, full fill; off, cyan border with a tint on hover, never the fill.

With a fill, the off state on hover would look like the on state and the control would stop saying which one it's in.

Desktop · Tablet · Mobile

Group of alternatives · `toggle-neutral`

Several segments of which exactly one is active. The active one goes solid cyan; the rest, neutral.

Painting them all cyan distinguishes nothing and swallows the section.

Icon only · `icon`

Controls with no label: the same pill as the rest of the chrome, filling the whole 44px touch target.

[Email · hello@example.com](#top)

Pressable card · `card`

When the click target is the whole box and not a line of text: card background, grey pill on hover, and box padding instead of button padding.

Over an image · `.video-facade`

The photo decides the background, so the control can't fix its own colour. A veil separates it from the image and the disc runs in two tones, so its inner edge doesn't depend on what's underneath.

The veil takes the page background colour, never black: black fixes one theme and ruins the other.

### When an action carries an icon

- One question: does this action take you out of the page? Downloading a file, opening mail or the phone, or going to another site all carry one.
- Anything that happens inside the page goes without: accept, save, close, pick a tab or navigate the site.
- It goes before the label, because it classifies the action. Only on the solid one does it go after and advance two pixels on hover: there it marks the direction of travel.

Size, gap and side are set by the variant, not by each use. At the call site you write the icon and nothing else.

### Why this is a component and not a convention

- No control is written with loose classes. If a case fits no variant, the variant gets created; if it's an exception, it's documented with a date.
- Changing a hover is changing one line, and it reaches every button on the site at once.
- Focus isn't declared by any variant: one global rule sets it, the same one for the whole site.

7 of 12

[Contents](#indice) · [Next: 08 · Labels](#s08)

08 — Labels

## 08. It tags, it isn't pressed

It sits outside the action layer: no state, no hover, no touch target. Its only job is to be read.

Fixed · Coming soon

No weight · `neutral`

What tags along without standing out: a status, a note in the margin, the off half of a pair.

Its text can't be the system grey, tuned against the page background: on top of the pill it drops to 6.44:1.

AAA · Switches

Verified figure · `cyan`

A cyan wash for what has been measured, or what passes. The cyan lives in the fill; never in the text.

Exit · Split

Brand mark · `purple`

A purple wash for what flags something singular: a career milestone, a variant of the logo.

Purple is decorative and never an action colour, so here it can only show up as fill.

Exit · Split · 13.79:1

Three registers · `label · value · code`

Small caps for a status tag, ordinary case for a figure in prose, monospace for a technical value.

It's the only thing that changes from one label to another: height, size, radius and padding are shared.

These are the same labels the site uses: if one changes, this section changes with it.

### Why this is its own layer

- A label isn't an action: it isn't pressed. Half a button's base (touch target, focus ring, states) would mean nothing here.
- A difference that means something is a variant; one that means nothing is a value to unify.

The text of both tinted ones is the ordinary text colour, not the wash's. That's what takes them to 10.63:1 in light and 10.02:1 in dark; tinted they sat at 6.07 and 5.46.

8 of 12

[Contents](#indice) · [Next: 09 · Form](#s09)

09 — Form

## 09. The first surface that receives, not the one that shows

A field isn't a small button: it has a label, it has an error state, and it has to say so out loud.

### The field

Label and control are one piece, and the touch target floor lives on the control, which is where you press.

Email

At rest · `Field`

The label is always visible and tied to the field, never tucked inside as helper text: a placeholder vanishes as you type and leaves the field with no name.

Minimum height of 44px, the same touch target floor as the buttons. The focus ring comes from the global rule.

Email

That address doesn't look complete. Check the part after the at sign.

With an error · `Field · error`

The message is tied to the field, so a screen reader hears it on arrival and not only when you try to send.

The red border and the icon carry the shape; the text stays in the normal colour.

### When sending fails

A notice that announces itself without stealing focus, listing which fields need another look.

Check these fields before sending:

- Name
- Email

Error summary · `FieldErrorSummary`

It appears when you try to send and is announced as an alert. Focus is moved by the form to the first failing field: two jumps at once would leave a screen reader with no idea where it is.

### Red isn't a text colour

- The system red measures 4.31:1 on the light background: it doesn't even reach the minimum a text needs.
- So the message is written in the normal text colour, and red stays on the border and the icon, where the threshold is lower and it does pass.
- As a bonus, the error stops being encoded by colour alone.

### What really validates is the server

- Browser validation exists so a blank field doesn't cost a round trip, not to decide.
- The same rule runs on the server, because whoever posts by hand never ran the browser's.
- And it returns codes, not sentences: the words come from the dictionary, in both languages.

9 of 12

[Contents](#indice) · [Next: 10 · Page composition](#s10)

## Composition

How a page is assembled from all of the above, and the accessibility criteria each one is closed with.

- 10 · Page composition
- 11 · Closing checklist

10 — Page composition

## 10. Neither controls nor text: the boxes a page is built from

A table, a side note and the closing block. All three moved up to the layer because their format is what cannot diverge from one page to the next.

### The contents of a page with stops

The grid that opens the route, right below the hero, and this page carries it. The family has three pieces: this one, the section closer further down, and the fixed rail, which does not live here because it is published in the long-article section, the only page that uses it.

Contents

Every section closes on its own: you can read it in chunks, in any order. **3** sections

1. [01 · Grid and measures](#s01)
2. [02 · Rhythm and spacing](#s02)
3. [03 · Type and headers](#s03)

The map · `SectionIndex`

A grid of stops rendered on the server: it navigates without JavaScript.

The third line of each cell is a free, optional slot. The article puts its per-section reading time there; a page of specimens has no prose to time, so it stays empty.

### The opening of a block

Twelve sections in a row do not say where one family ends and the next begins. The band says it, and shows what it contains.

## Pieces

The catalogue of what you press and what labels. None of them is written with loose classes: if a case does not fit a variant, the variant gets created.

- 06 · Links
- 07 · Buttons and actions
- 08 · Labels
- 09 · Form

Block opener · `BlockOpener`

Inverted background and type alone. An existing section is never tinted: the ones here are galleries and assume the page background.

The band below is not a recreation: it is the one that opens the «Pieces» block of this very page.

### The table

Real table markup, and that isn't cosmetic: without cells tied to their column, the census's thirteen rows of figures read as a string of numbers with no way to tell which theme is which.

**The table**

| Piece | Markup | What it solves |
| --- | --- | --- |
| Table name | `caption` | Tells whoever can't see it what the table is. Not painted: the headline above already says it. |
| Column header | `th scope=col` | One single definition for the system's five tables. |
| Row name | `th scope=row` | Ties each figure to its row: «Dimmed on card, light, 9.14:1» instead of three loose numbers. |
| Column width | `colgroup` | Declared once, not in two places that have to be kept in sync. |

### The side note

A measurement, a tool's output, a rule worth stating apart: what a page says outside the body of the text.

### A value is not copy

If a section publishes a figure from the system, it comes from the values file and never from the dictionary. The test is literal: if the Spanish entry and the English one are identical character for character, it's a value with two copies.

With a paragraph · `InfoCard`

A title and its explanation on the card surface. The grey of the body isn't picked by this piece: the background it lands on resolves it.

It takes three bodies and they combine: paragraph, list and a smaller footer.

### --measure

- The width of the reading column, measured in characters rather than pixels.
- Section standfirsts and article bodies both use it.
- Changing it moves the rhythm of every page at once, which is exactly what it exists for.

It's published in full in the layout tokens section, with its value and its reason.

Monospaced title · `InfoCard · mono`

When the title is the name of a token, a file or a tool, it goes monospaced: that way it reads as what it is, an identifier and not a sentence.

### The tile: one box for a logo or an ordinal

It is the smallest piece in this family and the one that behaved worst: the same box was painted at two sizes and with two fills depending on who wrote it. Size and fill now live in the piece, so there is nowhere left to disagree.

With a logo inside · `BrandLogoBox`

Company, tool and institution logos, monochrome and swapping light/dark in pure CSS. They are announced as decorative: the name is already written next to them.

The wrapper knows where this site keeps its assets; the box knows nothing, which is why the box is the part that moved up into the layer.

01 · 02 · 03

With an ordinal inside · `Tile`

The number of a stage in «How I work». Same box, same fill and same size as the logo one: the only difference is what it holds.

This one is announced, unlike the logo: the order of the stages is information, not decoration.

### The closing of a section

The foot of every stop, which is why it sits here and not above: it says which one the reader is in, how to get back to the contents, and what comes next. It is the step-sibling of the page closer, published right below.

2 of 3

[Contents](#indice) · [Next stop](#s01)

The foot of every stop · `SectionCloser`

Where you are, the way back to the contents, and the next stop.

The dots are decorative: the position is spelled out in text too, which is what satisfies point 6 of the checklist. The label carries that position so twelve footers never share a name.

### The page closer

The end of the content before the footer: where you go from here, with the same format across every page.

Keep reading

[Previous role · KUOTIP · A real link: the arrow goes first and points left, which reads as going back without reading the label.](https://franciscolopez.es/en/trayectoria/kuotip)

Next role

A destination that doesn't exist yetComing soon

With no link, the card is drawn dotted and dimmed. It's what happens to the most recent experience, which never has a next one.

Two destinations · `PageCloser`

The whole thing moves up to the layer, not just the card: the vertical rhythm, the hairline above and the gap for the label are what must not diverge.

The arrow nudges toward where it points, and the nudge is off under reduced motion. A destination that doesn't exist yet is drawn dotted and dimmed.

### The whole format moves up, not just the box

- What must not diverge is the complete closing block, not the look of a card.
- The block knows nothing about this site: it receives a label and a list of destinations.
- Which page is sibling to which is decided by its callers, who do know.

It's the boundary that decides where a piece lives: if it knows something about this site, it isn't part of the system.

10 of 12

[Contents](#indice) · [Next: 11 · Closing checklist](#s11)

11 — Closing checklist

## 11. AA is the floor, not the goal

The list each page closes with. It's the internal build criterion; the public conformance statement lives on the Accessibility page.

### Measured contrast

**Measured contrast**

| Measurement | Light | Dark |
| --- | --- | --- |
| Body text · foreground over background | 13.79:1AAA | 15.32:1AAA |
| primary as text · links and accent | 7.47:1AAA | 8.36:1AAA |
| Text on button · primary-foreground over primary | 7.93:1AAA | 8.36:1AAA |
| Solid button hover · the fill mixes toward foreground | 8.64:1AAA | 8.92:1AAA |
| Toggle-off hover · the tightest state in the system | 7.21:1AAA | 7.80:1AAA |
| Secondary chrome hover · the text rises to foreground with the pill | 12.47:1AAA | 12.04:1AAA |
| Dimmed text over background · the token as-is: it is tuned against this surface | 7.10:1AAA | 7.12:1AAA |
| Dimmed text over card · cards and panels: recomputed against their own fill | 9.14:1AAA | 10.32:1AAA |
| Dimmed text over muted · the contact band and the neutral label | 8.17:1AAA | 9.17:1AAA |
| Dimmed text over an inverted surface · built from the other end, like the inverted cyan | 10.32:1AAA | 9.89:1AAA |
| Tinted label · the worse of the two, cyan and purple | 10.63:1AAA | 10.02:1AAA |
| Switch knob, off · foreground over its own track; when on it reuses the button pair | 12.47:1AAA | 12.04:1AAA |
| brand-purple-accent · Over inverted bg; swaps with the theme to reach AAA | 7.04:1AAA | 7.21:1AAA |

Every text pair in the system reaches AAA in light and in dark, and not only at rest: on hover too, which is where it usually slips. No exceptions.

### Closing checklist

1. 01
  
  Measured contrast, with a figure, in both themes. AA is the non-negotiable floor; AAA whenever it's reached without visual cost.
2. 02
  
  Visible focus: a 2px ring with var(--ring) and a 2px offset on every interactive element. Never outline:none without a replacement.
3. 03
  
  Touch targets of 44×44px minimum, including small controls like the breadcrumb or the theme toggle.
4. 04
  
  A single h1 per page and an h2–h4 hierarchy with no skips. Reading order is DOM order.
5. 05
  
  Breadcrumb on every internal page, with <nav aria-label>, an ordered list and aria-current="page" on the current level.
6. 06
  
  Nothing encoded by color alone: any state or category distinguished by color also carries text or shape.
7. 07
  
  prefers-reduced-motion respected in every animation.
8. 08
  
  Text alternatives: alt and labels where they inform, aria-hidden on the decorative.
9. 09
  
  A keyboard escape route: a skip link to the content as the first focusable element on the page, with a real destination (<main> with tabindex="-1"). No automated tool catches it: their bypass rule is satisfied by landmarks or headings.

11 of 12

[Contents](#indice) · [Next: 12 · Long article](#s12)

## The exception

Long-form text has a shape of its own, and it comes last on purpose: it is what the core does not cover, so it closes.

- 12 · Long article

12 — Long article

## 12. The shape for long text with stops

Eleven sections and several thousand words need pieces the rest of the site doesn't use. It's a layer apart, not the core's eighth piece.

### The article's opening

What only shows up once, at the start: who signs it and how it is shared.

Francisco López

Senior Product Manager

Share

Copy link

Opening · `<ByLine> · <ShareActions>`

Byline and sharing, settled in the same opening row.

A signed article says who signs it in the opening, not in the footer. And without `navigator.share` the button copies the link anyway.

### How every stop opens

A single piece, repeated eleven times. It's what makes every section recognisable as the same one.

5 of 11 · 3 min

05 — Specimen

#### 05. The illustrated ordinal opens every section

5 of 11 · 3 min

Section cover · `<SectionCover>`

Label and headline on the left; on the right, the illustrated ordinal with its meta line below.

### What floats alongside the text

Pieces that don't cut the column: they sit to one side and the text runs around them.

> A rule you have to remember is a rule that gets broken.

> The record of why something else was thought at the time is worth more than retroactive consistency.

Quotes · `<Pullquote> · <Pull>`

The featured one stops the reading, with hairlines above and below; the minor one only accompanies, with a lighter rule in the same purple on its edge.

Purple here is ornament, not information. And when both land in the same section, they float to opposite sides.

A real diagram from the page, with its own color tokens.

Diagram · `<DiagramPanel>`

The frame for an own diagram or a real artefact, with its caption. The drawing comes from the page.

Unfloated it takes the full width of the column: a panel isn't prose.

Example · live data · `lib/design-values.ts`

AAA across all fourteen pages

[See the measured census](#ds-articulo-cover)

Live figure · `<LiveStat>`

A figure that isn't typed into the dictionary: it links to the page that actually publishes it.

…and that's why the section ends here, with the evidence and the way out towards the next one.

LINK ·

Decisions D39, D41 and D73, in · [DECISIONS.md](https://github.com/franciscoylopez/francisco-lopez-website/blob/main/DECISIONS.md)

### What doesn't scroll away

The three client islands, pinned to the window. Here they're demonstrated together inside a box.

Just like the real page, but contained to this panel: outside it they're pinned to the window.

The three islands · `<ReadingProgress> · <SectionRail> · <FloatingShare>`

The progress bar at the top edge, the floating index with the active stop highlighted, and the share dock on the right.

They're an enhancement, not a requirement: the server index already covers navigation if the observer never starts.

### What this layer is and what it isn't

- None of these pieces knows anything about this site: they receive text and links, not copy or routes of their own.
- It isn't the core's eighth piece: it's a layer apart, for long text with stops.
- The specimens are the real pieces imported, with sample content: if one changes, this section changes with it.

12 of 12

[Contents](#indice)

From the same system

[Brand Kit · The identity: the logo and its geometry, the two-layer palette, the typography and the rules that govern its use.](https://franciscolopez.es/en/brand-kit) · [Accessibility · The public statement: the conformance level the site meets and how to report a problem.](https://franciscolopez.es/en/accesibilidad)
