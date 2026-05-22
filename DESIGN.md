---
name: Synthesized Intelligence Portfolio
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#ffb784'
  on-tertiary: '#4f2500'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 32px
  margin-mobile: 24px
  section-gap: 160px
---

## Brand & Style

This design system is built for an interdisciplinary leader operating at the intersection of AI engineering, product management, and business strategy. The aesthetic reflects a "Hyper-Minimalist Technical" direction—blending the precision of a developer environment with the refined elegance of a premium consultancy.

The visual narrative prioritizes clarity and intellectual authority. By utilizing a near-black foundation and expansive negative space, the content is elevated to a gallery-like status. The UI avoids decorative fluff, relying instead on typographic hierarchy and subtle textural nuances to communicate sophistication. The target audience includes venture capitalists, technical founders, and executive leadership who value precision and high-level execution.

## Colors

The palette is strictly monochromatic with a singular, high-energy accent. The background uses a deep, "ink-trap" black (#0A0A0A) to ensure absolute contrast with white typography. 

- **Primary (Deep Violet):** Reserved for mission-critical actions and active states. It should appear as a singular point of light in a dark environment.
- **Surface & Borders:** Tonal shifts are minimal. Surfaces move from #0A0A0A to #141414, with borders strictly at #1A1A1A to maintain a "barely-there" structural definition.
- **Texture:** A global 2% grain overlay should be applied to the background to prevent color banding and add a tactile, filmic quality.

## Typography

The system utilizes a dual-sans serif approach. **Geist** is used for headlines and labels to leverage its technical, monospaced-influenced proportions. **Inter** is used for body copy to ensure maximum legibility at length.

Key rules:
- **Tight Tracking:** Headlines must use negative letter spacing to create a high-impact, editorial "block" feel.
- **Variable Weight:** Use Bold (700) for displays and Regular (400) for body. Avoid semi-bold for body text to maintain a high-contrast visual rhythm.
- **Labels:** Small caps with generous tracking (10%) are used for category tags and section headers to provide a structural "metadata" feel.

## Layout & Spacing

The layout philosophy is "Purposeful Emptiness." It utilizes a 12-column fixed grid for desktop, but the grid is often intentionally left under-occupied to create asymmetrical balance.

- **Vertical Rhythm:** A massive 160px gap between major sections forces the user to focus on one narrative beat at a time.
- **Alignment:** Content should be primarily left-aligned to mirror a code editor or a formal document. 
- **The "Safe Zone":** Use large internal padding within cards (min 48px) to ensure technical content doesn't feel cramped.

## Elevation & Depth

This system avoids traditional shadows. Depth is communicated through **Tonal Layering** and **Luminescence**.

- **Stacked Depth:** Elements closer to the user are slightly lighter (#141414) than the background (#0A0A0A). 
- **Soft Glows:** Instead of drop shadows, use ultra-diffuse radial gradients of the Primary color (#7C3AED) behind key cards at 5-10% opacity to simulate a "backlit" tech glow.
- **Glassmorphism:** Use only for navigation bars. Apply a 20px backdrop-blur with a 10% white border on the bottom edge to separate the fixed nav from the scrolling content.

## Shapes

The shape language is "Precision-Softened." We use small radii (4px to 8px) to suggest a modern, engineered feel without the aggression of sharp 90-degree corners.

- **Buttons & Inputs:** 4px radius (Soft).
- **Cards & Containers:** 8px radius (Soft-Medium).
- **Interactive Elements:** Maintain consistent radii across all states to ensure the UI feels rigid and reliable.

## Components

### Buttons
- **Primary:** Solid #7C3AED with white text. No shadow. 
- **Ghost (Default):** Transparent background with a 1px border of #1A1A1A. Transitions to a white border on hover.
- **Action Link:** Text-only with a 1px underline that expands from the center on hover.

### Cards
- **Project Card:** No background (transparent) with a 1px #1A1A1A border. Upon hover, the border color shifts to #7C3AED or the background shifts to #141414.
- **In-card Padding:** Minimum 40px to maintain the premium, airy feel.

### Input Fields
- **Search/Forms:** Minimalist bottom-border only (#1A1A1A). On focus, the border animates to #7C3AED.

### Chips/Tags
- **Technical Skills:** Small, Geist Mono font, #141414 background, no border. Used to denote stack or industry focus.

### Data Visualization
- **Line/Bar Charts:** Monochromatic white or Primary violet. No grid lines, only start/end labels to maintain the minimalist aesthetic.