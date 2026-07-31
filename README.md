<div align="center">

# PALE HOUR

**An open-source first-person horror game for the browser.**

Eight fragments. One forest. Something is already counting.

[**▸ PLAY IN YOUR BROWSER**](https://bxzex.github.io/pale-hour/) · [Report a bug](https://github.com/bxzex/pale-hour/issues) · MIT licensed

</div>

---

## What it is

A found-footage horror game in the lineage of *Slender: The Eight Pages* — first person, one forest, eight pages to collect, and a tall pale thing that does not move while you are looking at it.

It runs entirely in the browser on WebGL2, and **it ships with no asset files at all**. Every texture is painted to a canvas at load, every model is assembled from primitives in code, and every sound is synthesised with the Web Audio API. The whole game is the source.

## What makes it more than a Slender clone

| | |
|---|---|
| **The static is the health bar** | Looking at it fills the frame with tape noise. A glance is cheap; a stare is fatal. Break line of sight and it drains back down. |
| **It freezes when watched** | It never advances while in view. That makes *you* the one who has to break the stalemate — and turning away is always the hard choice. |
| **It repositions where you'd have missed it** | Every move requires line of sight from the destination and a minimum distance, and it prefers to land *behind* you. It never pops in at arm's length. |
| **The world tightens as you collect** | Fog thickens, moonlight dies, and its patience shortens with every page. Eight is not a countdown to safety. |
| **Buildings you go inside** | Four log cabins and a two-room farmhouse, with real doorways and windows cut out of both the geometry and the collision. Interiors have stoves, bunks, tables and shelving, and their walls genuinely block line of sight — a cabin is the best place to break a stare, and also a box with one door. |
| **Two kinds of hunter** | *Watchers* freeze while you look at them and kill you with static. *Stalkers* do not care where you are looking — they simply walk at you and kill on contact. Stalkers wake one at a time as you collect, so the run starts as a search and ends as a chase. They are slower than a sprint on purpose: always escapable, always exhausting. |
| **There is an exit** | After the eighth fragment the gate at the treeline lights up and you have to actually reach it. The run ends in a chase, not a fade-out. |
| **Resources that matter** | A torch battery that visibly dies, and breath that limits sprinting. Killing the light hides you — and hides the pages too. |
| **A real camcorder lens** | Barrel distortion, chroma bleed, tracking slip, dropout lines, interlace shimmer and a static storm, all in one shader pass. |
| **A world that moves** | 26,000 wind-animated grass tufts, swaying canopies and undergrowth on a shared gust front, dust motes drifting through the torch beam, 2,600 twinkling stars and a cratered moon. |
| **Sound that tracks your body** | Breathing that speeds up and turns ragged as you burn through stamina, a two-transient flashlight click, footsteps timed by distance travelled, a dread-driven score that adds voices as it builds, and the entity's own inharmonic vocalisations. |

## Controls

| Key | Action |
|---|---|
| `W` `A` `S` `D` | Move |
| `Shift` | Sprint — costs breath, and it hears you |
| `Ctrl` / `C` | Crouch — slow, quiet, small |
| `F` | Toggle flashlight |
| `E` / `Space` | Take fragment |
| `Esc` | Pause |

Mouse look uses pointer lock. If your browser refuses pointer lock, the game falls back to click-and-drag looking and tells you so.

## Difficulty

Four settings, tuned on how much rope you get rather than how much damage you take — there is no health bar, only static.

- **WANDER** — patient. For learning the forest and reading every note.
- **DREAD** — the intended tape.
- **STATIC** — it is rarely more than a treeline away.
- **PALE HOUR** — most runs end before the third fragment.

## Seeds

Every forest is generated from a single integer seed: terrain, tree placement, every landmark, and where the eight fragments are nailed up. Enter a seed in Options and share it — anyone who enters the same seed walks an identical forest. Leave it blank for a new one each run.

## Running it locally

```bash
git clone https://github.com/bxzex/pale-hour.git
cd pale-hour
npm install
npm run dev
```

Then open the URL Vite prints. To build a static bundle:

```bash
npm run build     # → dist/
npm run preview
```

If you fork this under a different repository name, set the base path so GitHub Pages resolves assets correctly:

```bash
BASE_PATH=/your-repo-name/ npm run build
```

## Deploying

The live build is published from the `gh-pages` branch. To update it:

```bash
BASE_PATH=/pale-hour/ npm run build
npx gh-pages -d dist        # or push dist/ to the gh-pages branch by hand
```

GitHub Pages is set to serve `gh-pages` at the repository root.

## How it is put together

```
src/
├── main.js              entry point, wires everything together
├── core/
│   ├── game.js          scene, loop, state machine, run rules
│   ├── input.js         keyboard + pointer lock (with fallback)
│   ├── settings.js      persisted options and difficulty tuning
│   └── rng.js           seeded RNG, value noise, fbm, easing
├── world/
│   ├── textures.js      every texture in the game, drawn to canvas
│   ├── buildings.js     enterable cabins and farmhouse, walls with openings
│   ├── sky.js           stars, the moon and its haze
│   ├── grass.js         instanced grass tufts and drifting motes
│   ├── wind.js          one shared wind, patched into any material
│   ├── terrain.js       heightfield + the shared height function
│   ├── forest.js        instanced trees, collision, line of sight
│   └── props.js         chapel, silo, walls, truck, graves, fences
├── entities/
│   ├── player.js        movement, breath, torch, head bob
│   ├── entity.js        the model and the hunting AI
│   └── fragments.js     the eight pages and their placement
├── render/postfx.js     the VHS lens (bloom + custom shader pass)
├── audio/audio.js       synthesised wind, drone, heartbeat, scream
└── ui/                  menus, HUD, styles
```

Two notes for anyone reading the code:

- **Light intensities are in candela.** three.js has used physical light units since r155, so punctual lights need roughly 4π times the pre-r155 numbers. See `TORCH_CORE` in `player.js`.
- **Albedo is decoded from sRGB.** A texture value of `40/255` becomes about `0.02` linear — nearly black no matter how bright the lights are. The base textures are deliberately lighter than they look.

## Tuning it yourself

Most of the feel lives in two places:

- `src/core/settings.js` — the `DIFFICULTIES` table: how many watchers and stalkers, how fast chasers move, when each wakes, spawn distances, reposition interval, how fast static fills and drains, battery drain.
- `src/entities/entity.js` — the four rules the AI is built on are written at the top of the file. Change them and it becomes a different game.

## Contributing

Issues and pull requests are welcome. Good first contributions: new landmark set pieces in `props.js`, new fragment drawings in `textures.js`, or a new difficulty preset.

Keep the constraint: **no binary assets.** If it can't be generated in code, it doesn't go in.

## Credits

Built by [bxzex](https://github.com/bxzex). Engine: [three.js](https://threejs.org) (MIT). Inspired by *Slender: The Eight Pages*, analog horror, and found footage.

## License

MIT — see [LICENSE](LICENSE). Fork it, reskin it, make it scarier.
