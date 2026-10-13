---
name: Aura Kinetic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#006c4b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00b982'
  on-tertiary-container: '#00422c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies an airy, modern, and restorative visual language tailored for mindful athletic performance and wellness tracking. Built around an aesthetic of luminous minimalism, it departs from the aggressive, high-contrast, dark-mode tropes standard in athletic tracking software. The emotional atmosphere is calm, invigorating, and organized—reducing biometric anxiety through soft, breathable canvas states, delicate cool tones, and clear typographic hierarchy.

Key style tenants:
- **Luminous Whites & Cool Air:** Heavy reliance on pure whites, gentle frosted backdrops, and cool atmospheric grays to evoke clarity and focus.
- **Biophilic & Atmospheric Accents:** Strategic reliance on fresh botanical mints for vitality, completed goals, and kinetic momentum, alongside crisp sky blues for hydration, recovery metrics, and primary interactions.
- **Micro-Tactile Softness:** Subdued ambient drops, generous padding, and wide-radius containers that present biometric data as approachable and serene rather than clinical.

## Colors

The palette relies entirely on an airy light canvas. It avoids pure black text or high-density ink pools in favor of deep slate typography on bright, clean substrates.

### Palette Implementation
- **Surface Foundations:**
  - `surface-canvas`: `#FAFCFD` — Crisp atmospheric tint for primary view backgrounds.
  - `surface-card`: `#FFFFFF` — Pure white for elevated component modules and dashboard widgets.
  - `surface-subtle`: `#F1F5F9` — Soft cool slate for nested cards, inactive states, and data tracks.
  - `surface-border`: `#E2E8F0` — Barely-there containment lines for structural grid boundaries.

- **Primary (Mint Vitality):**
  - Base: `#10B981` (Success rings, target completions, active primary toggles).
  - Hover/Light: `#34D399`.
  - Tint/Wash: `#D1FAE5` (Pill backgrounds, positive delta badges, active timeline segments).

- **Secondary (Sky Hydration & Pace):**
  - Base: `#0EA5E9` (Interactive buttons, selected states, biometric pulse paths).
  - Hover/Light: `#38BDF8`.
  - Tint/Wash: `#E0F2FE` (Metric card backdrops, secondary badge surfaces).

- **Typography & Neutrals:**
  - `text-primary`: `#0F172A` (900 slate, providing crisp legibility without harsh black tone).
  - `text-secondary`: `#475569` (Subtle body copy, units of measurement, secondary labels).
  - `text-muted`: `#94A3B8` (Inactive icons, chart ticks, timestamp footers).

## Typography

The type system is built entirely on `Inter` to provide structural rhythm, crystal-clear numerical rendering, and an objective, technical-yet-friendly demeanor.

- **Numerics & Data Points:** Enable tabular figures (`font-variant-numeric: tabular-nums`) across all analytical dashboards, metric readouts, and pace timers to prevent horizontal layout shift during dynamic state updates.
- **Hierarchy Rules:** 
  - Main metric readouts utilize `display-lg` paired immediately with `label-caps` in uppercase styling for unit labels (e.g., `BPM`, `KCAL`, `KM`).
  - Card titles use `headline-md` with strict -0.01em tracking to maintain visual density against wide negative space.
  - Supporting subtexts and comparative stats stay strictly in `body-sm` or `body-md` using `#475569`.

## Layout & Spacing

The layout philosophy centers on open negative space, creating an uncluttered view where health information is compartmentalized into self-contained visual modules.

### Grid & Canvas Structure
- **Desktop (1024px+):** 12-column responsive fluid grid with maximum container width of `1380px`. Left or top persistent navigation, generous `margin` of `2.5rem` (40px), and column gutters set to `1.5rem` (24px).
- **Tablet (768px – 1023px):** 8-column layout. Gutters scale to `1.25rem`, container margins collapse to `2rem`.
- **Mobile (< 768px):** 4-column layout. Side margins contract to `1.25rem`, gutters to `1rem`. Complex analytics shift to single-column horizontal carousels or stacked module lists.

