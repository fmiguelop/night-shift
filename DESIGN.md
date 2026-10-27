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
    fontSize: "clamp(44px, 6vw, 80px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Courier New, monospace"
    fontSize: "14px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "#eeeeee"
    padding: "10px 0"
  button-control:
    backgroundColor: "{colors.control}"
    textColor: "{colors.text}"
---

# Design System: The Night Shift

## Overview

**Creative North Star: "Haunted maintenance console"**

The user requested a more immersive, minimal horror game in the spirit of FNAF 1. The room fills the screen; the interface recedes into a clock, power readout, hallway controls, and camera toggle. The former decorative website framing and lime accents no longer lead the experience.

**Key Characteristics:**
- Near-monochrome, dim surveillance imagery.
- Sparse title menu and plain operational typography.
- Persistent, readable gameplay states over the room.

## Colors

The `lime` custom property remains named for compatibility but now holds an off-white. Text and borders use warm gray neutrals on black. A muted red (`#722e26`) identifies a closed door. Camera images are grayscale; existing original character colors remain underneath the scene filters.

The user selected [UCA’s visual identity](https://uca.edu.sv/identidad-visual/) as the campus reference. The published black wordmark is used intact as an image in the security office. Blue-and-white Spanish room signs use `uca-site-blue`, observed on the official website; the complete manual was login-gated, so this is not a verified manual color specification. Camera feeds retain low saturation, while controls remain neutral. The fictional room plan does not claim to reproduce the real campus. Asset sources are recorded in `assets/uca/SOURCE.md`.

## Typography

Courier New with a monospace fallback carries the interface, referencing the requested minimal horror-game presentation. Body text is 14px. The title scales from 44px to 80px on desktop and is 49px below 600px. Clock text is 32px, reduced to 26px on mobile. Buttons and captions generally use 11–14px; the title action uses 18px.

## Layout

The office fills a 100svh viewport, with a 570px minimum height (620px on mobile). Door and light controls sit at the left and right edges. The clock is upper-right, power lower-left, instructions lower-right, and the camera toggle lower-center. The title screen hides gameplay controls until a round begins. Camera mode hides the hallway button clusters while leaving keyboard behavior intact. Breakpoints at 900px and 600px compress controls and camera-map dimensions. Live-toolbar-specific offsets keep editing controls clear of gameplay.

## Elevation & Depth

The room retains perspective, low lighting, scene shadows, scanlines, and a vignette. The surrounding website shell has no frame or shadow. Interface controls use borders and restrained translucent dark fills.

## Shapes

Controls and panels are rectangular with thin gray borders. Rounded geometry belongs to the existing CSS characters and scene objects.

## Components

### Title action

A plain 18px text action with a leading pointer on hover or keyboard focus. Existing copy and start behavior remain intact.

### Hallway controls

Door and light buttons sit in vertical edge clusters with visible text labels. Desktop hints show keyboard shortcuts. Pressed controls use muted red, white text, and a lighter border. Disabled controls reduce opacity.

### Camera monitor and map

The monitor toggles between office and surveillance. A connected floor plan holds eight camera buttons at their room positions, with the office at the bottom between the two corner approaches. The active camera uses a light fill and dark text; the selected room name appears below the plan. Map controls and titles remain above interference. The initial camera is Lecture hall (CAM 01).

Each feed uses fixed-lens perspective geometry rendered into a canvas: a lecture hall with desks and chalkboard, a library with book stacks, a teaching lab, west/east academic corridors, archives, a stairwell landing, and a faculty lobby. Room scale, camera placement, props, ceiling panels, and distance shading distinguish the views. Existing characters are projected into room space. Canvas redraws are cached until camera, occupants, or viewport changes. Mobile uses the same room geometry and a smaller floor plan.

### Status, captions, and help

Power and usage remain visible during play. Audio captions remain available with sound disabled. Help pauses the game in a scrolling dialog; endings retain restart behavior. Reduced-motion rules remain in force.

## Do's and Don'ts

- **Do** let the room occupy the screen.
- **Do** preserve labels, captions, and keyboard focus visibility.
- **Do** keep camera interference beneath readable controls.
- **Don't** restore promotional header/footer framing or bright accent branding over play.
- **Don't** remove gameplay information to achieve visual minimalism.
