---
name: Kinetic Horizon
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#434654'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#994700'
  on-secondary: '#ffffff'
  secondary-container: '#fb7800'
  on-secondary-container: '#592600'
  tertiary: '#004b58'
  on-tertiary: '#ffffff'
  tertiary-container: '#006476'
  on-tertiary-container: '#70e2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#ffdbc8'
  secondary-fixed-dim: '#ffb68b'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#adecff'
  tertiary-fixed-dim: '#5dd6f3'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5d'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
  verified-green: '#10B981'
  background-subtle: '#F9FAFB'
  surface-card: '#FFFFFF'
  border-low-contrast: '#E5E7EB'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
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
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  tabular-nums:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-gap-lg: 80px
  section-gap-md: 48px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

The design system is engineered to embody **Academic Authority** blended with **Modern Vitality**. As a platform facilitating international education, the visual language must strike a balance between the institutional trust required by parents and the energetic, optimistic outlook of prospective students.

The chosen style is **Corporate / Modern** with a focus on **Precision Minimalism**. It prioritizes high-speed information retrieval and cognitive clarity. By utilizing expansive whitespace, the design ensures that data-heavy university comparisons remain digestible. Subtle technical touches—like refined borders and systematic grids—communicate the platform's technological "performance" and reliability. The aesthetic is clean and "Wikipedia-adjacent" in its utility, but elevated through premium typography and a sophisticated color strategy.

## Colors

This design system utilizes a **Trust & Energy** palette. 

- **Primary (Deep Blue):** Represents institutional stability, wisdom, and professional guidance. It is the dominant color for navigation and primary actions.
- **Secondary (Vibrant Orange):** Represents youth, energy, and the "call to adventure" of studying abroad. It is reserved strictly for high-conversion CTAs like "Apply Now."
- **Tertiary (Cyan):** Used for informational accents, category tags, and secondary data visualizations to prevent the UI from feeling overly rigid.
- **Neutral:** A systematic gray scale optimized for long-form reading and SEO-rich content.

The default mode is **Light**, utilizing pure white backgrounds (`#FFFFFF`) to maximize readability and maintain a clean, high-performance feel. Surfaces for dashboards and sidebars use a subtle off-white (`#F9FAFB`) to create soft regional separation.

## Typography

The system uses a dual-sans-serif approach to maximize clarity across 17 languages. 

**Geist** is used for headlines and UI labels to provide a technical, modern edge with its geometric precision. It ensures that university names and "Quick Facts" stand out with authority. 

**Inter** is used for all body text, optimized for highly legible long-form reading and complex data tables. 

For **Internationalization (i18n)**, the system defaults to system-serif fallbacks for RTL languages (Arabic/Persian) to ensure script-specific legibility while maintaining the vertical rhythm established by the Inter-based baseline grid. All data tables must use the `tabular-nums` setting to ensure vertical alignment of tuition fees and rankings.

## Layout & Spacing

This design system employs a **12-column Fluid Grid** that transitions to a fixed-width container on desktop (`1280px`). 

- **Desktop:** 12 columns with 24px gutters.
- **Tablet:** 8 columns with 20px gutters.
- **Mobile:** 4 columns with 16px margins.

The spacing rhythm is strictly based on a **4px/8px baseline**. Vertical rhythm is emphasized to support SEO-driven "Topical Authority" pages, using generous `section-gap-lg` to prevent content overcrowding. For University Detail pages, a **Sticky Sidebar** pattern is used for the "Apply Now" card, ensuring the conversion point is always present as the student scrolls through academic data.

## Elevation & Depth

To maintain a "high-performance" feel, the system avoids heavy drop shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Level 0 (Background):** Pure white or light gray (`#F9FAFB`).
2.  **Level 1 (Cards/Containers):** White surface with a 1px border (`#E5E7EB`). No shadow.
3.  **Level 2 (Interactive/Floating):** Used for University Cards and Hover states. Subtle, extra-diffused ambient shadow (4% opacity, 12px blur) to suggest interactivity without visual noise.
4.  **Level 3 (Modals/Overlays):** Used for Auth/Apply forms. Backdrop blur (8px) on the underlay to maintain focus on the task.

This "Flat-Plus" approach ensures the UI remains fast, lightweight, and accessible for users on lower-bandwidth connections across various global markets.

## Shapes

The shape language is **Rounded (8px base)**. 

- **Buttons & Inputs:** Use the base 8px (`0.5rem`) radius to feel approachable yet structured.
- **University Cards:** Use `rounded-lg` (16px) to create a friendly, modern frame for university photography.
- **Badges/Tags:** Use `rounded-full` (Pill-shaped) for "Verified" and "Status" indicators to distinguish them from interactive buttons.

Borders are kept thin (1px) to maintain the clean, technical aesthetic. For data tables, headers have a top-only radius to create a unified container feel.

## Components

### Buttons
- **Primary:** Secondary Orange background, white text. Reserved for "Apply Now" or "Submit Application." High-contrast.
- **Secondary:** Primary Blue background or outline. Used for "View Details" or "Compare."
- **Ghost:** Minimal padding, used for "See All" or navigation within tabs.

### University Cards
Designed for "Programmatic SEO" layouts. Features include:
- Aspect ratio 16:9 for university hero images.
- Floating "Verified" badge in the top-right corner.
- Summary grid for 3 key stats (Tuition, Ranking, Location).

### Search & Filters
A high-performance "Command Palette" style search bar is the centerpiece. It must support predictive results for university names, cities, and programs. Filters use a horizontal scroll on mobile and a persistent sidebar on desktop.

### Data Tables (Tuition/Ranking)
Tables use a alternating "zebra stripe" pattern in `#F9FAFB` for readability. Headers are sticky on scroll. Text is left-aligned for names and right-aligned (tabular-nums) for currency and numerical rankings.

### Input Fields
Standardized via shadcn/ui. Clear focus states using a 2px Primary Blue ring. Labels are always visible (no floating labels) to ensure accessibility and ease of translation.

### Success Badges
Used for student reviews and official accreditation. They utilize the `verified-green` and a small checkmark icon to build instant trust.