### Spacing Principles
- Never pack data clusters together; apply `space-xl` between logical section groups (e.g., separating today's summary from activity logs).
- Interior card paddings must consistently employ `space-lg` (24px) on desktop to guarantee an unconfined, floating aesthetic. Mobile interiors scale down to `space-md` (16px).

## Elevation & Depth

This system avoids heavy, high-contrast, opaque drop shadows. Depth is achieved through multi-layered ambient diffusion, delicate glass overlays, and faint border containment that blend seamlessly with the crisp light canvas.

### Atmospheric Shadow Levels
- **Level 1 (Card Default):** Ultra-soft, expanded blur using tinted slate shadow:
  - `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.03), 0 2px 6px -1px rgba(15, 23, 42, 0.02);`
  - Paired with an ultra-fine border: `1px solid rgba(226, 232, 240, 0.8)`.
- **Level 2 (Hover / Active Module):** Lifted state with light energy reflection:
  - `box-shadow: 0 12px 32px -4px rgba(14, 165, 233, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.03);`
  - Border transitions to: `1px solid rgba(56, 189, 248, 0.3)`.
- **Level 3 (Modal / Floating Utility Pill):**
  - `box-shadow: 0 20px 40px -6px rgba(15, 23, 42, 0.07), 0 8px 16px -4px rgba(15, 23, 42, 0.03);`
  - Subtle top edge highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.9)`.

### Translucency & Glass Surfaces
Floating header navigation bars and fixed control decks utilize soft back-surface blurs:
- `background: rgba(250, 252, 253, 0.82);`
- `backdrop-filter: blur(16px);`
- `border-bottom: 1px solid rgba(226, 232, 240, 0.6);`

## Shapes

The interface embraces organic, friendly contours that mirror human movement and athletic form. Sharp angles are completely omitted to reinforce calm and wellness.

- **Primary Containers & Dashboard Cards:** Rendered with standard `rounded-2xl` (1rem / 16px) or prominent `rounded-3xl` (1.5rem / 24px) for hero activity panels.
- **Interactive Controls (Buttons, Inputs, Metric Chips):** Formed with pill contours (`rounded-full` / `9999px`) to create smooth touch points and distinct contrast against square card boundaries.
- **Inner Progress Bars & Track Rails:** Pill capsules (`rounded-full`) ensuring progress indicators have circular terminal caps.

## Components

### Buttons
- **Primary Action (Mint / Sky):** Pill-shaped (`rounded-full`), `space-sm` vertical by `space-lg` horizontal padding. Solid `#0EA5E9` or `#10B981` fill with pure white typography (`label-lg`). Subtle ambient shadow tinted to the button base color.
- **Secondary Action:** Pill-shaped, background tinted in `#E0F2FE` (or `#D1FAE5`) with `#0284C7` (or `#059669`) text. Zero outer shadow; clear interactive hover scaling (`scale: 1.02`).
- **Ghost / Tertiary:** White or transparent fill, `#475569` text, transitioning to `#F1F5F9` background on hover.

### Metric Cards & Containers
- Clean pure white (`#FFFFFF`) surface, minimum `24px` internal padding, `rounded-3xl` corners.
- Cards host a micro-header (icon container + `label-caps` in uppercase muted slate), followed by the bold primary value (`display-lg`), concluded by a positive/negative trend delta capsule.

### Status Chips & Activity Pills
- Height: `28px` or `32px`. Pill-radius.
- Active / Positive: `#D1FAE5` background with `#065F46` label and a 6px `#10B981` indicator dot.
- Pace / Neutral: `#E0F2FE` background with `#0369A1` label.
- Resting / Inactive: `#F1F5F9` background with `#475569` label.

### Form Inputs & Search Fields
- Fully rounded (`rounded-full`) or soft-pill (`rounded-xl`).
- Background: `#F1F5F9` with zero initial border. Focus state animates background to `#FFFFFF` with a crisp `2px` focus ring in `#38BDF8` and an ambient elevation spread.
- Text: `#0F172A`, placeholder text: `#94A3B8`.

### Checkboxes & Toggle Switches
- **Toggle Switches:** Compact pill tracks (`48px` length, `26px` height) with `#E2E8F0` track base. Active state illuminates the track in `#10B981`. Smooth sliding circle thumb (`20px`) in `#FFFFFF` with subtle drop shadow.
- **Checkboxes:** `rounded-lg` (6px radius) boxes in `#E2E8F0`. Checked state fills `#10B981` with a bold white check glyph.

### Biometric Progress Rings & Activity Tracks
- Ring tracks feature a base track in `#F1F5F9`. Active fill paths use a clean gradient transition from `#38BDF8` to `#10B981` with rounded stroke terminals.
- Background rings maintain generous negative space to accommodate central typographic values without visual crowding.