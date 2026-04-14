# Design System Specification: Kinetic Elite

## 1. Overview & Creative North Star: "The Obsidian Performance"
This design system moves away from the "friendly fitness app" cliché. It is built on the **Creative North Star of "The Obsidian Performance"**—an aesthetic that mirrors the intensity of a high-end, late-night boutique gym. The interface is not just a tool; it is a high-performance instrument.

To break the "template" look, we utilize **Intentional Asymmetry**. Large-scale typography (Space Grotesk) should overlap container boundaries, and data density is managed through tonal layering rather than rigid grids. We prioritize a "heads-up display" (HUD) feel where information is layered in 3D space using glassmorphism, creating a sense of sophisticated depth and focused energy.

---

## 2. Colors & Surface Architecture
The palette is rooted in deep blacks and "Vibrant Ember" (Orange), designed to pop against the void of the background.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-high` card sits on a `surface` background without a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of obsidian and frosted glass. 
- **Base:** `surface` (#131315)
- **Deepest Layer:** `surface-container-lowest` (#0E0E10) for inactive or recessed areas.
- **Topmost Layer:** `surface-container-highest` (#353437) for floating interactive elements.

### The "Glass & Gradient" Rule
To achieve a premium feel, floating elements (modals, navigation bars) must use **Glassmorphism**: 
- **Fill:** `surface_variant` (#353437) at 60% opacity.
- **Effect:** `backdrop-filter: blur(20px)`.
- **Signature Gradient:** For primary CTAs, use a linear gradient from `primary` (#FFB59B) to `primary_container` (#F85F1B) at a 135-degree angle to provide a "burning ember" glow.

---

## 3. Typography: Editorial Authority
We pair the aggressive, technical nature of **Space Grotesk** with the refined legibility of **Be Vietnam Pro**.

| Category | Token | Font Family | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Space Grotesk | 3.5rem | High-impact metrics (e.g., Weight Lifted) |
| **Headline** | `headline-lg` | Space Grotesk | 2.0rem | Section headers; aggressive and bold |
| **Title** | `title-lg` | Be Vietnam Pro | 1.375rem | Content grouping; professional |
| **Body** | `body-md` | Be Vietnam Pro | 0.875rem | Technical instructions and descriptions |
| **Label** | `label-md` | Be Vietnam Pro | 0.75rem | Metadata and secondary stats |

**Editorial Note:** Use `display-lg` for single hero numbers. Let them bleed slightly into the margin to create a custom, non-standard layout.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to simulate height; we use light and opacity.

*   **The Layering Principle:** Depth is achieved by "stacking" the `surface-container` tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural "recessed" look.
*   **Ambient Shadows:** If a "floating" effect is required (e.g., a workout timer), shadows must be extra-diffused. 
    *   *Spec:* `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, it must be a **Ghost Border**: use `outline-variant` (#5A4138) at **15% opacity**. Never use 100% opaque borders.
*   **Soft Orange Glows:** For active states, use an outer glow using the `primary` color at 10% opacity to simulate an LED emission.

---

## 5. Components

### Action Components
*   **Buttons**: 
    *   *Primary:* Rounded-xl (1.5rem), Signature Orange Gradient, White Text.
    *   *Secondary:* `surface-container-highest` fill, no border, white text.
*   **Chips**: Used for muscle groups or equipment. Use `surface-container-low` with `label-md` text. For selected states, use a `primary` ghost border (20% opacity).

### Data & Feedback
*   **High-Density Cards**: Forbid the use of divider lines. Separate "Sets" and "Reps" using vertical whitespace (Spacing Scale `8` or `10`) or a subtle shift from `surface` to `surface-container-low`.
*   **Input Fields**: `surface-container-lowest` background with a `primary` 2px bottom-bar indicator on focus. Avoid full-box outlines.
*   **Performance Tooltips**: Always glassmorphic. `backdrop-filter: blur(12px)` with `on-surface` text.

### Custom Components
*   **Progress Orbs**: Instead of flat bars, use concentric circles with `tertiary_container` gradients to visualize volume.
*   **The "Pulse" Indicator**: A small animated `primary` dot next to "Live Workout" sessions to add kinetic energy to the UI.

---

## 6. Do's and Don'ts

### Do
*   **DO** use intentional white space (Spacing 16+) to separate major training blocks.
*   **DO** overlap typography over images or glass panels for a high-fashion editorial feel.
*   **DO** use "Surface-Dim" for background content when a modal is active to focus the user’s eye on the glow.

### Don't
*   **DON'T** use 1px solid dividers. Use tonal shifts.
*   **DON'T** use pure #FFFFFF for secondary text; use `on-surface-variant` (#E3BFB3) to maintain the "Obsidian" mood.
*   **DON'T** use standard "Drop Shadows." Use the Tonal Layering or Ambient Glows described in Section 4.
*   **DON'T** use sharp 90-degree corners. Stay within the 0.75rem to 1.5rem (md to xl) roundedness scale.