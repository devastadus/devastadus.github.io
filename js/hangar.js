/* Hangar viewer — main-menu style ship showcase.
   Stats pulled from the game's ship ScriptableObjects (Sun-Aces-Next). */
(() => {
  const SHIPS = [
    {
      id: 'f222', name: 'F-222', role: 'Strike Fighter',
      sprite: 'assets/ship-f222.png', glow: 'rgba(255,74,61,.45)',
      desc: 'Fast, balanced fighter with strong top speed, steady energy recovery, and a laser loadout backed by a defensive barrel roll.',
      loadout: ['LaserBolt', 'Barrel Roll'], ability: 'barrel-roll',
      stats: { hull: 100, speed: 20, accel: 11, turn: 3.6, regen: 20 }
    },
    {
      id: 'tracer', name: 'TRACER', role: 'Interceptor',
      sprite: 'assets/ship-tracer.png', glow: 'rgba(255,120,61,.45)',
      desc: 'Lightweight interceptor with sharp acceleration, machine-gun pressure, and a blink drive for sudden repositioning.',
      loadout: ['Machine Gun', 'Blink'], ability: 'blink',
      stats: { hull: 75, speed: 15, accel: 15, turn: 3.2, regen: 20 }
    },
    {
      id: 'diefighter', name: 'DIE FIGHTER', role: 'Heavy Brawler',
      sprite: 'assets/ship-diefighter.png', glow: 'rgba(95,217,104,.45)',
      desc: 'Heavy hull fighter built to absorb punishment and win close-range trades, but slower to accelerate and turn.',
      loadout: ['Laser Blasters', 'Blade Maneuver'], ability: 'blade-maneuver',
      stats: { hull: 150, speed: 12, accel: 8, turn: 2.8, regen: 18 }
    }
  ];
  const MAX = { hull: 150, speed: 20, accel: 15, turn: 3.6, regen: 20 };
  const FMT = { turn: v => v.toFixed(1) };
  const CYCLE_MS = 8000;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage   = document.getElementById('hangar-stage');
  const sprite  = document.getElementById('hangar-sprite');
  const nameEl  = document.getElementById('hangar-name');
  const roleEl  = document.getElementById('hangar-role');
  const descEl  = document.getElementById('hangar-desc');
  const loadEl  = document.getElementById('hangar-loadout');
  const statsEl = document.getElementById('hangar-stats');
  const tabsEl  = document.getElementById('hangar-tabs');
  if (!stage) return;

  /* ship ability panel — the ability is a weapon SO with its own talent tree */
  const abGrid = document.getElementById('ability-grid');
  const abTalents = (abGrid && window.createTalentGrid)
    ? window.createTalentGrid(abGrid, document.getElementById('ability-tip')) : null;
  function renderAbility(s) {
    if (!abTalents) return;
    const a = (window.WEAPONS || []).find(w => w.slug === s.ability);
    if (!a) return;
    document.getElementById('ability-icon').src = a.icon;
    document.getElementById('ability-icon').alt = a.name + ' ability icon';
    scramble(document.getElementById('ability-name'), a.name.toUpperCase());
    document.getElementById('ability-desc').textContent = a.desc;
    abTalents.render(a);
  }

  tabsEl.style.setProperty('--cycle', CYCLE_MS + 'ms');
  SHIPS.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'hangar-tab';
    b.innerHTML = `<img class="pixel" src="${s.sprite}" alt=""><span>${s.name}</span><span class="cycle"></span>`;
    b.addEventListener('click', () => { userNav = true; show(i); });
    tabsEl.appendChild(b);
  });
  const tabs = [...tabsEl.children];

  /* --- text scramble (decode) effect --- */
  const GLYPHS = '▓▒░<>/\\|=+*#01';
  function scramble(el, text, ms = 420) {
    if (reduced) { el.textContent = text; return; }
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / ms);
      const lock = Math.floor(text.length * t);
      el.textContent = text.slice(0, lock) + [...text.slice(lock)]
        .map(c => c === ' ' ? ' ' : GLYPHS[Math.random() * GLYPHS.length | 0]).join('');
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* --- stat bar + number tween --- */
  const shown = { hull: 0, speed: 0, accel: 0, turn: 0, regen: 0 };
  function tweenStats(target, ms = 700) {
    const from = { ...shown };
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    (function tick(now) {
      const t = reduced ? 1 : Math.min(1, (now - start) / ms);
      const e = ease(t);
      statsEl.querySelectorAll('.stat').forEach(row => {
        const k = row.dataset.key;
        const v = from[k] + (target[k] - from[k]) * e;
        row.querySelector('.bar i').style.width = (v / MAX[k] * 100) + '%';
        row.querySelector('label b').textContent = (FMT[k] || Math.round)(v);
      });
      if (t < 1) requestAnimationFrame(tick);
      else Object.assign(shown, target);
    })(start);
  }

  let current = -1, userNav = false, timer = null;
  function show(i) {
    if (i === current) { restartCycle(); return; }
    current = i;
    const s = SHIPS[i];
    tabs.forEach((b, j) => b.classList.toggle('active', j === i));

    const applyInfo = () => {
      sprite.src = s.sprite;
      sprite.alt = s.name + ' ship sprite';
      sprite.style.filter = `drop-shadow(0 0 22px ${s.glow})`;
      scramble(nameEl, s.name);
      roleEl.textContent = s.role;
      descEl.textContent = s.desc;
      loadEl.innerHTML = s.loadout.map(w => `<span class="chip">${w}</span>`).join('');
      renderAbility(s);
    };

    if (reduced || sprite.dataset.first !== '1') {
      sprite.dataset.first = '1';
      applyInfo();
      tweenStats(s.stats);
    } else {
      sprite.classList.remove('swap-in');
      sprite.classList.add('swap-out');
      stage.classList.remove('flash'); void stage.offsetWidth;
      stage.classList.add('flash');
      setTimeout(() => {
        applyInfo();
        sprite.classList.remove('swap-out');
        sprite.classList.add('swap-in');
        tweenStats(s.stats);
      }, 160);
    }
    restartCycle();
  }

  /* --- auto-cycle, paused when offscreen or tab hidden --- */
  let visible = false;
  function restartCycle() {
    clearTimeout(timer);
    tabs.forEach(b => {
      const c = b.querySelector('.cycle');
      c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
    });
    if (reduced) return;
    timer = setTimeout(() => {
      if (visible && !document.hidden) show((current + 1) % SHIPS.length);
      else restartCycle();
    }, CYCLE_MS);
  }
  new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; }),
    { threshold: .2 }).observe(stage);

  /* pilots: run the cockpit feeds only while on screen (and never for reduced-motion users) */
  const feeds = document.querySelectorAll('.pilot-frame video');
  if (reduced) feeds.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });
  else {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target; v.muted = true;
      v.dataset.onscreen = e.isIntersecting ? '1' : '';
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }), { threshold: .1 });
    feeds.forEach(v => vio.observe(v));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) feeds.forEach(v => { if (v.dataset.onscreen) v.play().catch(() => {}); });
    });
  }

  show(0);
})();
