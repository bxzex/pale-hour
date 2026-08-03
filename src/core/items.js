/**
 * Items, recipes and the inventory.
 *
 * The progression is the classic survival ladder, kept deliberately short so
 * every rung is reachable in one session:
 *
 *   bare hands → gather branches + stone
 *   → stone axe    (trees give real wood)
 *   → stone pick   (rock gives ore)
 *   → campfire     (warmth, light, cooking, safety)
 *   → torch        (portable light that is not the failing flashlight)
 *   → shelter      (sleep through the night)
 *
 * Every recipe costs something you had to walk somewhere to get.
 */

export const ITEMS = {
  branch:   { name: 'BRANCH',      stack: 40, tag: 'material', desc: 'Dry deadfall. Burns fast.' },
  wood:     { name: 'WOOD',        stack: 40, tag: 'material', desc: 'Split logs. The backbone of everything.' },
  stone:    { name: 'STONE',       stack: 40, tag: 'material', desc: 'Rough flint. Sharp enough to matter.' },
  fibre:    { name: 'FIBRE',       stack: 60, tag: 'material', desc: 'Stripped bark cordage.' },
  ore:      { name: 'IRON ORE',    stack: 20, tag: 'material', desc: 'Heavy, rust-red, worth the arm ache.' },
  berries:  { name: 'BERRIES',     stack: 20, tag: 'food', food: 0.18, thirst: 0.06, desc: 'Tart. Barely food, but food.' },
  mushroom: { name: 'MUSHROOM',    stack: 20, tag: 'food', food: 0.12, desc: 'Probably fine. Probably.' },
  meat_raw: { name: 'RAW MEAT',    stack: 10, tag: 'food', food: 0.15, health: -0.08, desc: 'Eating this raw is a decision.' },
  meat:     { name: 'COOKED MEAT', stack: 10, tag: 'food', food: 0.52, desc: 'Hot, and worth the fire it took.' },
  water:    { name: 'WATER',       stack: 5,  tag: 'food', thirst: 0.55, desc: 'Cold enough to hurt your teeth.' },

  axe:      { name: 'STONE AXE',   stack: 1, tag: 'tool', tool: 'axe',  power: 1, desc: 'Fells trees. Slowly.' },
  pick:     { name: 'STONE PICK',  stack: 1, tag: 'tool', tool: 'pick', power: 1, desc: 'Breaks rock into something useful.' },
  torch:    { name: 'TORCH',       stack: 1, tag: 'tool', tool: 'torch', desc: 'Burns for a while. Warms a little. Shows a lot.' },

  campfire: { name: 'CAMPFIRE',    stack: 5, tag: 'place', place: 'campfire', desc: 'Warmth, light, and a place to cook.' },
  shelter:  { name: 'LEAN-TO',     stack: 3, tag: 'place', place: 'shelter', desc: 'Blocks the wind. Lets you sleep to dawn.' },
};

/**
 * `at` is the station required: null = anywhere, 'campfire' = must be beside a
 * lit fire. Keeping cooking fire-only is what gives the campfire its pull.
 */
export const RECIPES = [
  { id: 'axe',      out: { axe: 1 },      in: { branch: 2, stone: 3, fibre: 2 }, at: null,
    blurb: 'Lash a split stone to a straight branch.' },
  { id: 'pick',     out: { pick: 1 },     in: { branch: 2, stone: 4, fibre: 2 }, at: null,
    blurb: 'Heavier, blunter, for rock.' },
  { id: 'torch',    out: { torch: 1 },    in: { branch: 1, fibre: 2 },           at: null,
    blurb: 'Bark wrapped tight and soaked in pitch.' },
  { id: 'campfire', out: { campfire: 1 }, in: { wood: 3, stone: 4, branch: 2 },  at: null,
    blurb: 'A ring of stones and everything dry you own.' },
  { id: 'shelter',  out: { shelter: 1 },  in: { wood: 6, branch: 6, fibre: 4 },  at: null,
    blurb: 'Enough roof to be on the right side of.' },
  { id: 'meat',     out: { meat: 1 },     in: { meat_raw: 1 },                   at: 'campfire',
    blurb: 'Cook it before it decides for you.' },
  { id: 'water',    out: { water: 1 },    in: { water_dirty: 1 },                at: 'campfire',
    blurb: 'Boiling is not optional.' },
];

// The dirty-water input is produced by drinking sources, declared after RECIPES
// so the table above stays readable.
ITEMS.water_dirty = {
  name: 'MURKY WATER', stack: 5, tag: 'food', thirst: 0.3, health: -0.1,
  desc: 'Drinkable. Ill-advised. Boil it.',
};

export class Inventory {
  constructor(slots = 20) {
    this.slots = slots;
    /** @type {Map<string, number>} */
    this.items = new Map();
    this.onChange = null;
  }

  clear() {
    this.items.clear();
    this.onChange?.();
  }

  count(id) { return this.items.get(id) ?? 0; }

  /** @returns {number} how many were actually added (stack limits apply). */
  add(id, n = 1) {
    const def = ITEMS[id];
    if (!def) return 0;
    const have = this.count(id);
    // A new item type needs a free slot; topping up an existing one does not.
    if (have === 0 && this.items.size >= this.slots) return 0;
    const room = def.stack - have;
    const added = Math.max(0, Math.min(n, room));
    if (added > 0) {
      this.items.set(id, have + added);
      this.onChange?.();
    }
    return added;
  }

  remove(id, n = 1) {
    const have = this.count(id);
    if (have < n) return false;
    if (have === n) this.items.delete(id);
    else this.items.set(id, have - n);
    this.onChange?.();
    return true;
  }

  has(cost) {
    return Object.entries(cost).every(([id, n]) => this.count(id) >= n);
  }

  /** Does the player hold a working tool of this kind? */
  tool(kind) {
    for (const [id, n] of this.items) {
      if (n > 0 && ITEMS[id]?.tool === kind) return id;
    }
    return null;
  }

  /** @returns {boolean} whether the craft happened. */
  craft(recipe) {
    if (!this.has(recipe.in)) return false;
    for (const [id, n] of Object.entries(recipe.in)) this.remove(id, n);
    for (const [id, n] of Object.entries(recipe.out)) this.add(id, n);
    return true;
  }

  /** Sorted for display: tools, then placeables, then food, then materials. */
  get sorted() {
    const order = { tool: 0, place: 1, food: 2, material: 3 };
    return [...this.items.entries()]
      .map(([id, n]) => ({ id, n, def: ITEMS[id] }))
      .filter((e) => e.def)
      .sort((a, b) =>
        (order[a.def.tag] ?? 9) - (order[b.def.tag] ?? 9) ||
        a.def.name.localeCompare(b.def.name));
  }

  get used() { return this.items.size; }
}
