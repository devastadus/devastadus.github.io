/* Shared game-style talent grid + hover tooltip.
   Used by the arsenal armory and the hangar ship-ability panel.
   Slots chain in two rows read left→right: A1→A2→A3, B1→B2→B3
   (matches the game's WeaponInventory chains 0→1→2 and 3→4→5). */
(() => {
  function slotCode(i) { return (i < 3 ? 'A' : 'B') + ((i % 3) + 1); }

  // gridEl: container for the 6 nodes; tipEl: .talent-tip inside a
  // position:relative ancestor the tooltip is clamped to.
  // opts.detail: full armory layout — chain headers, node captions, legend.
  window.createTalentGrid = function (gridEl, tipEl, opts) {
    const detail = !!(opts && opts.detail);
    let weapon = null;

    function hideTip() {
      tipEl.classList.remove('show');
      tipEl.setAttribute('aria-hidden', 'true');
      gridEl.querySelectorAll('.talent-node').forEach(n => n.classList.remove('sel'));
    }

    function showTip(node, i) {
      const t = weapon.talents[i];
      gridEl.querySelectorAll('.talent-node').forEach(n => n.classList.remove('sel'));
      node.classList.add('sel');
      const status = t.locked ? `Requires ${slotCode(i - 1)}` : 'Open';
      tipEl.innerHTML =
        `<h5>${t.name}</h5>` +
        `<div class="tt-body"><img src="${t.icon}" alt="">` +
        `<div class="tt-rows">` +
        `<div class="tt-row"><span>Slot</span><b>${slotCode(i)}</b></div>` +
        `<div class="tt-row"><span>Status</span><b${t.locked ? ' class="lock-val"' : ''}>${status}</b></div>` +
        `</div></div>` +
        `<p class="tt-desc">${t.desc}</p>`;
      tipEl.setAttribute('aria-hidden', 'false');
      tipEl.classList.add('show');
      // position above the node, clamped to the panel; flip below if no room
      const panel = tipEl.parentElement;
      const panelRect = panel.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const tipW = tipEl.offsetWidth, tipH = tipEl.offsetHeight;
      let left = nodeRect.left - panelRect.left + nodeRect.width / 2 - tipW / 2;
      left = Math.max(-6, Math.min(left, panelRect.width - tipW + 6));
      let top = nodeRect.top - panelRect.top - tipH - 14;
      if (top < -30) top = nodeRect.bottom - panelRect.top + 14;
      tipEl.style.left = `${left}px`;
      tipEl.style.top = `${top}px`;
    }

    function makeNode(t, i) {
      const slot = document.createElement('div');
      slot.className = 'node-slot';
      const node = document.createElement('button');
      node.className = 'talent-node' + (t.locked ? ' locked' : '');
      node.type = 'button';
      node.setAttribute('aria-label', `Talent ${slotCode(i)}: ${t.name}. ` +
        (t.locked ? `Locked, requires ${slotCode(i - 1)}. ` : '') + t.desc);
      node.innerHTML = `<img src="${t.icon}" alt="">`;
      node.addEventListener('mouseenter', () => showTip(node, i));
      node.addEventListener('mouseleave', hideTip);
      node.addEventListener('focus', () => showTip(node, i));
      node.addEventListener('blur', hideTip);
      node.addEventListener('click', e => {         // tap support (touch has no hover)
        e.stopPropagation();
        if (node.classList.contains('sel')) hideTip();
        else showTip(node, i);
      });
      slot.appendChild(node);
      if (detail) {
        const cap = document.createElement('span');
        cap.className = 'node-cap';
        cap.innerHTML = `<b>${slotCode(i)}</b><em>${t.name}</em>` +
          (t.locked ? `<span class="req">Locked<i>needs ${slotCode(i - 1)}</i></span>` : '');
        cap.setAttribute('aria-hidden', 'true');
        slot.appendChild(cap);
      }
      return slot;
    }

    // one chain = 3 slots read left→right, joined by link segments that carry
    // the lock state of the node they feed into.
    function makeChain(talents, offset) {
      const chain = document.createElement('div');
      chain.className = 'chain';
      if (detail) {
        const head = document.createElement('div');
        head.className = 'chain-head';
        head.innerHTML = `<span>Chain ${offset ? 'B' : 'A'}</span><i></i>` +
          `<span class="chain-count">${talents.length} nodes</span>`;
        chain.appendChild(head);
      }
      const row = document.createElement('div');
      row.className = 'chain-row';
      talents.forEach((t, j) => {
        if (j) {
          const link = document.createElement('span');
          link.className = 'chain-link' + (t.locked ? ' locked' : '');
          row.appendChild(link);
        }
        row.appendChild(makeNode(t, offset + j));
      });
      chain.appendChild(row);
      return chain;
    }

    function render(w) {
      weapon = w;
      hideTip();
      gridEl.innerHTML = '';
      if (!w || !w.talents.length) {
        gridEl.innerHTML = '<div class="tree-empty">Talent matrix syncing…<br>data classified until launch</div>';
        return;
      }
      const talents = w.talents.slice(0, 6);
      gridEl.appendChild(makeChain(talents.slice(0, 3), 0));
      if (talents.length > 3) gridEl.appendChild(makeChain(talents.slice(3), 3));
      if (detail) {
        const legend = document.createElement('div');
        legend.className = 'tree-legend';
        legend.innerHTML =
          '<span class="lg"><i></i>Unlocked</span>' +
          '<span class="lg"><i class="lk"></i>Needs previous node</span>' +
          `<span class="lg-count">${talents.length} nodes // ${talents.length > 3 ? 2 : 1} chains</span>`;
        gridEl.appendChild(legend);
      }
    }

    return { render, hideTip };
  };

  document.addEventListener('click', e => {
    if (!e.target.closest('.talent-node'))
      document.querySelectorAll('.talent-tip.show').forEach(t => {
        t.classList.remove('show');
        t.setAttribute('aria-hidden', 'true');
      });
  });
})();
