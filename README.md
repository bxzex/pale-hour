<div align="center">

# PALE HOUR

**An open-source first-person horror game for the browser.**

Something in these woods only moves when you aren't looking.

[**▸ PLAY IN YOUR BROWSER**](https://bxzex.github.io/pale-hour/) · [Report a bug](https://github.com/bxzex/pale-hour/issues) · MIT licensed

</div>

---

## What it is

An open-world survival game in a forest that is safe in daylight and genuinely not at night. It runs entirely in the browser on WebGL2, and **it ships with no asset files at all**. Every texture is painted to a canvas at load, every model is assembled from primitives in code, and every sound is synthesised with the Web Audio API.

The loop is the one the genre settled on, because it works: gather, craft, build, and get warm before dark.

## The day

You start with nothing. Sticks and loose stone are lying on the ground; berry bushes and mushroom clusters are scattered through the trees; five ponds hold water that will make you ill unless you boil it. From that you make a stone axe, which makes trees worth felling, which makes everything else possible.

| | |
|---|---|
| **Five things can kill you** | Health, food, water, warmth, breath. Meters don't kill you directly. They drain *health*, so an empty meter is a spiral you can still escape rather than an instant loss. |
| **Water is the fastest clock** | Thirst runs out in about nine minutes, hunger in fifteen. You have to triage. |
| **Warmth is the one the world attacks** | Daylight rewarms you, night takes it away, and fire beats both. That is what gives the day/night cycle teeth. |
| **Tools gate progress** | Bare hands strip a tree slowly and cannot touch rock at all. An axe makes wood practical; a pick opens rock and iron ore. |
| **Fire is the centre of gravity** | A campfire is warmth, light, safety and the only cooking station. It also burns fuel, so it is something you keep feeding. |
| **Shelter buys the night** | A lean-to blocks the cold and lets you sleep through to dawn, at the cost of the hunger and thirst those hours would have taken. |

## The night

A full day is about sixteen real minutes, and the cycle is a keyframed grade: sun colour and angle, ambient light, fog, star opacity all move together through dawn, midday, dusk and dead of night.

Night is mostly about cold and dark. But occasionally, in deep night, away from any lit fire, something wakes up. It is rare on purpose: most nights are a resource problem, and the ones that are not are memorable. Reach a fire and it loses interest.

The camcorder grade follows the sun too. Grain, chroma bleed, vignette and desaturation all back off in daylight and return after dusk, so day and night do not just differ in brightness.

## Controls

| Key | Action |
|---|---|
| `W` `A` `S` `D` | Move |
| `Shift` | Sprint (costs breath) |
| `Ctrl` / `C` | Crouch |
| `E` | Harvest · drink · feed a fire · sleep |
| `Tab` / `I` | Pack: inventory and crafting |
| `Q` | Place a campfire or shelter |
| `F` | Flashlight |
| `Esc` | Pause |

Mouse look uses pointer lock. If your browser refuses it, the game falls back to click-and-drag and says so.

## Crafting

| Item | Costs | Notes |
|---|---|---|
| Stone axe | 2 branch, 3 stone, 2 fibre | Makes trees worth felling |
| Stone pick | 2 branch, 4 stone, 2 fibre | Opens rock and iron ore |
| Torch | 1 branch, 2 fibre | Light that is not the failing flashlight |
| Campfire | 3 wood, 4 stone, 2 branch | Warmth, light, cooking |
| Lean-to | 6 wood, 6 branch, 4 fibre | Sleep through to dawn |
| Cooked meat / clean water | raw ingredient | Requires a lit fire |

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
├── story.js             every word of writing: intro, notes, endings
├── core/
│   ├── game.js          scene, loop, state machine, run rules
│   ├── survival.js      health, hunger, thirst, warmth, stamina
│   ├── items.js         items, recipes, inventory
│   ├── input.js         keyboard + pointer lock (with fallback)
│   ├── settings.js      persisted options and difficulty tuning
│   └── rng.js           seeded RNG, value noise, fbm, easing
├── world/
│   ├── textures.js      every texture in the game, drawn to canvas
│   ├── buildings.js     enterable cabins and farmhouse, walls with openings
│   ├── sky.js           stars, the moon and its haze
│   ├── daynight.js      the day/night cycle and its colour grade
│   ├── resources.js     harvestable trees, rock, forage, water
│   ├── placeables.js    campfires and shelters
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
- **The torch is deliberately not physically correct.** A realistic beam clips the near ground to pure white under a fixed exposure and the bloom smears it across the frame. `TORCH_DECAY` is 1.05 rather than 2.0 so falloff stays gentle. Tuning these values is a look-at-it job, not a maths job.
- **Albedo is decoded from sRGB.** A texture value of `40/255` becomes about `0.02` linear, which is nearly black no matter how bright the lights are. The base textures are deliberately lighter than they look.

## Tuning it yourself

Most of the feel lives in two places:

- `src/core/survival.js`: the `RATES` table: how fast every meter drains and how much damage an empty one does. The whole difficulty of the survival layer is one object.
- `src/world/daynight.js`: the `GRADE` table: one row per time of day. Adding a new time of day means adding a row, not touching five systems.
- `src/core/items.js`: `ITEMS` and `RECIPES`. The progression ladder is deliberately short.
- `src/core/settings.js`: the `DIFFICULTIES` table: how many watchers and stalkers, how fast chasers move, when each wakes, spawn distances, reposition interval, how fast static fills and drains, battery drain.
- `src/entities/entity.js`: the four rules the AI is built on are written at the top of the file. Change them and it becomes a different game.

## Contributing

Issues and pull requests are welcome. Good first contributions: new landmark set pieces in `props.js`, new fragment drawings in `textures.js`, or a new difficulty preset.

Keep the constraint: **no binary assets.** If it can't be generated in code, it doesn't go in.

## Credits

Built by [bxzex](https://github.com/bxzex). Engine: [three.js](https://threejs.org) (MIT). Inspired by *Slender: The Eight Pages*, analog horror, and found footage.

## License

MIT, see [LICENSE](LICENSE). Fork it, reskin it, make it scarier.
