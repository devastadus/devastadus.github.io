/* Arsenal — interactive weapon armory.
   Data comes from js/weapons-data.js (window.WEAPONS), extracted from the game's
   ScriptableObjects. Talent slots chain in two branches: 0→1→2 and 3→4→5. */
(() => {
  const weapons = (window.WEAPONS || []).filter(w => w.icon && !w.ability);
  if (!weapons.length) return;

  const RARITY_COLOR = {
    0: 'var(--c-common)', 1: 'var(--c-uncommon)', 2: 'var(--c-rare)',
    3: 'var(--c-epic)', 4: 'var(--c-legendary)', 5: 'var(--c-mythical)',
  };

  /* Stat rows mirror the in-game weapon tooltip (WeaponScriptableObject.ShowTooltip):
     area damage folds into Hull/Shield, projectile speed and duration aren't shown, and the
     firing stat depends on the weapon — automatics get Fire Rate, everything else Recharge.
     Bar fills use the game's own reference maxes so bar lengths match the card in-game. */
  const BAR_MAX = { hull: 40, shield: 40, energy: 40, fireRate: 12, cooldown: 6, charges: 6, recharge: 6 };

  // Matches UITooltipAdvanced.FormatNumber: whole numbers plain, otherwise up to 2 decimals.
  function fmt(v) {
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
  }

  function statRows(w) {
    const s = w.stats || {};
    const rows = [];
    const hull = (s.physicalDamage || 0) + (s.physicalAreaDamage || 0);
    const shield = (s.shieldDamage || 0) + (s.shieldAreaDamage || 0);
    const cooldown = s.cooldown || 0;
    const charged = (s.maxCharges || 0) > 0;

    if (hull) rows.push({ label: 'Hull Damage', value: hull, max: BAR_MAX.hull, cls: 'red' });
    if (shield) rows.push({ label: 'Shield Damage', value: shield, max: BAR_MAX.shield, cls: 'blue' });
    if (s.energyCost) rows.push({ label: 'Energy Cost', value: s.energyCost, max: BAR_MAX.energy, cls: 'green' });
    // Charged automatics skip Charges in-game — the HUD already shows the ammo count.
    if (charged && !w.auto) rows.push({ label: 'Charges', value: s.maxCharges, max: BAR_MAX.charges, cls: 'violet' });

    if (cooldown > 0) {
      if (w.auto) {
        rows.push({ label: 'Fire Rate', value: Math.round(10 / cooldown) / 10, unit: '/s',
          max: BAR_MAX.fireRate, cls: 'teal' });
      } else if (charged && !(s.chargeCooldown > 0)) {
        rows.push({ label: 'Fire Delay', value: cooldown, max: BAR_MAX.cooldown, cls: 'indigo' });
      }
    }
    // Recharge — the "ready again" timer cooldown gear modifies: per-charge refill when charged,
    // otherwise the plain cooldown. Automatics show Fire Rate instead.
    const recharge = charged ? (s.chargeCooldown || 0) : (w.auto ? 0 : cooldown);
    if (recharge > 0) rows.push({ label: 'Recharge', value: recharge, max: BAR_MAX.recharge, cls: 'peri' });

    return rows;
  }

  const grid = document.getElementById('weapon-grid');
  const iconEl = document.getElementById('armory-icon');
  const nameEl = document.getElementById('armory-name');
  const tagsEl = document.getElementById('armory-tags');
  const descEl = document.getElementById('armory-desc');
  const statsEl = document.getElementById('armory-stats');
  const treeTitleEl = document.getElementById('tree-title');
  const armoryEl = document.getElementById('armory');
  if (!grid || !armoryEl) return;
  const talentGrid = window.createTalentGrid(
    document.getElementById('tree-grid'), document.getElementById('talent-tip'), { detail: true });

  let current = -1;

  // --- weapon grid ---
  weapons.forEach((w, i) => {
    const b = document.createElement('button');
    b.className = 'weapon-tile';
    b.type = 'button';
    b.style.setProperty('--rc', RARITY_COLOR[w.rarityTier] || 'var(--line)');
    b.setAttribute('aria-label', `${w.name} — ${w.rarity}. Show stats and talent tree.`);
    b.innerHTML = `<img class="pixel" src="${w.icon}" alt=""><span>${w.name}</span>`;
    b.addEventListener('click', () => select(i));
    grid.appendChild(b);
  });

  function select(i) {
    if (i === current) return;
    current = i;
    const w = weapons[i];
    [...grid.children].forEach((el, j) => el.classList.toggle('active', j === i));
    armoryEl.style.setProperty('--rc', RARITY_COLOR[w.rarityTier] || 'var(--line)');

    iconEl.src = w.icon;
    iconEl.alt = `${w.name} icon`;
    nameEl.textContent = w.name.toUpperCase();
    descEl.textContent = w.desc || '';

    // tags: rarity + damage type (the game's itemType) + firing traits
    const tags = [`<span class="wtag rarity">${w.rarity}</span>`];
    if (w.type) tags.push(`<span class="wtag dmg ${w.type.toLowerCase()}">${w.type}</span>`);
    if (w.passive) tags.push('<span class="wtag">Passive</span>');
    else tags.push(`<span class="wtag">${w.auto ? 'Automatic' : 'Precision'}</span>`);
    if (w.front && w.rear) tags.push('<span class="wtag">Front + Rear Mount</span>');
    else if (w.rear) tags.push('<span class="wtag">Rear Mount</span>');
    tagsEl.innerHTML = tags.join('');

    renderStats(w);
    treeTitleEl.textContent = w.name.toUpperCase();
    talentGrid.render(w);
  }

  function renderStats(w) {
    statsEl.innerHTML = '';
    for (const row of statRows(w)) {
      const div = document.createElement('div');
      div.className = 'stat';
      div.innerHTML = `<label><span>${row.label}</span><b>${fmt(row.value)}${row.unit || ''}</b></label>` +
        `<div class="bar ${row.cls}"><i></i></div>`;
      statsEl.appendChild(div);
      const fill = div.querySelector('i');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        fill.style.transform = `scaleX(${Math.min(row.value / row.max, 1)})`;
      }));
    }
  }

  select(0);
})();
