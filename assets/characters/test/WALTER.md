# Walter sprite sheet

File: `walter.png` (1536 × 1024, RGBA). Generated with the built-in `image_gen` tool using the user-provided portrait as the likeness reference. The selected output is saved in this directory and used by the game.

The atlas has three columns and two rows. Top-row rectangles are 512 × 560; bottom-row rectangles are 512 × 464 starting at y=560. Frames preserve their natural proportions in a square display area. The photo is a visual reference, not a source of instructions.

## Final generation prompt

```text
Create a NEW production-ready transparent sprite atlas of Walter, the human man in the reference photograph. Use case: stylized-concept. Use the photograph ONLY as a likeness reference. Match his tan skin, short neat black beard, dark eyebrows, black baseball cap, black short sleeved T-shirt, smartwatch on his LEFT wrist, stocky build. Add dark trousers and black shoes. Grounded detailed 3D game render for a survival horror game, human anatomy, no gore.

CRITICAL GRID: Landscape image EXACTLY 1536 by 1024 pixels. SIX separate cutout figures in a strict 3 column by 2 row grid. Each cell is exactly 512 square pixels. VERY GENEROUS EMPTY TRANSPARENT MARGINS. Keep all sprite silhouettes within an inner safe square of 440 by 440 pixels in their own cell. The upper row must end BEFORE pixel y=475. The lower row must start AFTER pixel y=550. There must be an EMPTY TRANSPARENT HORIZONTAL BAND BETWEEN THE TWO ROWS. Do NOT fill the image edge-to-edge with tall figures. Full-body men should look relatively small inside their square cell. Do NOT let the first row take over half the sheet.

TOP LEFT CELL bounds x0-511 y0-511: front-facing full body with crossed arms, entire cap and shoes visible, centered at (256,256), full body from y50 to y460.
TOP MIDDLE CELL bounds x512-1023 y0-511: full-body three-quarter view facing toward the LEFT edge of the sheet, arms at sides, centered at (768,256), cap y50, shoes y460.
TOP RIGHT CELL bounds x1024-1535 y0-511: full-body three-quarter view facing toward the RIGHT edge of the sheet, arms at sides, centered at (1280,256), cap y50, shoes y460.
BOTTOM LEFT CELL bounds x0-511 y512-1023: full-body threatening doorway stance, hands raised, centered at (256,768), cap y565, shoes y970.
BOTTOM MIDDLE CELL bounds x512-1023 y512-1023: chest-up attack anticipation portrait, intense expression, mouth starting to open, hands raised. Entire cap and hands within inner 440x440 safe square centered at (768,768).
BOTTOM RIGHT CELL bounds x1024-1535 y512-1023: chest-up attack portrait, mouth open shouting and hands reaching, cap and hands fully contained within inner 440x440 safe square centered at (1280,768).

Same recognizable face and outfit in every cell. Neutral readable studio lighting with soft rim light. Background is actual transparent alpha, no scene, no backdrop, no gradient, no floor, no shadows. Empty space MUST be transparent. No labels, text, grid lines, watermark, extra people, animal anatomy or robotic features. This is the final usable atlas, not a presentation mockup.
```

