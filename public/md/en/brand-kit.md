---
canonical: https://franciscolopez.es/en/brand-kit
lang: en
title: Brand Kit
description: "Francisco López's identity system: logo and geometry, the two-layer palette, typography and the rules that govern its use. Downloadable in light and dark."
last-updated: 2026-08-10
---

1. [Home](https://franciscolopez.es/en)
2. Brand Kit

Brand identity

# Brand Kit

An identity isn't designed because a logo is needed: it's designed to stop deciding the same thing over and over. This is that language, with its rules and its pieces, downloadable in light and dark.

15

Color tokens

2

Type families

48px

Split threshold

AA→AAA

Accessibility target

Contents

Every section closes on its own: you can read it in chunks, in any order. **6** sections

1. [01 · Concept](#s01)
2. [02 · Logotype](#s02)
3. [03 · Color](#s03)
4. [04 · Typography](#s04)
5. [05 · Applications](#s05)
6. [06 · Correct and incorrect use](#s06)

## What it is made of

The idea behind it and the three signs that carry it: the monogram, the two-layer palette and the type pairing.

- 01 · Concept
- 02 · Logotype
- 03 · Color
- 04 · Typography

01 — Concept

## 01. A two-layer brand

The symbol is a ring, the focus resting on a solid base: product judgment built on a stable foundation. It's not decoration: it's the signature of the method. From discovery to data, two planes that separate and realign into a single clean shape.

Flat

A single ink layer. For small UI, favicon and monochrome.

Split

Three stacked strokes, no blend. Only at ≥48px, where color reads as a layer.

1 of 6

[Contents](#indice) · [Next: 02 · Logotype](#s02)

02 — Logotype

## 02. The logo and its rules

Two compositions (symbol alone and lockup with wordmark), each in flat and split. Cropped exactly to the ink: the height you give it is the real height of the symbol.

The whole brand, packed

Everything you need to put this brand anywhere: the 1024, 512 and 256 px PNGs, both inks and the favicon. In a single file.

[Download the kit](https://franciscolopez.es/api/kit)

Symbol · Split

Inline in markup · 382 B · sized by height.

[Download SVG](https://franciscolopez.es/logo-kit/svg/simbolo-split-tintaOscura.svg)

The standalone SVG uses the dark ink. In the kit: 1024, 512 and 256 px PNGs and both inks.

Symbol · Flat

Inline in markup · 220 B · sized by height.

[Download SVG](https://franciscolopez.es/logo-kit/svg/simbolo-plano-tintaOscura.svg)

The standalone SVG uses the dark ink. In the kit: 1024, 512 and 256 px PNGs and both inks.

Symbol · Mono black

One pure ink · 220 B · for light backgrounds.

[Download SVG](https://franciscolopez.es/logo-kit/svg/simbolo-mono-negro.svg)

In the kit: 1024, 512 and 256 px PNGs.

Symbol · Mono white

One pure ink · 220 B · for dark backgrounds.

[Download SVG](https://franciscolopez.es/logo-kit/svg/simbolo-mono-blanco.svg)

In the kit: 1024, 512 and 256 px PNGs.

Francisco López

Lockup · Split

Never inline · 23 KB outlined · sized by width.

[Download SVG](https://franciscolopez.es/logo-kit/svg/lockup-split-tintaOscura.svg)

The standalone SVG uses the dark ink. In the kit: 1024, 512 and 256 px PNGs and both inks.

Francisco López

Lockup · Flat

Never inline · 23 KB outlined · sized by width.

[Download SVG](https://franciscolopez.es/logo-kit/svg/lockup-plano-tintaOscura.svg)

The standalone SVG uses the dark ink. In the kit: 1024, 512 and 256 px PNGs and both inks.

### Usage table

All sizes are the visible height of the symbol.

**Usage table**

| Context | Variant | Symbol | Wordmark | Bar |
| --- | --- | --- | --- | --- |
| Nav · on load | Split | 48px | Yes · ~22px | 80px |
| Nav · on scroll | Flat | 28px | No | 64px |
| Footer | Flat | 32px | No | — |
| Brand Kit (hero) | Split | ≥120px | Optional | — |
| OG image / social | Split | ≥200px | Yes | — |
| Favicon | Flat | 32 / 16px | No | — |

Nav · on load · Split

Symbol · 48px

Wordmark · Yes · ~22px

Bar · 80px

Nav · on scroll · Flat

Symbol · 28px

Wordmark · No

Bar · 64px

Footer · Flat

Symbol · 32px

Wordmark · No

Bar · —

Brand Kit (hero) · Split

Symbol · ≥120px

Wordmark · Optional

Bar · —

OG image / social · Split

Symbol · ≥200px

Wordmark · Yes

Bar · —

Favicon · Flat

Symbol · 32 / 16px

Wordmark · No

Bar · —

### The seven rules

1

#### Split → flat threshold: 48px

The color offset is 5.1% of the symbol height, so at 48px the crescent measures 2.5px. Below that it reads as dirty fringing, not as a layer.

2

#### Minimum size: 24px

The stroke is 8.6% of the height: at 24px that's 2.1px and holds; at 15px it's 1.3px and antialiasing washes it to gray.

3

#### No circular container

The symbol is already a circle. Putting it inside another shrinks it and turns it into a target.

4

#### Never smaller than adjacent UI

It's the brand, not just another icon. It must weigh at least as much as the LinkedIn or © next to it.

5

#### Symbol/wordmark proportion

40–45% composed in UI, ~60% in a closed lockup. Outside that range the symbol floats alone or the wordmark dominates.

6

#### Nav transition: continuous

Color extinguishes before dropping below 48px and the wordmark fades in opacity without clipping glyphs. It never passes through a mis-registration state.

7

#### prefers-reduced-motion: jump

No interpolation: it jumps between states at once, with no intermediate transition. The symbol goes from 48px to 28px and the bar from 80px to 64px: two distinct measures.

Rule 1 · the threshold, seen

### Where the split stops working

The color crescent is 5.1% of the height. Below 48px it reads as dirty registration, not as a layer. The ladder shows it on its own.

24px

crescent 1,2px

Dirty fringe

32px

crescent 1,6px

Dirty fringe

48px

crescent 2,4px

Works

64px

crescent 3,3px

Works

96px

crescent 4,9px

Works

2 of 6

[Contents](#indice) · [Next: 03 · Color](#s03)

03 — Color

## 03. Palette and two layers

The two-layer rule: an ink layer (background + stroke) that switches with the theme, and a color layer (cyan + purple) that only appears in the split and doesn't change between light and dark. Each swatch carries its token, its hex and its measured contrast ratio. Switch the theme with the nav toggle to watch the ink layer flip.

Aa

Background

Switches

`--background`

`#F7F3EC` · `#191D21`

light#F7F3EC

dark#191D21

Ink over it · 13.79:1 · AAA

Base surface

Aa

Ink

Switches

`--foreground`

`#21262B` · `#F7F3EC`

light#21262B

dark#F7F3EC

Body text · 13.79:1 · AAA

Text and stroke

Aa

Primary cyan

Switches

`--primary · --brand-cyan`

`#005859` · `#3FC9C4`

light#005859

dark#3FC9C4

7.47:1 text · 7.93:1 button (light) · 8.36:1 dark · AAA

Links and accent

Aa

Purple

Fixed

`--brand-purple`

`#9B87F5`

Decorative · ink over it

Tints and highlights

Aa

Purple accent

Switches

`--brand-purple-accent`

`#B7A3FF` · `#583DA6`

light#B7A3FF

dark#583DA6

On inverted bg · 7.04:1 light · 7.21:1 dark · AAA

Text/accent over ink

Aa

Split cyan

Fixed

`--brand-cyan-split`

`#16BDBD`

Logo layer only

Never as text

Aa

Split purple

Fixed

`--brand-purple-split`

`#9B87F5`

Logo layer only

Never as text

Aa

Pastel cyan

Fixed

`--brand-cyan-soft`

`#A7E1DE`

Ink over it · 10.5:1 · AAA

Background, never text

Aa

Pastel purple

Fixed

`--brand-purple-soft`

`#C6B9F0`

Ink over it · 8.4:1 · AAA

Background, never text

Pastels never as text color. They're backgrounds. If text goes over a pastel, always in foreground (ink), never the other way around.

3 of 6

[Contents](#indice) · [Next: 04 · Typography](#s04)

04 — Typography

## 04. Two typefaces, two jobs

What the typefaces are and why, as a brand asset. The scale, sizes and line heights live in the Design System.

Aa

Bricolage Grotesque

Display · weights 600 / 700

A grotesque with character: humanist details and slight irregularities that give it personality without losing rigor. It's the voice of headlines and the wordmark: firm, contemporary, recognizable.

ABCDEFGHIJKLM abcdefghijklm 0123456789

Aa

Inter

Text · weights 400 / 500 / 600

Neutral, with very high on-screen legibility at any size. It does the quiet work: body, labels, data and UI. Let Bricolage carry the voice while it sustains the reading.

ABCDEFGHIJKLM abcdefghijklm 0123456789

4 of 6

[Contents](#indice) · [Next: 05 · Applications](#s05)

## How it is used

Where the brand lives outside this site, and the rules that stop every application from interpreting it its own way.

- 05 · Applications
- 06 · Correct and incorrect use

05 — Applications

## 05. The brand in its place

Where the logo lives: inside the site, where every piece can be downloaded, and outside it, where it is only placed. The symbol PNG is sized by height and the lockup PNG by width. It's not obvious, which is why it's stated here.

### On the site

The two surfaces this domain serves itself. Here the piece can be downloaded.

Favicon

A dedicated asset, not a rescale. At 16px the stroke rises to 10 units for optical compensation. Flat, centered.

48

32

16

[Download ICO](https://franciscolopez.es/logo-kit/favicon/favicon.ico)

In the kit: 32 and 16 px PNGs and both inks.

OG image · social

The real card served to social: split logo, wordmark, title and kicker over the brand background. Fixed in light and dark, each page generates its own. The lockup below is the piece that builds it.

![Brand Open Graph image: split logo, wordmark and title over a dark background](https://franciscolopez.es/api/og?card=brand-kit&lang=en)

The PNG suffix names the ink, not the background. tintaOscura (dark ink) goes over light backgrounds; tintaClara (light ink) over dark ones. Available at 256 / 512 / 1024 px.

### Off the site

Three pieces that don't live on this domain and carry the same brand. They are the proof a system can only give away from its own page, and that is why there is nothing to download here: none of them is placed here. All three are versioned with the repository, which is what stops two versions of the truth from existing.

Email signature

The split symbol at 75px, the name in bold and the two channels, split by a vertical rule. It is built as a table with inline styles, the only thing an email client leaves intact, and the images point at absolute URLs on this domain because Gmail strips data URIs.

Where it lives Gmail, pasted into its signature settings

LinkedIn banner

1584 × 396 over the site's dark background, with the Hero headline and the domain. The bottom-left corner is left empty on purpose: that is where LinkedIn lays the profile photo, so the banner doesn't carry one.

Where it lives [LinkedIn, at the top of the profile](https://www.linkedin.com/in/franciscolopez1975)

Repository cover

The card GitHub shows when the repo is shared, with that same headline. It carries no figures at all: GitHub serves it from its settings and won't take a URL, so nothing could keep it current. A figure that can't have a guardian isn't a figure, it's a promise.

Where it lives [GitHub, in the repository settings](https://github.com/franciscoylopez/francisco-lopez-website)

5 of 6

[Contents](#indice) · [Next: 06 · Correct and incorrect use](#s06)

06 — Correct and incorrect use

## 06. The real mistakes of this system

Not a catalog of generic ✓ / ✗: the failures this brand had in the process, the figure that caught them and how they were fixed.

Before · 23px

After · 40px

### The viewBox that lied

height:40px → 23px · −42%

It was "0 0 120 120" but the ink filled only 58% of the height. Everyone who used the component undersized it without knowing.

**Fix:** viewBox cropped to the ink: the height you give IS the symbol's.

Before · split 24px

After · flat <48, split ≥48

### The split used at 24px

color crescent = 1.2px

At that height the offset read as a print registration error, not a signature.

**Fix:** split → flat threshold at 48px (rule 1). Below it, the flat variant.

Before · 32 rescaled to 16

After · dedicated 16px

### The favicon with no optical compensation

8.2% ink at 16px vs 8.1% at 32px

The 16px one was the 32px rescaled; at that size the stroke washed out to gray.

**Fix:** dedicated 16px asset with stroke-width 10 instead of 6.

Before · logo 12×15

After · logo ≥ icon

### The logo weighing less than a foreign icon

12×15px next to LinkedIn 18×18px

In the footer the brand sat below a UI icon and at the same visual weight as the © next to it.

**Fix:** the logo is never smaller than adjacent icons (rule 4).

Francisco López · Before · wordmark at 29%

Francisco López · After · ~60% proportion

### The lockup at 29%

symbol 24→64px, wordmark at 18px

The symbol grew and the wordmark lagged behind. The logo wasn't big: it was alone.

**Fix:** controlled symbol/wordmark proportion (rule 5).

Before · at 35% of its footprint

After · no container

### The circle inside the circle

symbol at 35% of its footprint

The nav put the symbol inside a circular container, turning it into a target.

**Fix:** no circular container: the symbol is already a circle (rule 3).

Before · drifted

After · tokens

### The four colors of this page

4 drifted tokens

The page documenting color was the one that had it wrong: bone, dark and the two pastels.

**Fix:** #F5F3EE→#F7F3EC · #181B1F→#191D21 · pastel cyan #CFEFEE→#A7E1DE · pastel purple #E6E0FB→#C6B9F0.

6 of 6

[Contents](#indice)

From the same system

[Design System · The skeleton: grid, layout tokens, vertical rhythm, typography, motion and measured accessibility.](https://franciscolopez.es/en/design-system) · [Accessibility · The public statement: the conformance level the site meets and how to report a problem.](https://franciscolopez.es/en/accessibility)
