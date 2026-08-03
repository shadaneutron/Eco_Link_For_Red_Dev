---
name: Industrial Sustainability System
colors:
  surface: '#f7faf9'
  surface-dim: '#d7dbda'
  surface-bright: '#f7faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f3'
  surface-container: '#ebeeed'
  surface-container-high: '#e6e9e8'
  surface-container-highest: '#e0e3e2'
  on-surface: '#181c1c'
  on-surface-variant: '#44474f'
  inverse-surface: '#2d3131'
  inverse-on-surface: '#eef1f0'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#465e8b'
  primary: '#000a1f'
  on-primary: '#ffffff'
  primary-container: '#00204a'
  on-primary-container: '#7189b8'
  inverse-primary: '#aec7fa'
  secondary: '#006a6a'
  on-secondary: '#ffffff'
  secondary-container: '#8cf3f3'
  on-secondary-container: '#007070'
  tertiary: '#000d07'
  on-tertiary: '#ffffff'
  tertiary-container: '#00271a'
  on-tertiary-container: '#009b73'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#aec7fa'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#2e4772'
  secondary-fixed: '#8cf3f3'
  secondary-fixed-dim: '#6fd7d6'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f4f'
  tertiary-fixed: '#80f9ca'
  tertiary-fixed-dim: '#62dcaf'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#00513b'
  background: '#f7faf9'
  on-background: '#181c1c'
  surface-variant: '#e0e3e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 40px
---

## Brand & Style

This design system is built for the "Industrial Sustainability" sector, targeting enterprise-level decision-makers and environmental analysts. The aesthetic is **Modern Minimalism** with a focus on data density, precision, and institutional trust.

The brand personality is balanced between the rigidity of industrial operations and the vitality of ecological preservation. It avoids the soft, "organic" tropes of consumer-facing green brands in favor of a clean, systematic, and professional SaaS interface. The visual language conveys reliability and efficiency through structured layouts and a disciplined use of its signature color palette.

## Colors

The palette is derived directly from the core logo, utilizing high-contrast tones to differentiate data and status.

- **Primary (Navy Blue):** Used for primary navigation, headings, and high-level structural elements. It provides the "Industrial" anchor.
- **Secondary (Teal):** Used for primary actions, active states, and links. It bridges the gap between the corporate navy and the ecological green.
- **Tertiary (Leaf Green):** Used for success states, sustainability metrics, and positive progress indicators.
- **Neutrals:** A cool-toned slate gray scale is used for borders, backgrounds, and secondary text to maintain a clean, clinical feel.
- **Surface:** A pure white or very light cool gray (#F4F7F6) background provides the necessary whitespace for complex data visualization.

## Typography

The typography strategy emphasizes clarity and technical precision.

- **Headlines:** Uses **Hanken Grotesk** for a sharp, contemporary, and engineered feel. It reflects the geometric nature of the logo's "EcoLink" wordmark.
- **Body:** Uses **Inter** for maximum legibility in data-heavy SaaS contexts. It is neutral and professional.
- **Data & Labels:** Uses **JetBrains Mono** for numerical data, status tags, and technical labels. This monospaced font reinforces the "Industrial" and "Precision" aspects of the platform.

## Layout & Spacing

This design system employs a strict **8pt spacing system** to ensure mathematical consistency across all layouts.

- **Grid:** A 12-column fluid grid is used for desktop (1440px+), transitioning to an 8-column grid for tablets and a 4-column grid for mobile devices.
- **Gutter & Margins:** Standard 24px gutters provide breathing room between complex data cards. Outer margins are set to 40px on desktop to frame the content professionally.
- **Density:** High information density is preferred. Use 'sm' (8px) and 'md' (16px) spacing for internal component padding to maximize screen real estate for charts and tables.

## Elevation & Depth

To maintain a "Modern Industrial" look, the system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Background):** #F4F7F6 — The foundation.
- **Level 1 (Cards/Surface):** #FFFFFF — With a subtle 1px border (#E2E8F0).
- **Level 2 (Hover/Active):** No shadow, but a 2px stroke using the Secondary (Teal) color.
- **Depth:** Depth is achieved through color stacking (e.g., a navy sidebar on a light gray background) rather than physical elevation metaphors. This keeps the UI feeling "flat" and fast.

## Shapes

The shape language is **Soft (0.25rem)**. This provides just enough curvature to feel modern and accessible while maintaining the rigid, structural integrity required for an enterprise tool. 

Large-scale containers like cards use `rounded-lg` (0.5rem), while buttons and input fields stay at the base `rounded` (0.25rem) to look precise and "tool-like."

## Components

- **Buttons:** Primary buttons use a solid Navy background with White text. Secondary buttons use a Teal outline. All buttons have a fixed height of 40px for consistency.
- **Input Fields:** Use 1px borders in a medium-gray, switching to a 2px Teal border on focus. Labels should always use the `label-sm` monospaced style for a technical feel.
- **Status Chips:** Use high-contrast "Leaf Green" for success/eco-positive, "Navy" for neutral/info, and a vibrant "Orange" for warnings.
- **Data Tables:** These are central to the system. Use `body-sm` for row content and `label-sm` for headers. Alternating row colors (zebra striping) should be very subtle (#F8FAFB).
- **Sustainability Metrics:** Use custom SVG icons that mirror the "leaf" and "arrows" from the logo, styled with a consistent 2px stroke weight.