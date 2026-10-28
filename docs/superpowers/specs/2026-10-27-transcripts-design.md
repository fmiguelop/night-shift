# Optional night transcripts

Approved in chat: each night's call transcript opens on its first attempt, pauses the night, can be dismissed immediately, and can be reopened from the office. Retries skip the introduction. New Game resets introduction history while preserving existing unlocked nights.

## Approaches

Considered unvoiced subtitled calls, terminal messages, and printed instructions. The user selected readable call transcripts: the existing five-call draft remains intact, with stage directions as transcript annotations, no voice or text-to-speech, and all text available immediately.

## Implementation plan

1. Store five call transcripts separately from the interface code.
2. Extend version-one progress data with validated transcript introduction history; migrate older saves by defaulting to empty history. Preserve this history on wins and clear it on New Game.
3. Add a native modal dialog and a quiet office Transcript action. Keep the close action visible while the document scrolls, with responsive sizing and keyboard support.
4. Centralize the instructions/transcript pause check for simulation, controls, and audio. Reset frame timing when closing a dialog.
5. Verify persistence, resets, retries, all five nights, pause/resume, keyboard dismissal, and desktop/mobile reading.

No changes to difficulty or win/loss rules. Transcript references to calls, forms, books, and photographs are narrative clues; this feature does not add those as interactive objects. Local-storage failure retains session behavior and uses the existing save-failure notice.

## Approved visual refinement

The user selected the photocopied call-log direction after reviewing the initial dark modal. Use muted neutral paper, dark Courier type, a simple Security office / Night heading, compact recording annotations, and generous document margins. Remove the boxed header/footer treatment and the misleading fixed End of transcript label. Close transcript is an understated underlined action with a 44px target, always visible. Preserve native dialog focus, Escape dismissal, scrolling, pause behavior, and save history. No decorative stamps, simulated glitches, voice, or new image assets.
