# The Night Shift

An original browser survival-horror prototype inspired by the camera, door, and power-management loop of Five Nights at Freddy's. Generic CSS-drawn characters; no game assets or dependencies.

## Run

`npm run dev` — open http://localhost:5173

`npm test` — run simulation tests (Node.js 18+).

Survive a four-minute shift. Space toggles cameras; click map buttons to switch rooms. A/D control west/east doors; Q/E toggle hallway lights. Visitors retreat after a few seconds at a closed door. Each active device consumes power. Instructions pause the simulation. Optional synthesized audio can be enabled with the sound button.

Built with HTML, CSS, and JavaScript modules. All state is local to the browser. The default night starts fresh on reload.
