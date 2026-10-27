# The Night Shift

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Players looking for casual play. More specific audience and device priorities are undecided.

## Product Purpose

A browser survival-horror game intended for short, casual play sessions. The current goal is to survive a four-minute night shift until the in-game clock reaches 6 AM.

## Operating Context

The player monitors rooms from a security office, watches two hallways, and manages doors, lights, and limited power. A round can be restarted after winning or losing. Instructions pause the simulation.

## Capabilities and Constraints

Current implementation facts, rather than permanent requirements:

- HTML, CSS, and JavaScript modules, with no runtime package dependencies.
- Local browser state; reloading starts fresh.
- Eight camera rooms and three original characters: Marlow, Pip, and Dot. Each has a distinct threat pattern.
- Mouse controls and keyboard shortcuts: Space for cameras, A/D for doors, Q/E for lights.
- Optional synthesized audio, directional sound captions, camera interference, and jumpscares.
- Development server: `npm run dev`, serving the project at port 5173. Simulation checks: `npm test`.

Open decisions: target devices, difficulty and replayability goals, persistence, and which current technical choices must remain binding.

## Brand Commitments

The current product name is The Night Shift. The repository describes it as an original prototype inspired by the camera, door, and power-management loop of Five Nights at Freddy's, using original CSS-drawn characters rather than game assets. Long-term naming and asset requirements remain unconfirmed.

## Evidence on Hand

- `README.md`: prototype description, controls, and run instructions.
- `index.html`: player-facing orientation, help, and game interface.
- `src/game.js`: simulation and character behavior.
- `src/main.js`: controls, presentation, captions, and synthesized audio.
- `src/game.test.js`: simulation tests.
- `style.css` and `assets/camera-noise.svg`: incumbent presentation and local visual asset.

## Product Principles

- Prioritize casual play when making future product decisions.
- Keep the short-session survival objective understandable.
- Treat additional audiences, permanent technical constraints, and new product claims as open until confirmed.

## Accessibility & Inclusion

The current game offers sound captions even with audio disabled, keyboard shortcuts, button state announcements, and paused instructions. Required accessibility standards and additional user needs are undecided; these features do not establish an accessibility compliance claim.
