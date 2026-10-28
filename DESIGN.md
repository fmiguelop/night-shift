---
name: The Night Shift
description: Minimal survival-horror play surface with a sparse menu and near-monochrome surveillance.
colors:
  lime: "#deded5"
  muted: "#a6a69e"
  line: "#55554e"
  background: "#050505"
  text: "#e5e5df"
  control: "#151513dd"
  control-hover: "#373731"
  uca-site-blue: "#003c71"
typography:
  display:
    fontFamily: "Courier New, monospace"
    fontSize: "clamp(30px, 3.1vw, 46px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "0"
  menu-action:
    fontFamily: "Courier New, monospace"
    fontSize: "clamp(20px, 2vw, 26px)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Courier New, monospace"
    fontSize: "14px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.menu-action}"
    padding: "6px 0"
  menu-settings:
    backgroundColor: "#090909f5"
    textColor: "{colors.text}"
    padding: "16px 20px"
  button-control:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text}"
---

# Design System: The Night Shift

## Overview

**Creative North Star: "Haunted maintenance console"**

The user requested a more immersive, minimal horror game in the spirit of FNAF 1. The room fills the screen; the interface recedes into a clock, power readout, hallway controls, and camera toggle. The former decorative website framing and lime accents no longer lead the experience. The main menu uses bare left-aligned title and action text beside a dark, oversized Walter portrait under television interference.

**Key Characteristics:**
- Near-monochrome, dim surveillance imagery.
- Sparse title menu and plain operational typography.
- Persistent, readable gameplay states over the room.

## Colors

The `lime` custom property remains named for compatibility but now holds an off-white. Text and borders use warm gray neutrals on black. A muted red (`#722e26`) identifies a closed door. Camera images are grayscale; existing original character colors remain underneath the scene filters.

The user selected [UCA’s visual identity](https://uca.edu.sv/identidad-visual/) as the campus reference. The published black wordmark is used intact as an image in the security office. Blue-and-white Spanish room signs use `uca-site-blue`, observed on the official website; the complete manual was login-gated, so this is not a verified manual color specification. Camera feeds retain low saturation, while controls remain neutral. The fictional room plan does not claim to reproduce the real campus. Asset sources are recorded in `assets/uca/SOURCE.md`.

## Typography

Courier New with a monospace fallback carries the interface, referencing the requested minimal horror-game presentation. Body text is 14px. The three-line menu title uses the display token, becomes 30px at widths up to 600px, and becomes 28px at heights up to 650px. Menu actions use the menu-action token and become 21px at widths up to 600px. Settings uses 12px text; the selected night beneath Continue uses 12px text. Clock text is 32px, reduced to 26px on mobile. Gameplay buttons and captions generally use 11–14px.

## Layout

The office fills a 100svh viewport, with a 570px minimum height (620px on mobile). Door and light controls sit at the left and right edges. The clock is upper-right, power lower-left, instructions lower-right, and the camera toggle lower-center. The title screen hides gameplay controls until a round begins. It fills at least 100svh over black, with the title upper-left, actions below it, Walter cropped across the right side, Settings bottom-left, and a small version label bottom-right. Menu padding is clamp(36px, 9vh, 90px) vertically at the top and clamp(32px, 9vw, 140px) horizontally, with 24px below. At widths up to 600px it becomes 52px 42px 18px; at heights up to 650px the top becomes 32px. The content column can scroll on constrained viewports. The action gap is 12px, reduced to 6px in short viewports. Camera mode hides the hallway button clusters while leaving keyboard behavior intact. Breakpoints at 900px and 600px compress controls and camera-map dimensions. Live-toolbar-specific offsets keep editing controls clear of gameplay.

## Elevation & Depth

The room retains perspective, low lighting, scene shadows, scanlines, and a vignette. The surrounding website shell has no frame or shadow. Interface controls use borders and restrained translucent dark fills. The menu layers the existing Walter grab portrait, grayscale darkness and contrast filters, low-resolution canvas noise, black shading, and scanlines beneath readable text. The portrait is reused without raster changes; provenance remains in assets/characters/test/WALTER-ATTACK.md.

## Shapes

Controls and panels are rectangular with thin gray borders. Rounded geometry belongs to the existing CSS characters and scene objects.

## Components

### Menu actions

Unboxed New Game and Continue text actions have a 44px minimum target, no border or fill, and a leading `>>` marker on hover or keyboard focus. Hover and focus brighten the text to white; keyboard focus remains visible. New Game starts Night 1 while preserving unlocked nights. Continue appears after the first completed night and starts the selected night; its smaller second line identifies that night. Reload defaults to the highest unlocked night.

**The Quiet Menu Rule.** Keep introduction prose and ordinary progress notes out of the main menu. Only a storage failure adds a progress status message.

### Menu Settings and night selection

Settings is a small bottom-left disclosure with a 44px minimum target. Its bordered dark panel opens upward, 8px above the trigger, at up to 280px wide. Native Sound and Subtitles checkboxes have 44px label rows and 18px controls. Sound defaults to on and subtitles to off; Settings is accessible only from the main menu. Enabled subtitles remain available with sound disabled.

The labeled native night selector appears beneath the actions only after two nights have been completed (`unlockedNight >= 3`). It lists all five nights and disables locked options. The field has a dark fill, thin gray border, 8px padding, a 36px minimum height, and a visible keyboard focus outline.

### Menu interference

A 320 × 180 canvas supplies pixelated television static at no more than eight frames per second. It stops while a shift is active and resumes on return to the main menu. Reduced motion holds a single static frame instead of animating the interference.

### Hallway controls

Door and light buttons sit in vertical edge clusters with visible text labels. Desktop hints show keyboard shortcuts. Pressed controls use muted red, white text, and a lighter border. Disabled controls reduce opacity.

### Camera monitor and map

The monitor toggles between office and surveillance. A connected floor plan holds eight camera buttons at their room positions, with the office at the bottom between the two corner approaches. The active camera uses a light fill and dark text; the selected room name appears below the plan. Map controls and titles remain above interference. The initial camera is Lecture hall (CAM 01).

Each feed uses fixed-lens perspective geometry rendered into a canvas: a lecture hall with desks and chalkboard, a library with book stacks, a teaching lab, west/east academic corridors, archives, a stairwell landing, and a faculty lobby. Room scale, camera placement, props, ceiling panels, and distance shading distinguish the views. Existing characters are projected into room space. Canvas redraws are cached until camera, occupants, or viewport changes. Mobile uses the same room geometry and a smaller floor plan.

### Status, captions, and help

Power and usage remain visible during play. Sound is on by default and starts with the player’s first shift. The HUD shows the active night. Help pauses the game in a scrolling dialog; endings offer the next night after a win, the same night after a loss, and a main-menu action for replay selection. Night 5 completion offers a replay and acknowledges the full week. Reduced-motion rules remain in force.

## Do's and Don'ts

- **Do** let the room occupy the screen.
- **Do** preserve labels, captions, and keyboard focus visibility.
- **Do** keep camera interference beneath readable controls.
- **Don't** restore promotional header/footer framing or bright accent branding over play.
- **Don't** remove gameplay information to achieve visual minimalism.
