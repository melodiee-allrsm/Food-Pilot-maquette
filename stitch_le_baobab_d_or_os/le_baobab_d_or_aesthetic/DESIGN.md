---
name: Le Baobab d'Or Aesthetic
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d9d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ee'
  surface-container: '#f4ece9'
  surface-container-high: '#eee7e3'
  surface-container-highest: '#e9e1dd'
  on-surface: '#1e1b19'
  on-surface-variant: '#534438'
  inverse-surface: '#33302d'
  inverse-on-surface: '#f7efeb'
  outline: '#867466'
  outline-variant: '#d9c2b3'
  surface-tint: '#904d02'
  primary: '#6b3700'
  on-primary: '#ffffff'
  primary-container: '#8d4b00'
  on-primary-container: '#ffcba3'
  inverse-primary: '#ffb77d'
  secondary: '#9d430d'
  on-secondary: '#ffffff'
  secondary-container: '#fe8d53'
  on-secondary-container: '#6f2a00'
  tertiary: '#623c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#825100'
  on-tertiary-container: '#ffcb8f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb694'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7b2f00'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#fcba66'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e9e1dd'
typography:
  h1:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  h3:
    fontFamily: notoSerif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: plusJakartaSans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  button:
    fontFamily: plusJakartaSans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: '8'
  container-padding: 40px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system embodies a "Parisian Brasserie meets West African Luxury" aesthetic. The personality is sophisticated, welcoming, and culturally rich, blending the structured elegance of French fine dining with the warmth and vibrant textures of West African high hospitality. 

The style is **Minimalism with a Tactile edge**. It prioritizes heavy whitespace and a restricted, warm palette to create an atmosphere of "quiet luxury." The UI should evoke the feeling of a sun-drenched terrace in Dakar or a refined bistro in the 1st arrondissement. Information density is kept low to ensure the management experience feels effortless and premium, rather than purely industrial.

## Colors

The palette is rooted in earth tones and precious metals. The background uses a warm ivory instead of a harsh white to maintain a soft, parchment-like quality. 

*   **Primary (Amber Gold):** Used for key actions and brand accents, suggesting the glow of a setting sun.
*   **Secondary (Mahogany):** A refined, warm wood tone used for deep structural elements, navigation headers, or high-contrast accents to ground the design.
*   **Text:** A deep charcoal-stone ensures high legibility without the jarring contrast of pure black.
*   **Status Colors:** Should be muted and integrated into the palette (e.g., a dusty sage for "Success" or a terracotta for "Error") to avoid breaking the warm-minimalist harmony.

## Typography

The typographic hierarchy relies on the tension between a classic serif and a contemporary sans-serif. 

**notoSerif** is reserved for headings, titles, and editorial moments. It provides the "Parisian" authority and "West African" literary grace. It should be typeset with generous leading.

**plusJakartaSans** handles all functional UI elements. It is chosen for its modern, friendly, and legible character. Use the `label-caps` style for section headers and table headers to provide a structured, organized feel to management data.

## Layout & Spacing

This design system utilizes a **Fixed Grid** for main content areas to maintain an editorial, magazine-like feel, centering the content on larger displays. A 12-column system is used with wide 24px gutters to allow the UI "room to breathe."

Margins and paddings are generous. Avoid crowding elements; white space is treated as a luxury material. Vertical rhythm should follow an 8px base unit, with larger gaps (48px+) used to separate distinct functional modules or sections of the restaurant management dashboard.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

The background acts as the base. Cards and containers sit slightly above this surface using a very soft, diffused shadow (e.g., `0px 4px 20px rgba(28, 25, 23, 0.04)`). 

Instead of heavy borders, use **refined dividers**: 1px lines in a very light tint of the Mahogany or a warm grey. Depth is subtle; we avoid aggressive "stacking" in favor of a flat, layered look reminiscent of high-end stationery.

## Shapes

The shape language combines structured stability with organic softness. 

*   **Cards and Containers:** Use a 12px radius (`rounded-lg` in this system) to create a modern, friendly container for data and imagery.
*   **Interactive Elements:** Buttons and Chips/Pills use a 24px radius to create "capsule" shapes, providing a distinct contrast to the more rectangular layout blocks.
*   **Images:** High-end food photography should also respect the 12px container radius to maintain a cohesive visual flow.

## Components

*   **Buttons:** Primary buttons are Amber Gold with White or Mahogany text. Secondary buttons are outlined with a 1px Mahogany stroke. All buttons use the pill-shaped 24px radius.
*   **Cards:** Use the 12px radius with a soft shadow. In the context of "Table Management," cards should be ivory-toned with subtle mahogany borders when selected.
*   **Chips/Pills:** Used for status indicators (e.g., "Table Occupied," "Order Ready"). These should use desaturated background tints of the primary colors with high-contrast text.
*   **Input Fields:** Minimalist design with a bottom-only border or a very light 1px wrap. Focus states should transition the border to Amber Gold.
*   **Lists/Tables:** Rows should have generous padding (16px-24px vertical). Use the `label-caps` typography for headers to ensure a professional, ledger-like appearance.
*   **Imagery:** Use high-resolution, warm-toned photography. Food shots should feature natural textures (wood, ceramic, woven textiles) to reinforce the West African luxury theme.