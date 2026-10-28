# Test character sheets

Generated with the built-in image_gen tool. Each PNG is 1536 × 1024 with six poses and an alpha channel. Pip and Dot use 512 × 512 cells; Walter uses 512 × 560 top-row frames and 512 × 464 bottom-row frames. These assets are integrated into camera sightings, doorways and jumpscares through src/characters.js.

Frame order: idle, angle A, angle B, doorway, attack anticipation, attack. Pip and Dot have similar-facing angled variants; Walter has opposing angled views. Full-body baselines and close-up framing need per-pose tuning. See manifest.json for source rectangles.

## walter

Walter is a human character based on the user-provided portrait, with a black cap, short beard, black shirt, dark trousers, black shoes, and a smartwatch. He replaces the former west-hall character. The sheet was generated with the built-in image_gen tool using the portrait as the likeness reference.

The selected sheet has a clear gap between rows at y=560. Source rectangles in manifest.json and proportional sizing in src/characters.js prevent shoe clipping and neighboring-pose bleed. The attack combines the two lower-right portraits with three additional transparent images. See [WALTER-ATTACK.md](WALTER-ATTACK.md) for the five-frame sequence and exact additional prompts.

See [WALTER.md](WALTER.md) for the exact generation prompt used for the selected asset.

## pip

Use case: stylized-concept
Asset type: transparent game character sprite sheet for a university security survival horror prototype.
Primary request: Pip, a lanky worn slate gray mechanical rabbit with long upright ears, narrow muzzle, small dark bow tie, dull ivory eyes and exposed joints. Original character, eerie grounded stylized 3D render, textured aged fabric and metal, readable silhouette, no gore.
Composition: EXACTLY 3 columns by 2 rows of equal square cells, 1536 x 1024 total sheet, each cell 512 x 512. No gutters or drawn grid. Exactly six separate poses of the SAME consistent character. Top row left to right: front idle full body; three-quarter facing viewer's left full body; three-quarter facing viewer's right full body. Bottom row left to right: threatening doorway stance full body with hands slightly raised; attack anticipation upper-body portrait mouth beginning to open; attack upper-body portrait mouth wide open and arms reaching. Full-body poses have feet on same baseline at 94% of each cell and head inside cell with padding. Each pose centered inside its own cell. Nothing crosses cell boundaries. Portraits fully contained in cell.
Lighting: dim neutral studio lighting with enough detail to read against dark backgrounds, subtle rim light.
Background: actual transparent alpha everywhere outside characters, no backdrop, no floor, no cast shadow.
Constraints: no text, no labels, no borders, no watermark, no props, no extra characters. Maintain identical anatomy, colors and materials across all six cells.

## dot

Use case: stylized-concept
Asset type: transparent game character sprite sheet for a university security survival horror prototype.
Primary request: Dot, a worn mustard olive mechanical bird with a short beak, three small head feathers, dull ivory eyes, broad feet and exposed joints. Original character, eerie grounded stylized 3D render, textured aged fabric and metal, readable silhouette, no gore.
Composition: EXACTLY 3 columns by 2 rows of equal square cells, 1536 x 1024 total sheet, each cell 512 x 512. No gutters or drawn grid. Exactly six separate poses of the SAME consistent character. Top row left to right: front idle full body; three-quarter facing viewer's left full body; three-quarter facing viewer's right full body. Bottom row left to right: threatening doorway stance full body with hands slightly raised; attack anticipation upper-body portrait mouth beginning to open; attack upper-body portrait mouth wide open and arms reaching. Full-body poses have feet on same baseline at 94% of each cell and head inside cell with padding. Each pose centered inside its own cell. Nothing crosses cell boundaries. Portraits fully contained in cell.
Lighting: dim neutral studio lighting with enough detail to read against dark backgrounds, subtle rim light.
Background: actual transparent alpha everywhere outside characters, no backdrop, no floor, no cast shadow.
Constraints: no text, no labels, no borders, no watermark, no props, no extra characters. Maintain identical anatomy, colors and materials across all six cells.

