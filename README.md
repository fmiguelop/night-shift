# The Night Shift

An original browser survival-horror prototype inspired by the camera, door, and power-management loop of Five Nights at Freddy's. University-themed rooms with generated sprite-sheet characters and no runtime dependencies. The campus setting takes visual cues from UCA’s published identity; room geography and the horror scenario are fictional. See `assets/uca/SOURCE.md` for artwork provenance.

## Run

`npm run dev` — open http://localhost:5173

`npm test` — run simulation tests (Node.js 18+).

Survive a four-minute shift. Space toggles cameras; click map buttons to switch rooms. A/D control west/east doors; Q/E toggle hallway lights. Visitors retreat after a few seconds at a closed door. Each active device consumes power. Instructions pause the simulation. Optional synthesized audio can be enabled with the sound button.

Built with HTML, CSS, and JavaScript modules. All state is local to the browser. The default night starts fresh on reload.

Camera rooms: lecture hall, library, teaching lab, west/east corridors, archives, west stairwell, and faculty lobby. CAM 06 (Archives) slows Pip’s buildup.

Character artwork lives in `assets/characters/test/`. `src/characters.js` renders the shared 3 × 2 atlas layout for cameras, doorways and two-frame attacks. Angled hallway poses use mirroring; reduced motion shows the final attack frame without the lunge.
