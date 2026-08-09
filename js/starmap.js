/* Sector star map — a port of the game's StarMapGenerator: a floors×lanes grid,
   several routes walked bottom-to-top with -1/0/+1 lane steps, weighted node
   types (Pirates 1.0 / Elite 0.4), a Trading Post row forced at the midpoint,
   Home Station below and the Pirate Base above.

   This is a demo reel, not a game: nothing here is clickable. The ship picks a
   random legal route and flies it home-to-boss on its own, then the sector
   rerolls and it runs again. The loop only ticks while the section is on
   screen and the tab is visible. */
(function () {
  const view = document.getElementById('map-view');
  if (!view) return;
  const svg = document.getElementById('map-svg');
  const shipEl = document.getElementById('map-ship');
  const shipImg = shipEl.querySelector('img');
  const tip = document.getElementById('map-tip');
  const seedEl = document.getElementById('map-seed');
  const statusEl = document.getElementById('map-status');
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Same tuning as StarMapConfig.asset
  const FLOORS = 5, LANES = 7, ACTIVE = 4;
  const NODE = 80, BIG = 160, GAP = 40;
  const SHOP_FLOOR = 2;              // fixedFloors: floor 3, 1-based
  const ELITE_W = 0.4, ENEMY_W = 1;  // weightedNodes chances

  // Flight timings, ms. FLIGHT must stay in step with .mship's CSS transition.
  const LAUNCH = 1100, AIM = 420, FLIGHT = 850, DWELL = 1250, CLEARED = 3000, REROLL = 900;

  const KINDS = {
    start: { name: 'HOME STATION', blurb: 'Launch point — the run starts here', icon: 'assets/map/node-start.png' },
    enemy: { name: 'PIRATES', blurb: 'Pirate ambush — fight for salvage', icon: 'assets/map/node-enemy.png' },
    elite: { name: 'ELITE PIRATES', blurb: 'Veteran squadron — high risk, rich loot', icon: 'assets/map/node-elite.png' },
    shop:  { name: 'TRADING POST', blurb: 'Spend salvage, refit your ship', icon: 'assets/map/node-shop.png' },
    boss:  { name: 'PIRATE BASE', blurb: "Captain Powder-Keg's fortress — endgame", icon: 'assets/map/node-boss.png' },
  };
  const ARRIVAL = {
    enemy: 'PIRATE AMBUSH — ',
    elite: 'ELITE SQUADRON ENGAGED — ',
    shop:  'DOCKED AT TRADING POST — ',
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
    return { nodes, edges, start, final, seed, rng };
  }

  /* One legal course, start to boss — the same -1/0/+1 chain a player would plot. */
  function plotCourse(model) {
    const route = [model.start];
    let n = model.start;
    while (n !== model.final && n.next.length) {
      n = n.next[Math.floor(model.rng() * n.next.length)];
      route.push(n);
    }
    return route;
  }

  let model = null, edgeEls = null;

  /* Auto-shown on arrival, so unlike the old hover tip it lands on edge and top
     nodes every run — clamp it inside the chart instead of letting it hang out. */
  function showTip(n) {
    tip.innerHTML = '<b>' + KINDS[n.kind].name + '</b><span>' + KINDS[n.kind].blurb + '</span>';
    tip.classList.add('show');
    const vw = view.clientWidth, vh = view.clientHeight;
    const half = tip.offsetWidth / 2 / vw * 100;
    tip.style.left = Math.min(Math.max(n.px, half + 1), 99 - half) + '%';
    // Sits above the node by default; drop it below when there's no room up there.
    const below = n.py / 100 * vh < tip.offsetHeight * 1.35;
    tip.classList.toggle('below', below);
    tip.style.top = n.py + '%';
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

  /* Light the hop the ship is about to make, and nothing else. */
  function aimAt(from, to) {
    for (const n of model.nodes) n.el.classList.toggle('reach', n === to);
    for (const [pair, ln] of edgeEls) ln.classList.toggle('reach', pair[0] === from && pair[1] === to);
  }
  function clearAim() {
    for (const n of model.nodes) n.el.classList.remove('reach');
    for (const [, ln] of edgeEls) ln.classList.remove('reach');
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
      const d = document.createElement('div');
      d.className = 'mnode k-' + n.kind + (n.big ? ' big' : '');
      d.style.left = n.px + '%';
      d.style.top = n.py + '%';
      d.innerHTML = '<img src="' + KINDS[n.kind].icon + '" alt="">';
      n.el = d;
      n.visited = n === model.start;
      d.classList.toggle('visited', n.visited);
      view.appendChild(d);
    }

    seedEl.textContent = 'SEED ' + (seed >>> 0).toString(16).toUpperCase().padStart(4, '0');
    shipImg.style.transform = 'rotate(0deg)';
    shipEl.style.transition = 'none';   // teleport home, don't fly across the reroll
    placeShip(model.start);
    void shipEl.offsetWidth;
    shipEl.style.transition = '';
  }

  /* Nose the sprite along the hop (the art faces up). */
  function aimShip(from, to) {
    const rect = view.getBoundingClientRect();
    const dx = (to.px - from.px) / 100 * rect.width;
    const dy = (to.py - from.py) / 100 * rect.height;
    shipImg.style.transform = 'rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI + 90) + 'deg)';
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(location.search).get('motion') === 'reduce';
  const newSeed = () => Math.floor(Math.random() * 0xFFFF) + 1;

  /* Reduced motion gets the outcome without the journey: a finished run. */
  function renderStatic() {
    render(newSeed());
    const route = plotCourse(model);
    for (const n of route) { n.visited = true; n.el.classList.add('visited'); }
    for (let i = 1; i < route.length; i++) {
      for (const [pair, ln] of edgeEls) {
        if (pair[0] === route[i - 1] && pair[1] === route[i]) ln.classList.add('taken');
      }
    }
    placeShip(model.final);
    status('SECTOR CLEARED — PIRATE BASE DESTROYED', true);
  }

  /* --- the loop ------------------------------------------------------- */
  let gen = 0;                         // bumped to cancel whatever is in flight
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function flyRun(mine) {
    const alive = () => mine === gen;
    render(newSeed());
    const route = plotCourse(model);
    status('PLOTTING COURSE FROM HOME STATION');
    showTip(model.start);
    await sleep(LAUNCH); if (!alive()) return;

    for (let i = 1; i < route.length; i++) {
      const from = route[i - 1], to = route[i];
      hideTip();
      aimAt(from, to);
      aimShip(from, to);
      status('JUMPING TO ' + KINDS[to.kind].name);
      await sleep(AIM); if (!alive()) return;

      placeShip(to);
      for (const [pair, ln] of edgeEls) {
        if (pair[0] === from && pair[1] === to) ln.classList.add('taken');
      }
      await sleep(FLIGHT); if (!alive()) return;

      clearAim();
      to.visited = true;
      to.el.classList.add('visited');
      showTip(to);
      if (to === model.final) {
        status('SECTOR CLEARED — PIRATE BASE DESTROYED', true);
        await sleep(CLEARED); if (!alive()) return;
      } else {
        const jumps = FLOORS - to.f;
        status(ARRIVAL[to.kind] + jumps + (jumps === 1 ? ' JUMP' : ' JUMPS') + ' TO PIRATE BASE');
        await sleep(DWELL); if (!alive()) return;
      }
    }

    hideTip();
    status('GENERATING NEW SECTOR');
    view.classList.remove('rr'); void view.offsetWidth; view.classList.add('rr');
    await sleep(REROLL); if (!alive()) return;
    flyRun(mine);
  }

  function play() { flyRun(++gen); }
  function pause() { gen++; }

  if (reduced) {
    renderStatic();
    return;
  }

  render(newSeed());
  status('AWAITING NAV UPLINK');

  // Only burn frames while the chart is actually being looked at.
  let onScreen = false;
  new IntersectionObserver(es => {
    for (const e of es) {
      onScreen = e.isIntersecting;
      if (onScreen && !document.hidden) play(); else pause();
    }
  }, { threshold: 0.25 }).observe(view);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else if (onScreen) play();
  });
})();
