/* Solar Aces — text/scroll/video juice effects */
'use strict';
(function(){
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- gameplay video: light up both slots only if the file exists ---------- */
const VIDEO_SRC = 'assets/gameplay-loop.mp4';
const panelVideo = document.getElementById('gameplay-video');
const heroVideo = document.querySelector('.hero-bg-video');
fetch(VIDEO_SRC, {method:'HEAD'}).then(r=>{
  if(!r.ok) return;
  document.body.classList.add('has-video');
  if(panelVideo){ panelVideo.src = VIDEO_SRC; if(!REDUCED) panelVideo.play().catch(()=>{}); }
  if(heroVideo && !REDUCED){ heroVideo.src = VIDEO_SRC; heroVideo.play().catch(()=>{}); }
}).catch(()=>{});

// click panel -> fullscreen (only once real footage is in)
const panel = document.querySelector('.gameplay-panel');
if(panel && panelVideo){
  panel.addEventListener('click', ()=>{
    if(!document.body.classList.contains('has-video')) return;
    (panelVideo.requestFullscreen || panelVideo.webkitEnterFullscreen || function(){}).call(panelVideo);
  });
}

if(REDUCED) return;   // everything below is motion

/* ---------- h1 boot glitch + periodic micro-glitch ---------- */
const h1 = document.querySelector('.hero h1');
if(h1){
  h1.classList.add('glitch');
  h1.dataset.text = h1.textContent.trim();
  const burst = ms=>{ h1.classList.add('glitching'); setTimeout(()=>h1.classList.remove('glitching'), ms); };
  setTimeout(()=>burst(420), 300);              // boot glitch
  (function scheduleMicro(){
    setTimeout(()=>{ burst(130); scheduleMicro(); }, 5500 + Math.random()*3500);
  })();
}

/* ---------- typing effect on tagline ---------- */
const tag = document.querySelector('.tagline');
if(tag){
  const full = tag.textContent.trim();
  tag.setAttribute('aria-label', full);
  tag.textContent = '';
  tag.classList.add('typing');
  let i = 0;
  const step = ()=>{
    tag.textContent = full.slice(0, ++i);
    if(i < full.length) setTimeout(step, 34 + Math.random()*40);
    else setTimeout(()=>tag.classList.remove('typing'), 2400);
  };
  setTimeout(step, 650);
}

})();
