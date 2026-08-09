/* Sector star map — a port of the game's StarMapGenerator: a floors×lanes grid,
   several routes walked bottom-to-top with -1/0/+1 lane steps, weighted node
   types (Pirates 1.0 / Elite 0.4), a Trading Post row forced at the midpoint,
   Home Station below and the Pirate Base above. The player plots jumps along
   connected edges, exactly like in-game. */
(function () {
  const view = document.getElementById('map-view');
  if (!view) return;
  const svg = document.getElementById('map-svg');
  const shipEl = document.getElementById('map-ship');
  const shipImg = shipEl.querySelector('img');
  const tip = document.getElementById('map-tip');
  const seedEl = document.getElementById('map-seed');
  const statusEl = document.getElementById('map-status');
  const rerollBtn = document.getElementById('map-reroll');
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Same tuning as StarMapConfig.asset
  const FLOORS = 5, LANES = 7, ACTIVE = 4;
  const NODE = 80, BIG = 160, GAP = 40;
  const SHOP_FLOOR = 2;              // fixedFloors: floor 3, 1-based
  const ELITE_W = 0.4, ENEMY_W = 1;  // weightedNodes chances

  const KINDS = {
    start: { name: 'HOME STATION', blurb: 'Launch point — the run starts here', icon: 'assets/map/node-start.png' },
    enemy: { name: 'PIRATES', blurb: 'Pirate ambush — fight for salvage', icon: 'assets/map/node-enemy.png' },
    elite: { name: 'ELITE PIRATES', blurb: 'Veteran squadron — high risk, rich loot', icon: 'assets/map/node-elite.png' },
    shop:  { name: 'TRADING POST', blurb: 'Spend salvage, refit your ship', icon: 'assets/map/node-shop.png' },
    boss:  { name: 'PIRATE BASE', blurb: "Captain Powder-Keg's fortress — endgame", icon: 'assets/map/node-boss.png' },
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function generate(seed) {
    const rng = mulberry32(seed);
    const range = (mn, mx) => mn + rng() * (mx - mn);
    const edges = [];
    const link = (a, b) => {
      if (a.next.includes(b)) return;
      a.next.push(b); b.prev.push(a); edges.push([a, b]);
    };

    const xSpan = GAP + NODE, xOff = xSpan * (LANES - 1) / 2;
    const y0 = BIG / 2 + GAP + NODE / 2, step = GAP + NODE;
    const grid = [];
    for (let f = 0; f < FLOORS; f++) {
      grid[f] = [];
      for (let l = 0; l < LANES; l++) {
        grid[f][l] = {
          f, l, kind: 'enemy', big: false, connected: false, visited: false, next: [], prev: [],
          x: xSpan * l - xOff + range(-GAP, GAP) * 0.45,
          y: y0 + step * f + range(-GAP, GAP) * 0.45,
        };
      }
    }
    const start = { f: -1, l: 0, kind: 'start', big: true, connected: true, visited: true, next: [], prev: [], x: 0, y: 0 };
    const final = {
      f: FLOORS, l: 0, kind: 'boss', big: true, connected: true, visited: false, next: [], prev: [],
      x: 0, y: y0 + step * (FLOORS - 1) + NODE / 2 + GAP + BIG / 2,
    };

    // Pick which first-floor lanes carry routes, then walk each one up.
    const firstFloor = grid[0].slice();
    for (let i = LANES - ACTIVE; i > 0; i--) firstFloor.splice(Math.floor(rng() * firstFloor.length), 1);
    function walkUp(n) {
      n.connected = true;
      if (n.f === 0) link(start, n);
      if (n.f >= FLOORS - 1) { link(n, final); return; }
      let dir = Math.floor(rng() * 3) - 1;
      if (n.l === 0 && dir === -1) dir = 0;
      if (n.l === LANES - 1 && dir === 1) dir = 0;
      const nx = grid[n.f + 1][n.l + dir];
      link(n, nx);
      walkUp(nx);
    }
    firstFloor.forEach(walkUp);

    // Node types: forced shop row, otherwise weighted enemy/elite.
    const nodes = [start, final];
    for (const row of grid) for (const n of row) {
      if (!n.connected) continue;
      nodes.push(n);
      n.kind = n.f === SHOP_FLOOR ? 'shop' : (rng() * (ENEMY_W + ELITE_W) < ELITE_W ? 'elite' : 'enemy');
    }
    return { nodes, edges, start, final, seed };
  }

  let model = null, current = null, edgeEls = null;

  function showTip(n) {
    tip.innerHTML = '<b>' + KINDS[n.kind].name + '</b><span>' + KINDS[n.kind].blurb + '</span>';
    tip.style.left = n.px + '%';
    tip.style.top = n.py + '%';
    tip.classList.add('show');
  }
  const hideTip = () => tip.classList.remove('show');

  function placeShip(n) {
    shipEl.style.left = n.px + '%';
    shipEl.style.top = n.py + '%';
  }

  function status(msg, gold) {
    statusEl.textContent = msg;
    statusEl.classList.toggle('gold', !!gold);
  }

  function updateReach() {
    for (const n of model.nodes) {
      n.el.classList.toggle('visited', n.visited);
      n.el.classList.toggle('reach', current.next.includes(n));
      n.el.setAttribute('aria-disabled', String(!current.next.includes(n)));
    }
    for (const [pair, ln] of edgeEls) {
      ln.classList.toggle('reach', pair[0] === current);
    }
  }

  function tryJump(n) {
    if (!current.next.includes(n)) {
      if (!n.visited) { n.el.classList.remove('deny'); void n.el.offsetWidth; n.el.classList.add('deny'); }
      return;
    }
    for (const [pair, ln] of edgeEls) {
      if (pair[0] === current && pair[1] === n) ln.classList.add('taken');
    }
    // Point the nose along the jump (sprite faces up).
    const rect = view.getBoundingClientRect();
    const dx = (n.px - current.px) / 100 * rect.width, dy = (n.py - current.py) / 100 * rect.height;
    shipImg.style.transform = 'rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI + 90) + 'deg)';
    current = n;
    n.visited = true;
    placeShip(n);
    updateReach();
    if (n === model.final) {
      status('SECTOR CLEARED — PIRATE BASE DESTROYED', true);
      rerollBtn.classList.add('pulse');
    } else {
      const jumps = FLOORS - n.f;
      status(n.kind === 'shop'
        ? 'DOCKED AT TRADING POST — ' + jumps + ' JUMPS TO PIRATE BASE'
        : jumps + (jumps === 1 ? ' JUMP' : ' JUMPS') + ' TO PIRATE BASE');
    }
  }

  function render(seed) {
    model = generate(seed);
    // Map generator space (y up) into view percentages (y down).
    const pad = BIG / 2 + 12;
    const xs = model.nodes.map(n => n.x), ys = model.nodes.map(n => n.y);
    const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
    for (const n of model.nodes) {
      n.px = (n.x - minX) / (maxX - minX) * 100;
      n.py = 100 - (n.y - minY) / (maxY - minY) * 100;
    }

    svg.textContent = '';
    view.querySelectorAll('.mnode').forEach(el => el.remove());
    hideTip();
    edgeEls = [];
    for (const pair of model.edges) {
      const ln = document.createElementNS(SVGNS, 'line');
      ln.setAttribute('class', 'medge');
      ln.setAttribute('x1', pair[0].px); ln.setAttribute('y1', pair[0].py);
      ln.setAttribute('x2', pair[1].px); ln.setAttribute('y2', pair[1].py);
      svg.appendChild(ln);
      edgeEls.push([pair, ln]);
    }
    for (const n of model.nodes) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mnode k-' + n.kind + (n.big ? ' big' : '');
      b.style.left = n.px + '%';
      b.style.top = n.py + '%';
      b.innerHTML = '<img src="' + KINDS[n.kind].icon + '" alt="">';
      b.setAttribute('aria-label', KINDS[n.kind].name);
      b.addEventListener('click', () => tryJump(n));
      b.addEventListener('mouseenter', () => showTip(n));
      b.addEventListener('mouseleave', hideTip);
      b.addEventListener('focus', () => showTip(n));
      b.addEventListener('blur', hideTip);
      n.el = b;
      view.appendChild(b);
    }

    seedEl.textContent = 'SEED ' + (seed >>> 0).toString(16).toUpperCase().padStart(4, '0');
    current = model.start;
    shipImg.style.transform = 'rotate(0deg)';
    shipEl.style.transition = 'none';   // teleport home, don't fly across the reroll
    placeShip(current);
    void shipEl.offsetWidth;
    shipEl.style.transition = '';
    updateReach();
    rerollBtn.classList.remove('pulse');
    status('PLOT A COURSE — SELECT A GLOWING WAYPOINT');
  }

  rerollBtn.addEventListener('click', () => {
    view.classList.remove('rr'); void view.offsetWidth;
    render(Math.floor(Math.random() * 0xFFFF) + 1);
    view.classList.add('rr');
  });

  render(Math.floor(Math.random() * 0xFFFF) + 1);
})();
