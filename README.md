# The Night Shift

An original browser survival-horror prototype inspired by the camera, door, and power-management loop of Five Nights at Freddy's. University-themed rooms with generated sprite-sheet characters and no runtime dependencies. The campus setting takes visual cues from UCA’s published identity; room geography and the horror scenario are fictional. See `assets/uca/SOURCE.md` for artwork provenance.

## Run

`npm run dev` — open http://localhost:5173

`npm test` — run simulation tests (Node.js 18+).

Survive five four-minute shifts. Night 1 starts unlocked; each win unlocks the next night. The title menu offers New Game (Night 1, keeping your unlocks) and Continue after your first win. After completing two nights, Night select appears for replaying unlocked nights. Losses retry the same night, wins offer the next, and completing Night 5 offers a replay or the main menu. Space toggles cameras; click map buttons to switch rooms. A/D control west/east doors; Q/E toggle hallway lights. Visitors retreat after a few seconds at a closed door. Each active device consumes power. Instructions pause the simulation. Sound is on by default and starts when you begin a shift. Sound and subtitles can be toggled in Settings, available only on the main menu. Subtitles default to off and work independently of sound. During play, LittleCloudCinema’s “Eerie background space sound” loops quietly in place of the synthesized hum, fades out at the end of a shift, and ducks during jumpscares. Attribution is included in the instructions. Walter, Pip and Dot each use a distinct recorded CC0 jumpscare effect, preloaded locally and balanced in loudness. Playback keeps the original pitch and speed and fades out before the loss screen; source and license details are in `assets/audio/SOURCE.md`.

Built with HTML, CSS, and JavaScript modules. All state is local to the browser. Each shift starts with fresh power and character state. The highest unlocked night and five-night completion are saved in this browser; reloading selects the highest unlocked night. If browser storage is unavailable, progression still works for the current session.

Camera rooms: lecture hall, library, teaching lab, west/east corridors, archives, west stairwell, and faculty lobby. CAM 06 (Archives) slows Pip’s buildup.

Character artwork lives in `assets/characters/test/`. `src/characters.js` renders the 3 × 2 atlases for Walter, Pip and Dot in cameras and doorways. Walter’s jumpscare combines two atlas poses with three additional transparent portraits in a five-frame, 1.25-second sequence; Pip and Dot use two attack frames. All jumpscares have a staged lunge. Walter is based on a user-provided portrait; his row spacing and attack order are recorded in `manifest.json`. Angled hallway poses use mirroring; reduced motion shows the final attack frame without the lunge. Exact prompts for the additional artwork are in `assets/characters/test/WALTER-ATTACK.md`.

Gameplay audio uses recorded directional character cues, door/light/CRT effects, occasional quiet creaks and desk rattles, and a relay sound on power failure. Decorative sounds yield to character warnings. Audio resets on mute, restart, and endings. Whistle, door and CRT sources are **CC BY-NC 4.0 (noncommercial)**; see `assets/audio/SOURCE.md` and in-game Instructions for all credits and licenses.

## Night difficulty

`src/game.js` defines five tuning profiles in `NIGHT_CONFIGS`. `createGame(random, night)` defaults to Night 1 and accepts an injectable random function for simulation tests. Walter/Dot movement chances and Pip's charge multiplier interpolate linearly over each 240-second shift.

| Night | Pip / Dot activation (seconds) | Walter / Dot check interval (seconds) | Movement chance, start → end | Pip rate, start → end |
| --- | --- | --- | --- | --- |
| 1 | 55 / 100 | 12 / 10 | 30% → 50% | 0.8× → 1.1× |
| 2 | 42.5 / 80 | 11 / 9 | 35% → 57.5% | 0.9× → 1.25× |
| 3 | 30 / 60 | 10 / 8 | 40% → 65% | 1× → 1.4× |
| 4 | 20 / 42.5 | 9 / 7.5 | 45% → 72.5% | 1.1× → 1.55× |
| 5 | 10 / 25 | 8 / 7 | 50% → 80% | 1.2× → 1.7× |

Walter is active immediately on every night. Monitor acceleration (1.65×), Archives slowdown (22% of normal charge), Pip's 2.5-second dash, attack windows (1.8 seconds for Pip; 5 seconds for Walter/Dot), Dot's flash rules, power costs, and shift length stay consistent. These are initial balance values, pending playtesting. Progress uses the versioned local-storage key `the-night-shift.progress.v1`; missing or invalid saves start at Night 1.

## Title menu

The FNAF 1-inspired composition uses this game's own title and existing Walter portrait: text actions on the left, a dark close-up on the right, and low-resolution TV interference rendered by `src/menu-static.js`. The static runs at most eight updates per second, stops when a shift begins, and stays still when reduced motion is requested. Settings opens upward from the bottom-left and retains sound/subtitle controls. The night selector stays hidden until `unlockedNight >= 3`, which means two nights have been completed. New Game never deletes existing unlocks.
