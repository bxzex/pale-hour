/**
 * The pack: inventory and crafting.
 *
 * Opening it does not pause the world — a survival game where you can safely
 * stop time to think is a survival game with no tension. Crafting takes the
 * seconds it takes, and things can walk up to you while you do it.
 */

import { ITEMS, RECIPES } from '../core/items.js';

const $ = (id) => document.getElementById(id);

export class Pack {
  /**
   * @param {import('../core/items.js').Inventory} inventory
   * @param {object} handlers
   * @param {(recipe:object)=>void} handlers.onCraft
   * @param {(id:string)=>void} handlers.onUse
   * @param {()=>boolean} handlers.nearFire
   */
  constructor(inventory, handlers) {
    this.inv = inventory;
    this.h = handlers;
    this.el = $('pack');
    this.itemsEl = $('pack-items');
    this.recipesEl = $('pack-recipes');
    this.slotsEl = $('pack-slots');

    this.itemsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-use]');
      if (btn) this.h.onUse?.(btn.dataset.use);
    });
    this.recipesEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-recipe]');
      if (!btn || !btn.classList.contains('can')) return;
      const recipe = RECIPES.find((r) => r.id === btn.dataset.recipe);
      if (recipe) this.h.onCraft?.(recipe);
    });
  }

  get open() { return !this.el.hidden; }

  toggle() { this.open ? this.close() : this.show(); }

  show() {
    this.el.hidden = false;
    this.render();
  }

  close() { this.el.hidden = true; }

  render() {
    if (!this.open) return;
    const atFire = this.h.nearFire?.() ?? false;

    this.slotsEl.textContent = `${this.inv.used} / ${this.inv.slots} SLOTS`;

    // ── carrying
    const rows = this.inv.sorted;
    this.itemsEl.innerHTML = rows.length
      ? rows.map(({ id, n, def }) => {
        const usable = def.tag === 'food';
        const useLabel = usable ? '<span class="slot__use">CLICK TO CONSUME</span>' : '';
        return `<div class="slot ${usable ? 'slot--use' : ''}" ${usable ? `data-use="${id}"` : ''}>
            <span class="slot__n">${n}</span>
            <div class="slot__name">${def.name}</div>
            <div class="slot__desc">${def.desc}</div>
            ${useLabel}
          </div>`;
      }).join('')
      : '<p class="pack__empty">Nothing but the clothes you came in.<br />Pick up branches and stone — press <b>[E]</b> at a tree, a rock, or a bush.</p>';

    // ── recipes
    this.recipesEl.innerHTML = RECIPES.map((r) => {
      const can = this.inv.has(r.in) && (!r.at || atFire);
      const outName = ITEMS[Object.keys(r.out)[0]]?.name ?? r.id;
      const cost = Object.entries(r.in).map(([id, n]) => {
        const have = this.inv.count(id);
        const short = have < n ? 'short' : '';
        return `<span class="${short}">${ITEMS[id]?.name ?? id} ${have}/${n}</span>`;
      }).join('');
      const gate = r.at && !atFire ? '<span class="recipe__at">NEEDS A FIRE</span>' : '';
      return `<button class="recipe ${can ? 'can' : ''}" data-recipe="${r.id}" type="button">
          <div class="recipe__top"><span class="recipe__name">${outName}</span>${gate}</div>
          <div class="recipe__blurb">${r.blurb}</div>
          <div class="recipe__cost">${cost}</div>
        </button>`;
    }).join('');
  }
}
