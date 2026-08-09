/* Solar Aces — layered animated space background.
   Composition (planets, sun, nebula, asteroid density, timings) is rolled from a
   seeded PRNG so every load looks slightly different. Reproduce a roll with ?seed=N.
   (Adding/removing seeded rolls shifts the stream, so a given seed may render
   differently across versions of this file — seeds are a debug affordance only.) */
'use strict';
(function(){

/* ---------- seeded rng (composition only; transient effects use Math.random) ---------- */
const qs = new URLSearchParams(location.search);
const SEED = qs.has('seed') ? (Number(qs.get('seed')) >>> 0) : (Date.now() >>> 0);
console.info('[solar-aces] space seed: ' + SEED + '  (reproduce with ?seed=' + SEED + ')');
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rand = mulberry32(SEED);
const R  = (a,b)=>a+rand()*(b-a);
const RI = (a,b)=>Math.floor(R(a,b+1));
const pick = arr=>arr[Math.floor(rand()*arr.length)];
const MR = (a,b)=>a+Math.random()*(b-a);

const REDUCED = qs.has('motion') ? qs.get('motion')==='reduce'
  : matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- canvases ----------
   One visible canvas, redrawn every frame (some compositors miss updates to a
   mostly-static promoted canvas layer). The static scene (nebula/planets/far
   stars) is painted into an offscreen buffer and blitted with a parallax offset. */
const view = document.getElementById('space');
const fctx = view.getContext('2d');
const bg = document.createElement('canvas');   // offscreen static-scene buffer
const bctx = bg.getContext('2d');
const OVERDRAW = 1.35;             // scene space is taller than viewport for scroll parallax
let W = 0, H = 0, CH = 0;          // viewport w/h, scene height
let parBG = 0, parFG = 0;          // parallax offsets, set on scroll

/* ---------- assets ---------- */
const loaded = {};
function load(src){
  return new Promise(res=>{
    const im = new Image();
    im.onload = ()=>{ loaded[src] = im; res(im); };
    im.onerror = ()=>res(null);
    im.src = src;
  });
}
const SP = 'assets/space/';
const AST_SRCS = ['ast-tiny-1.png','ast-tiny-2.png','ast-small-1.png','ast-small-2.png',
  'ast-medium-1.png','ast-medium-2.png','ast-medium-3.png','ast-medium-4.png'].map(f=>SP+f);
// current 32px hangar sprites (same set the hangar viewer uses)
const SHIP_SRCS = ['assets/ship-f222.png','assets/ship-tracer.png','assets/ship-diefighter.png'];

/* ---------- composition roll (all seeded, rolled once, before any await) ---------- */
const PLANET_ROSTER = [
  {key:'saturn',  tex:SP+'saturn.png',  rings:[SP+'saturn-ring-back.png',SP+'saturn-ring-front.png'], size:[200,340], weight:3},
  {key:'jupiter', tex:SP+'jupiter.png', size:[180,320], weight:2},
  {key:'neptune', tex:SP+'neptune.png', size:[150,260], weight:2},
  {key:'mars',    tex:SP+'mars.png',    pixel:true, size:[128,192], weight:2},
  {key:'earth',   tex:SP+'earth.png',   pixel:true, clouds:SP+'earth-clouds.png', moon:SP+'moon.png', size:[128,192], weight:2},
];
// weighted shuffle-pick without replacement
function rollPlanets(n){
  const pool = PLANET_ROSTER.slice(), out = [];
  while(out.length < n && pool.length){
    const total = pool.reduce((s,p)=>s+p.weight,0);
    let r = rand()*total, i = 0;
    while((r -= pool[i].weight) > 0) i++;
    out.push(pool.splice(i,1)[0]);
  }
  return out;
}
// placement zones keep the hero title band + nav clear; fractions of viewport
const ZONES = [
  {x:[0.02,0.22], y:[0.12,0.48]},   // upper left
  {x:[0.74,0.96], y:[0.16,0.55]},   // right
  {x:[0.10,0.55], y:[0.68,0.92]},   // lower band
];
// first planet always lands in one of the two above-the-fold side zones
const zoneOrder = (()=>{ const top = ZONES.slice(0,2); if(rand()<.5) top.reverse(); return [...top, ZONES[2]]; })();
const planets = rollPlanets(RI(1,3)).map((p,i)=>{
  const z = zoneOrder[i%zoneOrder.length];
  let d = R(p.size[0], p.size[1]);
  if(p.pixel) d = 64 * RI(2,3);                 // integer upscale keeps pixel art crisp
  return { def:p, fx:R(z.x[0],z.x[1]), fy:R(z.y[0],z.y[1]), d,
    hue:R(-12,12), bright:R(.9,1.05), alpha:R(.55,.8),
    phase:R(0,1), cphase:R(0,1),                        // texture scroll = axial spin
    spin:R(1/90, 1/38) * (rand()<.5?-1:1),              // texture cycles/sec (one day = 38–90s)
    vx:R(-1.1,1.1), vy:R(.35,1.4),                      // slow world drift, px/s
    moonAng:R(0,Math.PI*2), moonSp:R(.12,.22)*(rand()<.5?-1:1) };
});
const nebulae = Array.from({length:RI(2,4)}, ()=>({
  fx:R(-.1,1.0), fy:R(-.05,.95), scale:R(.5,1.4), rot:R(0,Math.PI*2),
  alpha:R(.07,.16), hue:R(-60,140)
}));
const AST_COUNT = RI(5,14);
const current = { a:R(Math.PI*0.1, Math.PI*0.45) + (rand()<.5?Math.PI:0) }; // shared drift direction
const asteroids = Array.from({length:AST_COUNT}, ()=>({
  src:pick(AST_SRCS), z:R(.35,1), fx:R(0,1), fy:R(0,1),
  a:current.a + R(-.18,.18), rot:R(0,Math.PI*2), rs:R(.05,.3)*(rand()<.5?-1:1),
  sp:R(4,16)
}));
// sun: the scene's light source. Seeded position in the above-the-fold side zone
// the first planet did NOT get, so the hero title band stays clear. Lives on the
// parBG (deepest) layer; a planet drifting across it reads as an eclipse.
const sunZone = zoneOrder[1];
const sun = {
  fx: R(sunZone.x[0], sunZone.x[1]), fy: R(.07,.20),
  r:  R(26,44),
  hue:R(-8,20),                                   // offset from base 40° = warm white → pale gold
  rays: Array.from({length:RI(2,4)}, ()=>({
    spread: R(-.3,.3),                            // offset from the down-into-viewport base angle
    w: R(30,90), lenF: R(1.0,1.15),
    // transient pulse/sway are unseeded, like other ambient motion
    phase: MR(0,Math.PI*2), pulse: MR(.00045,.0009),
    sway: MR(.02,.05), swaySp: MR(.00008,.00018)
  })),
  x:0, y:0, baseAng:0
};
let cometNext = R(5,14)*1000;         // ms from start
let flybyNext = R(9,22)*1000;
const comets = [];
let flyby = null;

/* ---------- static layer (bg): nebula, planets, far star dusting ---------- */
const farStars = Array.from({length:120}, ()=>({fx:Math.random(), fy:Math.random(), r:Math.random()<.8?1:2, a:.12+Math.random()*.25}));
const hasFilter = (bctx.filter !== undefined);

/* Prerender a planet's parts once per layout: tinted texture strip, rings,
   limb-shade overlay, shaded moon. Per-frame drawing then just scrolls the
   texture inside a circle clip — that's the axial spin, same trick as the game. */
function makeCanvas(w,h){ const c = document.createElement('canvas'); c.width = Math.max(1,Math.ceil(w)); c.height = Math.max(1,Math.ceil(h)); return c; }

/* ---------- prerendered lighting sprites (built once at boot) ---------- */
// soft radial glow, tinted; replaces all per-frame createRadialGradient calls
function makeGlow(size, col){
  const c = makeCanvas(size,size), x = c.getContext('2d');
  const g = x.createRadialGradient(size/2,size/2,0, size/2,size/2,size/2);
  g.addColorStop(0,'rgba('+col+',.7)');
  g.addColorStop(.5,'rgba('+col+',.18)');
  g.addColorStop(1,'rgba('+col+',0)');
  x.fillStyle = g; x.fillRect(0,0,size,size);
  return c;
}
const glowWhite = makeGlow(64,'255,255,255');
const glowCyan  = makeGlow(64,'87,215,255');
const glowGold  = makeGlow(64,'245,185,66');
// 4-armed cross flare for the occasional star sparkle
const flareSprite = (()=>{
  const d = 48, h = d/2, c = makeCanvas(d,d), x = c.getContext('2d');
  x.translate(h,h);
  const g = x.createRadialGradient(0,0,0, 0,0,h);
  g.addColorStop(0,'rgba(255,255,255,.95)');
  g.addColorStop(.25,'rgba(207,227,245,.5)');
  g.addColorStop(1,'rgba(207,227,245,0)');
  x.fillStyle = g;
  for(let i=0;i<2;i++){ x.fillRect(-h,-1.5,d,3); x.rotate(Math.PI/2); }
  x.fillRect(-2,-2,4,4);
  return c;
})();

/* Sun art: core disc + corona + god-ray beams, prerendered per layout.
   Beams are baked pointing straight down and rotated at draw time. */
function prepSun(){
  const r = sun.r;
  sun.baseAng = Math.atan2(H*.95 - sun.y, W*.5 - sun.x);   // aim rays down into the viewport
  const hue = 40 + sun.hue;
  const cd = Math.ceil(r*6);
  const core = makeCanvas(cd,cd), cctx = core.getContext('2d');
  const cg = cctx.createRadialGradient(cd/2,cd/2,0, cd/2,cd/2,cd/2);
  cg.addColorStop(0,'rgba(255,255,255,1)');
  cg.addColorStop(.12,'rgba(255,250,235,.95)');
  cg.addColorStop(.25,'hsla('+hue+',90%,72%,.55)');
  cg.addColorStop(.5,'hsla('+hue+',85%,60%,.16)');
  cg.addColorStop(1,'rgba(0,0,0,0)');
  cctx.fillStyle = cg; cctx.fillRect(0,0,cd,cd);
  sun._core = core;
  const kd = Math.ceil(Math.min(W,H)*.9);                  // cap keeps the gradient fill cheap on ultrawide
  const cor = makeCanvas(kd,kd), kctx = cor.getContext('2d');
  const kg = kctx.createRadialGradient(kd/2,kd/2,r*.5, kd/2,kd/2,kd/2);
  kg.addColorStop(0,'hsla('+hue+',90%,80%,.20)');
  kg.addColorStop(.4,'hsla('+hue+',80%,65%,.07)');
  kg.addColorStop(1,'rgba(0,0,0,0)');
  kctx.fillStyle = kg; kctx.fillRect(0,0,kd,kd);
  sun._corona = cor;
  for(const ray of sun.rays){
    const len = Math.ceil(H*1.15*ray.lenF), w = Math.ceil(ray.w);
    const rc = makeCanvas(w,len), x = rc.getContext('2d');
    const hg = x.createLinearGradient(0,0,w,0);            // soft edges across the beam
    hg.addColorStop(0,'hsla('+hue+',60%,85%,0)');
    hg.addColorStop(.5,'hsla('+hue+',60%,85%,.85)');
    hg.addColorStop(1,'hsla('+hue+',60%,85%,0)');
    x.fillStyle = hg;
    x.beginPath();                                          // tapered: full width at base → 50% at tip
    x.moveTo(0,0); x.lineTo(w,0); x.lineTo(w*.75,len); x.lineTo(w*.25,len);
    x.closePath(); x.fill();
    x.globalCompositeOperation = 'destination-in';
    const vg = x.createLinearGradient(0,0,0,len);           // fade out along the length
    vg.addColorStop(0,'rgba(0,0,0,1)'); vg.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle = vg; x.fillRect(0,0,w,len);
    if(hasFilter){                                          // volumetric blur, baked (never per-frame)
      const pad = 10, fc = makeCanvas(w+pad*2, len+pad*2), f = fc.getContext('2d');
      f.filter = 'blur(6px)';
      f.drawImage(rc, pad, pad);
      ray._c = fc; ray._pad = pad;
    } else { ray._c = rc; ray._pad = 0; }
  }
}
function prepPlanet(p){
  const tex = loaded[p.def.tex];
  if(!tex || !p.dEff) return false;
  const d = Math.round(p.dEff), r = d/2;
  const tint = (hasFilter && !p.def.pixel)
    ? 'hue-rotate('+p.hue.toFixed(1)+'deg) brightness('+p.bright.toFixed(2)+')' : null;
  const tc = makeCanvas(d,d), tctx = tc.getContext('2d');
  tctx.imageSmoothingEnabled = !p.def.pixel;
  if(tint) tctx.filter = tint;
  tctx.drawImage(tex, 0, 0, d, d);
  p._tex = tc;
  if(p.def.clouds && loaded[p.def.clouds]){
    const cc = makeCanvas(d,d), cctx = cc.getContext('2d');
    cctx.imageSmoothingEnabled = false;
    cctx.drawImage(loaded[p.def.clouds], 0, 0, d, d);
    p._clouds = cc;
  }
  if(p.def.rings){
    const rB = loaded[p.def.rings[0]], rF = loaded[p.def.rings[1]];
    const rw = d*2.1, rh = d*1.05;
    p._ringB = p._ringF = null;
    for(const [img,key] of [[rB,'_ringB'],[rF,'_ringF']]){
      if(!img) continue;
      const rc = makeCanvas(rw,rh), rctx = rc.getContext('2d');
      if(tint) rctx.filter = tint;
      rctx.drawImage(img, 0, 0, rw, rh);
      p[key] = rc;
    }
  }
  const sc = makeCanvas(d,d), sctx = sc.getContext('2d');
  sctx.beginPath(); sctx.arc(r, r, r, 0, Math.PI*2); sctx.clip();
  const g = sctx.createRadialGradient(r-r*.35, r-r*.4, r*.1, r, r, r*1.05);
  g.addColorStop(0,'rgba(255,255,255,.10)');
  g.addColorStop(.45,'rgba(0,0,0,0)');
  g.addColorStop(.8,'rgba(2,4,12,.35)');
  g.addColorStop(1,'rgba(2,4,12,.85)');
  sctx.fillStyle = g; sctx.fillRect(0,0,d,d);
  p._shade = sc;
  if(p.def.moon && loaded[p.def.moon]){
    const md = Math.max(8, Math.round(d*.28)), mr = md/2;
    const mc = makeCanvas(md,md), mctx = mc.getContext('2d');
    mctx.beginPath(); mctx.arc(mr, mr, mr, 0, Math.PI*2); mctx.clip();
    mctx.imageSmoothingEnabled = false;
    mctx.drawImage(loaded[p.def.moon], 0, 0, md, md);
    const mg = mctx.createRadialGradient(mr-mr*.35, mr-mr*.4, mr*.1, mr, mr, mr*1.05);
    mg.addColorStop(0,'rgba(255,255,255,.08)');
    mg.addColorStop(.6,'rgba(0,0,0,0)');
    mg.addColorStop(1,'rgba(2,4,12,.8)');
    mctx.fillStyle = mg; mctx.fillRect(0,0,md,md);
    p._moon = mc;
  }
  return true;
}

function drawMoon(p, mx, my, ms){
  fctx.save();
  fctx.globalAlpha = p.alpha*.9;
  fctx.imageSmoothingEnabled = false;
  fctx.drawImage(p._moon, mx-ms/2, my-ms/2, ms, ms);
  fctx.restore();
}

function drawPlanets(dt){
  fctx.save();
  fctx.translate(0, -parBG);
  for(const p of planets){
    if(!p._tex && !prepPlanet(p)) continue;
    const d = p._tex.width, r = d/2;
    // spin + slow world drift, like flying past them in a run
    p.phase = (p.phase + p.spin*dt + 1) % 1;
    p.cphase = (p.cphase + p.spin*1.5*dt + 1) % 1;
    p.x += p.vx*dt; p.y += p.vy*dt;
    const m = d*1.3;
    if(p.y - m > CH){ p.y = -m; p.x = Math.random()*W; }
    if(p.x < -m) p.x = W+m; else if(p.x > W+m) p.x = -m;
    const px = p.x, py = p.y;
    // moon orbits: far half drawn behind the planet, near half in front
    let moonInfo = null;
    if(p._moon){
      p.moonAng += p.moonSp*dt;
      const orbit = d*.95;
      const s = Math.sin(p.moonAng);
      const mx = px + Math.cos(p.moonAng)*orbit;
      const my = py + s*orbit*.32;
      const ms = p._moon.width * (.8 + .25*(s+1)/2);
      moonInfo = {mx, my, ms, front: s >= 0};
      if(!moonInfo.front) drawMoon(p, mx, my, ms);
    }
    fctx.globalAlpha = p.alpha;
    if(p._ringB) fctx.drawImage(p._ringB, px-p._ringB.width/2, py-p._ringB.height/2);
    // sphere: scroll the texture horizontally inside the circle clip
    fctx.save();
    fctx.beginPath(); fctx.arc(px, py, r, 0, Math.PI*2); fctx.clip();
    fctx.imageSmoothingEnabled = !p.def.pixel;
    const off = Math.floor(p.phase*d);
    fctx.drawImage(p._tex, px-r-off, py-r);
    fctx.drawImage(p._tex, px-r-off+d, py-r);
    if(p._clouds){
      const coff = Math.floor(p.cphase*d);
      fctx.globalAlpha = p.alpha*.85;
      fctx.drawImage(p._clouds, px-r-coff, py-r);
      fctx.drawImage(p._clouds, px-r-coff+d, py-r);
      fctx.globalAlpha = p.alpha;
    }
    fctx.restore();
    fctx.drawImage(p._shade, px-r, py-r);
    if(p._ringF) fctx.drawImage(p._ringF, px-p._ringF.width/2, py-p._ringF.height/2);
    if(moonInfo && moonInfo.front) drawMoon(p, moonInfo.mx, moonInfo.my, moonInfo.ms);
  }
  fctx.globalAlpha = 1;
  fctx.restore();
}

/* haze.jpg is a square texture: drawn rotated, its straight edges show up as
   hard brightness steps in the background. Feather it once through a radial
   alpha mask so each nebula blob fades smoothly to nothing. */
let hazeSoft = null;
function featherHaze(img){
  const d = Math.min(img.width, img.height);
  const c = makeCanvas(d,d), x = c.getContext('2d');
  x.drawImage(img, 0, 0, d, d);
  x.globalCompositeOperation = 'destination-in';
  const g = x.createRadialGradient(d/2, d/2, d*.2, d/2, d/2, d*.5);
  g.addColorStop(0,'rgba(0,0,0,1)');
  g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0,0,d,d);
  return c;
}

function paintBG(){
  if(!W || !H) return;               // layout hasn't run with a real viewport yet
  bctx.clearRect(0,0,W,CH);
  // nebula haze
  const haze = loaded[SP+'haze.jpg'] && (hazeSoft || (hazeSoft = featherHaze(loaded[SP+'haze.jpg'])));
  if(haze){
    for(const n of nebulae){
      const s = Math.max(W,H)*n.scale;
      bctx.save();
      bctx.globalCompositeOperation = 'screen';
      bctx.globalAlpha = n.alpha;
      if(hasFilter) bctx.filter = 'hue-rotate('+n.hue.toFixed(0)+'deg) saturate(1.3) blur(2px)';
      bctx.translate(n.fx*W, n.fy*CH);
      bctx.rotate(n.rot);
      bctx.drawImage(haze, -s/2, -s/2, s, s);
      bctx.restore();
    }
  }
  // far star dusting
  bctx.globalAlpha = 1;
  for(const s of farStars){
    bctx.fillStyle = 'rgba(207,227,245,'+s.a.toFixed(2)+')';
    bctx.fillRect(s.fx*W, s.fy*CH, s.r, s.r);
  }
}

function drawSun(t){
  if(!sun._core) return;
  fctx.save();
  fctx.translate(0, -parBG);
  fctx.globalCompositeOperation = 'screen';     // luminous over the nebula haze
  const kd = sun._corona.width;
  fctx.drawImage(sun._corona, sun.x-kd/2, sun.y-kd/2);
  for(const ray of sun.rays){
    fctx.save();
    fctx.translate(sun.x, sun.y);
    // beams are baked pointing down (+y); rotate that axis onto the ray direction
    fctx.rotate(sun.baseAng + ray.spread - Math.PI/2 + Math.sin(t*ray.swaySp)*ray.sway);
    fctx.globalAlpha = .16 + .06*Math.sin(t*ray.pulse + ray.phase);   // gentle pulse, .10–.22
    fctx.drawImage(ray._c, -ray._c.width/2, -ray._pad);
    fctx.restore();
  }
  fctx.globalAlpha = 1;
  fctx.globalCompositeOperation = 'source-over';
  const cd = sun._core.width;
  fctx.drawImage(sun._core, sun.x-cd/2, sun.y-cd/2);
  fctx.restore();
}

/* ---------- animated layer (fg): stars, asteroids, comets, flyby ----------
   Stars live in two parallax depths in front of the bg buffer's static dusting;
   with the bg (.05) and asteroid (.12) layers that makes four scroll speeds. */
const starLayers = [
  { par:.09, off:0, drift:.12, density:22000, cap:100, big:0,   goldChance:0,   twBase:.30, twAmp:.15, twSpeed:1/1600, stars:[] },
  { par:.16, off:0, drift:.25, density:28000, cap:80,  big:.15, goldChance:.15, twBase:.35, twAmp:.5,  twSpeed:1/900,  stars:[] },
];
function seedStars(){
  for(const L of starLayers){
    L.stars = Array.from({length:Math.min(L.cap, W*CH/L.density)}, ()=>({
      x:Math.random()*W, y:Math.random()*CH,
      z:Math.random()*.7+.3,
      r:Math.random()<L.big?2:1,
      gold:Math.random()<L.goldChance,
      tw:Math.random()*Math.PI*2
    }));
  }
}
function drawStarLayer(L, dt, t){
  fctx.save();
  fctx.translate(0, -L.off);
  for(const s of L.stars){
    s.y += s.z*L.drift*(dt*60); if(s.y>CH){ s.y=0; s.x=Math.random()*W; }
    const a = L.twBase + L.twAmp*Math.abs(Math.sin(t*L.twSpeed + s.tw));
    fctx.fillStyle = s.gold ? 'rgba(245,185,66,'+a.toFixed(2)+')' : 'rgba(207,227,245,'+a.toFixed(2)+')';
    fctx.fillRect(s.x, s.y, s.r, s.r);
  }
  fctx.restore();
}
// occasional cross-flare sparkle on a random near-layer star
let sparkle = null, sparkleNext = MR(4,9)*1000;
function drawSparkle(dt){
  if(sparkle){
    sparkle.t += dt;
    const f = sparkle.t/sparkle.dur;
    if(f >= 1){ sparkle = null; sparkleNext = elapsed + MR(4,9)*1000; return; }
    const env = Math.sin(Math.PI*f);
    const d = 48*sparkle.scale*(.5+.5*env);
    fctx.save();
    fctx.translate(0, -starLayers[1].off);
    fctx.globalAlpha = env;
    fctx.drawImage(flareSprite, sparkle.s.x-d/2, sparkle.s.y-d/2, d, d);
    fctx.restore();
    fctx.globalAlpha = 1;
  } else if(elapsed > sparkleNext){
    const pool = starLayers[1].stars;
    if(pool.length) sparkle = { s:pool[Math.floor(Math.random()*pool.length)], t:0, dur:.7, scale:MR(.7,1.3) };
  }
}

function drawAsteroids(dt){
  fctx.save();
  fctx.translate(0, -parFG);
  fctx.imageSmoothingEnabled = false;
  for(const a of asteroids){
    const img = loaded[a.src];
    if(!img) continue;
    if(dt){
      a.fx += Math.cos(a.a)*a.sp*a.z*dt / W;
      a.fy += Math.sin(a.a)*a.sp*a.z*dt / CH;
      a.rot += a.rs*dt;
      // wrap with margin
      if(a.fx<-.08) a.fx=1.08; if(a.fx>1.08) a.fx=-.08;
      if(a.fy<-.08) a.fy=1.08; if(a.fy>1.08) a.fy=-.08;
    }
    const s = .35 + a.z*.75;
    fctx.save();
    fctx.translate(a.fx*W, a.fy*CH);
    fctx.rotate(a.rot);
    fctx.globalAlpha = .45 + .45*a.z;
    fctx.drawImage(img, -img.width*s/2, -img.height*s/2, img.width*s, img.height*s);
    fctx.restore();
  }
  fctx.globalAlpha = 1;
  fctx.restore();
}

function spawnComet(){
  const fromLeft = Math.random()<.5;
  const ang = MR(.35,.75) * (fromLeft?1:-1) + (fromLeft?0:Math.PI);   // diagonal downward
  const sp = MR(380,680);
  comets.push({
    x: fromLeft ? -40 : W+40, y: MR(0, H*.5),
    vx: Math.cos(ang)*sp * (fromLeft?1:1), vy: Math.abs(Math.sin(ang))*sp*.6,
    gold: Math.random()<.3, trail:[]
  });
}
function spawnFlyby(){
  const img = loaded[SHIP_SRCS[Math.floor(Math.random()*SHIP_SRCS.length)]];
  if(!img) return;
  const ltr = Math.random()<.5;
  flyby = {
    img, ltr, scale: Math.floor(MR(5,9)),   // integer upscale of the 32px sprite keeps pixels crisp
    x: ltr ? -120 : W+120,
    y: MR(H*.15, H*.75),
    sp: MR(260,420) * (ltr?1:-1),
    wob: MR(8,16), wf: MR(1.5,3), t:0
  };
}

let rafId = null, lastT = 0, elapsed = 0;
function tick(t){
  if(W !== innerWidth || H !== innerHeight) layout();   // also covers a 0-size viewport at boot
  if(!W || !H){ rafId = requestAnimationFrame(tick); return; }
  if(!lastT) lastT = t;
  const dt = Math.min(.05, (t-lastT)/1000);
  lastT = t; elapsed += dt*1000;
  fctx.clearRect(0,0,W,H);
  fctx.drawImage(bg, 0, -parBG);
  drawSun(t);
  drawPlanets(dt);
  drawStarLayer(starLayers[0], dt, t);   // mid depth, behind asteroids
  drawAsteroids(dt);
  fctx.save();
  fctx.translate(0, -parFG);

  // comets
  if(elapsed > cometNext){ spawnComet(); cometNext = elapsed + MR(6,18)*1000; }
  for(let i=comets.length-1; i>=0; i--){
    const c = comets[i];
    c.x += c.vx*dt; c.y += c.vy*dt;
    c.trail.push({x:c.x, y:c.y});
    if(c.trail.length>16) c.trail.shift();
    for(let j=1; j<c.trail.length; j++){
      const p0=c.trail[j-1], p1=c.trail[j], f=j/c.trail.length;
      fctx.strokeStyle = c.gold ? 'rgba(245,185,66,'+(f*.5).toFixed(2)+')' : 'rgba(87,215,255,'+(f*.5).toFixed(2)+')';
      fctx.lineWidth = f*3;
      fctx.beginPath(); fctx.moveTo(p0.x,p0.y); fctx.lineTo(p1.x,p1.y); fctx.stroke();
    }
    // soft white halo (the game's glow treatment) under the tinted head glow
    fctx.globalAlpha = .35;
    fctx.drawImage(glowWhite, c.x-16, c.y-16, 32, 32);
    fctx.globalAlpha = .8;
    fctx.drawImage(c.gold ? glowGold : glowCyan, c.x-10, c.y-10, 20, 20);
    fctx.globalAlpha = 1;
    fctx.fillStyle = '#fff';
    fctx.fillRect(c.x-1.5, c.y-1.5, 3, 3);
    if(c.x<-80||c.x>W+80||c.y>CH+80) comets.splice(i,1);
  }

  // ship flyby
  if(!flyby && elapsed > flybyNext) spawnFlyby();
  if(flyby){
    const f = flyby;
    f.t += dt; f.x += f.sp*dt;
    const y = f.y + Math.sin(f.t*f.wf)*f.wob;
    const iw = f.img.width*f.scale, ih = f.img.height*f.scale;
    // soft white halo behind the ship, like the game's lighting treatment
    fctx.globalAlpha = .25;
    fctx.drawImage(glowWhite, f.x-ih*.9, y-ih*.9, ih*1.8, ih*1.8);
    // engine glow trail
    const gx = f.x - Math.sign(f.sp)*iw*.6;
    fctx.globalAlpha = .65;
    fctx.drawImage(glowCyan, gx-ih*.5, y-ih*.5, ih, ih);
    fctx.globalAlpha = 1;
    fctx.save();
    fctx.translate(f.x, y);
    fctx.rotate(f.sp>0 ? Math.PI/2 : -Math.PI/2);   // sprites face up; rotate to travel direction
    fctx.imageSmoothingEnabled = false;
    fctx.drawImage(f.img, -iw/2, -ih/2, iw, ih);
    fctx.restore();
    if(f.x<-160||f.x>W+160){ flyby=null; flybyNext = elapsed + MR(30,75)*1000; }
  }

  fctx.restore();
  drawStarLayer(starLayers[1], dt, t);   // nearest depth, in front of everything
  drawSparkle(dt);
  rafId = requestAnimationFrame(tick);
}

/* ---------- parallax ---------- */
function onScroll(){
  const y = scrollY, max = CH - H;
  parBG = Math.min(y*.05, max);
  starLayers[0].off = Math.min(y*.09, max);
  parFG = Math.min(y*.12, max);
  starLayers[1].off = Math.min(y*.16, max);
  if(REDUCED) queueStaticPass();               // parallax tracks scroll without a loop
}

/* ---------- lifecycle ---------- */
function layout(){
  W = innerWidth; H = innerHeight; CH = Math.ceil(H*OVERDRAW);
  if(!W || !H) return;               // viewport not ready yet; tick retries
  view.width = W; view.height = H;
  bg.width = W; bg.height = CH;
  sun.x = sun.fx*W; sun.y = sun.fy*H;
  prepSun();
  for(const p of planets){
    p._tex = p._clouds = p._ringB = p._ringF = p._shade = p._moon = null;   // re-render at same roll
    // narrow screens: shrink planets and push them toward the edges so hero text stays clear
    p.dEff = p.def.pixel ? p.d : Math.min(p.d, W*.5);
    const fxEff = W < 700 ? (p.fx < .5 ? p.fx - .14 : p.fx + .14) : p.fx;
    p.x = fxEff*W; p.y = p.fy*H;
  }
  seedStars();
  paintBG();
  onScroll();
}

let resizeTimer;
addEventListener('resize', ()=>{ clearTimeout(resizeTimer); resizeTimer = setTimeout(()=>{ layout(); if(REDUCED) staticPass(); }, 150); });
addEventListener('scroll', onScroll, {passive:true});
document.addEventListener('visibilitychange', ()=>{
  if(REDUCED) return;
  if(document.hidden){ cancelAnimationFrame(rafId); rafId=null; lastT=0; }
  else if(!rafId) rafId = requestAnimationFrame(tick);
});

function staticPass(){
  // reduced motion: one static frame of the full scene, no loop. dt=0 draws
  // everything in place; t=0 gives per-star/per-ray fixed alphas via their phases.
  fctx.clearRect(0,0,W,H);
  fctx.drawImage(bg, 0, -parBG);
  drawSun(0);
  drawPlanets(0);
  drawStarLayer(starLayers[0], 0, 0);
  drawAsteroids(0);
  drawStarLayer(starLayers[1], 0, 0);
}
// scroll under reduced motion repaints the static frame (user-initiated motion only)
let staticQueued = false;
function queueStaticPass(){
  if(staticQueued) return;
  staticQueued = true;
  requestAnimationFrame(()=>{ staticQueued = false; staticPass(); });
}

window.__space = { seed:SEED, planets, nebulae, asteroids, sun, starLayers, loaded };   // debug handle

/* ---------- boot: stars first paint, art fills in as it loads ---------- */
layout();
if(!REDUCED) rafId = requestAnimationFrame(tick);

const artSrcs = [SP+'haze.jpg', ...AST_SRCS, ...SHIP_SRCS];
for(const p of planets){
  artSrcs.push(p.def.tex);
  if(p.def.rings) artSrcs.push(...p.def.rings);
  if(p.def.clouds) artSrcs.push(p.def.clouds);
  if(p.def.moon) artSrcs.push(p.def.moon);
}
for(const src of artSrcs){
  load(src).then(()=>{ paintBG(); });   // offscreen buffer; next tick blits it
}
if(REDUCED){
  Promise.all(artSrcs.map(s=>load(s))).then(()=>{
    requestAnimationFrame(()=>{ paintBG(); staticPass(); });
  });
}

})();
