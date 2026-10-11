---
name: Fleet Intelligence
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for executive-grade oversight and mission-critical precision. It targets fleet directors and operations managers who require high data density without cognitive fatigue. 

The style is **Professional Minimalism**: a systematic, high-utility aesthetic that prioritizes clarity and structural integrity. By leveraging generous white space and a rigid grid, the UI maintains an "expensive" feel while functioning as a high-performance tool. The emotional response is one of calm control, reliability, and institutional authority.

## Colors
The palette uses a high-contrast foundation for maximum legibility. 
- **Primary:** Utilized for core navigation, primary actions, and deep structural elements to ground the interface.
- **Secondary:** Applied to supporting text, icons, and non-critical borders to reduce visual noise.
- **Semantic Colors:** Emerald, Amber, and Crimson are reserved strictly for status-driven data points (Fleet Health, Alerts, Incidents) to ensure they stand out against the neutral backdrop.
- **Background:** A soft, cool-toned neutral (#F8FAFC) is used to reduce eye strain during long shifts while providing enough contrast for white card surfaces.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-heavy environments. The hierarchy is strictly enforced:
- **Display & Headlines:** Use tighter letter spacing and heavier weights to create an authoritative "Executive" feel.
- **Body Text:** Standardized at 14px for the primary workspace to maximize information density while maintaining readability.
- **Labels:** Small, uppercase labels with increased letter spacing are used for table headers and metadata categories to distinguish them from actionable content.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum constraints. 
- **Desktop:** A 12-column grid with 24px gutters. Dashboard modules should span 3, 4, 6, or 12 columns.
- **Sidebar:** A fixed 280px navigation rail on the left, which can collapse to a 64px icon-only rail to prioritize data workspace.
- **Spacing Rhythm:** Based on a 4px baseline. Use 16px (md) for internal component padding and 24px (lg) for spacing between major sections or cards.
- **Sticky Elements:** Global headers and table headers remain sticky to ensure context is never lost during deep vertical scrolls.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Ambient Shadows** rather than physical skeuomorphism.
- **Level 0 (Background):** #F8FAFC. The base canvas.
- **Level 1 (Cards/Surface):** Pure white (#FFFFFF). Used for all content containers.
- **Shadows:** Use a "soft-lift" approach. A single, highly diffused shadow: `0px 4px 20px rgba(15, 23, 42, 0.05)`. This creates a subtle distinction between the surface and the background without adding clutter.
- **Borders:** Low-contrast outlines (#E2E8F0) are used for internal dividers within cards and table rows to maintain structure without visual weight.

## Shapes
The shape language balances professional rigidity with modern approachability.
- **Primary Containers:** All cards and main modules use a **1rem (16px)** corner radius (`rounded-xl` logic).
- **Secondary Elements:** Buttons, input fields, and chips use a **0.5rem (8px)** corner radius for a more precise, technical feel.
- **Feedback Elements:** Status badges and avatars use fully circular (pill) shapes to differentiate them from functional UI components.

## Components
- **Buttons:** Primary buttons use #0F172A with white text. Secondary buttons use a light slate ghost-style with a subtle border.
- **Tables:** Modern, edge-to-edge layouts within cards. No vertical borders. Rows feature a subtle #F1F5F9 background hover effect. Sticky headers use a semi-opaque white background to maintain legibility over scrolling data.
- **Status Badges:** Compact, pill-shaped indicators. Use light tinted backgrounds with high-contrast text (e.g., Emerald-50 background with Emerald-700 text) for a refined, modern look.
- **Input Fields:** Minimalist design with a 1px border (#CBD5E1). On focus, the border shifts to Deep Blue (#0F172A) with a soft 2px outer glow.
- **Cards:** White surfaces, 16px radius, and the standard ambient shadow. Internal padding should be a consistent 24px for desktop views.
- **Data Visualizations:** Charts should use a refined color palette derived from the primary and semantic colors, utilizing clean lines and no fills unless necessary for readability.