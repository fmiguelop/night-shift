# The Night Shift

An original browser survival-horror prototype inspired by the camera, door, and power-management loop of Five Nights at Freddy's. University-themed rooms with generated sprite-sheet characters and no runtime dependencies. The campus setting takes visual cues from UCA’s published identity; room geography and the horror scenario are fictional. See `assets/uca/SOURCE.md` for artwork provenance.

## Run

`npm run dev` — open http://localhost:5173

`npm test` — run simulation tests (Node.js 18+).

Survive a four-minute shift. Space toggles cameras; click map buttons to switch rooms. A/D control west/east doors; Q/E toggle hallway lights. Visitors retreat after a few seconds at a closed door. Each active device consumes power. Instructions pause the simulation. Sound is on by default and starts when you begin a shift. Sound and subtitles can be toggled in Settings, available only on the main menu. Subtitles default to off and work independently of sound. During play, LittleCloudCinema’s “Eerie background space sound” loops quietly in place of the synthesized hum, fades out at the end of a shift, and ducks during jumpscares. Attribution is included in the instructions. Walter, Pip and Dot each use a distinct recorded CC0 jumpscare effect, preloaded locally and balanced in loudness. Playback keeps the original pitch and speed and fades out before the loss screen; source and license details are in `assets/audio/SOURCE.md`.

Built with HTML, CSS, and JavaScript modules. All state is local to the browser. The default night starts fresh on reload.

Camera rooms: lecture hall, library, teaching lab, west/east corridors, archives, west stairwell, and faculty lobby. CAM 06 (Archives) slows Pip’s buildup.

Character artwork lives in `assets/characters/test/`. `src/characters.js` renders the 3 × 2 atlases for Walter, Pip and Dot in cameras and doorways. Walter’s jumpscare combines two atlas poses with three additional transparent portraits in a five-frame, 1.25-second sequence; Pip and Dot use two attack frames. All jumpscares have a staged lunge. Walter is based on a user-provided portrait; his row spacing and attack order are recorded in `manifest.json`. Angled hallway poses use mirroring; reduced motion shows the final attack frame without the lunge. Exact prompts for the additional artwork are in `assets/characters/test/WALTER-ATTACK.md`.

Gameplay audio uses recorded directional character cues, door/light/CRT effects, occasional quiet creaks and desk rattles, and a relay sound on power failure. Decorative sounds yield to character warnings. Audio resets on mute, restart, and endings. Whistle, door and CRT sources are **CC BY-NC 4.0 (noncommercial)**; see `assets/audio/SOURCE.md` and in-game Instructions for all credits and licenses.
