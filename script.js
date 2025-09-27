/* ============================
   Global: helper & DOM-ready
   ============================ */
(function(){
  'use strict';

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  /* ---------- THEME TOGGLE + PERSIST ---------- */
  const themeBtn = $('#theme-toggle');
  if (themeBtn) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.toggle('light-theme', savedTheme === 'light');
      const icon = themeBtn.querySelector('i');
      icon.classList.toggle('fa-sun', savedTheme === 'light');
      icon.classList.toggle('fa-moon', savedTheme !== 'light');
    }

    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      const icon = themeBtn.querySelector('i');
      icon.classList.toggle('fa-sun', isLight);
      icon.classList.toggle('fa-moon', !isLight);
    });
  }

  /* ---------- YEAR in footer ---------- */
  const yr = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = yr;

  /* ============================
     TYPEWRITER
     ============================ */
  (function typewriter(){
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    const phrases = ['Software Engineer','Frontend Software Engineer', 'FullStack Software Developer'];
    let p = 0, i = 0, deleting = false;
    function tick(){
      const full = phrases[p];
      if (!deleting) {
        i++; el.textContent = full.slice(0, i);
        if (i === full.length) { deleting = true; setTimeout(tick, 1200); return; }
      } else {
        i--; el.textContent = full.slice(0, i);
        if (i === 0) { deleting = false; p = (p + 1) % phrases.length; setTimeout(tick, 300); return; }
      }
      setTimeout(tick, deleting ? 60 : 110);
    }
    tick();
  })();

  /* ============================
     CUSTOM CURSOR
     ============================ */
  (function cursor(){
    const cursor = $('#cursor');
    const core = cursor && cursor.querySelector('.cursor-core');
    const glow = cursor && cursor.querySelector('.cursor-glow');
    if (!cursor || !core || !glow) return;
    let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
    let pos = { x: mouse.x, y: mouse.y };

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function tick(){
      pos.x += (mouse.x - pos.x) * 0.22;
      pos.y += (mouse.y - pos.y) * 0.22;
      cursor.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      requestAnimationFrame(tick);
    }
    tick();

    const interactive = ['a','button','.btn','.project-card','.skill','.orbit-item'];
    interactive.forEach(sel => {
      $$(sel).forEach(el=>{
        el.addEventListener('mouseenter', ()=> { glow.style.transform = 'scale(1.6)'; core.style.transform = 'scale(1.2)'; });
        el.addEventListener('mouseleave', ()=> { glow.style.transform = 'scale(1)'; core.style.transform = 'scale(1)'; });
      });
    });
  })();

  /* ============================
     PARTICLE NETWORK BACKGROUND
     ============================ */
  (function particleNet(){
    const canvas = $('#bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let DPR = window.devicePixelRatio || 1;

    function resize(){
      DPR = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    resize();
    window.addEventListener('resize', resize);

    let particles = [];
    const COUNT = 70;
    for (let i=0;i<COUNT;i++){
      particles.push({
        x: Math.random()*window.innerWidth,
        y: Math.random()*window.innerHeight,
        vx: (Math.random()-0.5)*1.2,
        vy: (Math.random()-0.5)*1.2,
        r: Math.random()*2+1
      });
    }

    function draw(){
      ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
      for (let i=0;i<particles.length;i++){
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>window.innerWidth) p.vx*=-1;
        if (p.y<0||p.y>window.innerHeight) p.vy*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(0,247,255,0.7)";
        ctx.shadowBlur=6;
        ctx.shadowColor="#00f7ff";
        ctx.fill();

        for (let j=i+1;j<particles.length;j++){
          let p2=particles[j];
          let dist=Math.hypot(p.x-p2.x,p.y-p2.y);
          if (dist<100){
            ctx.beginPath();
            ctx.moveTo(p.x,p.y);
            ctx.lineTo(p2.x,p2.y);
            ctx.strokeStyle=`rgba(255,0,255,${0.5-dist/200})`;
            ctx.lineWidth=0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ============================
     CLICK SPARKLE BURST
     ============================ */
  (function clickBurst(){
    const container = document.getElementById('click-dots-container');
    if (!container) return;

    function makeDot(x,y){
      const dot = document.createElement('div');
      dot.className = 'click-dot';
      const size = (Math.random()*6) + 4;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${x - size/2}px`;
      dot.style.top = `${y - size/2}px`;
      const hue = Math.floor(Math.random()*360);
      dot.style.background = `radial-gradient(circle at 30% 30%, #fff, hsl(${hue} 90% 60% / .95))`;
      container.appendChild(dot);
      return {el: dot, size, hue};
    }

    function animateDot(dotObj, vx, vy){
      const el = dotObj.el;
      let x = parseFloat(el.style.left);
      let y = parseFloat(el.style.top);
      let alpha = 1;
      function frame(){
        x += vx; y += vy;
        vx *= 0.98; vy *= 0.98;
        alpha -= 0.02;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = alpha;
        if (alpha <= 0) { el.remove(); return; }
        requestAnimationFrame(frame);
      }
      frame();
    }

    document.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (['input','textarea','button','a','label'].includes(tag)) return;
      const count = 18;
      for (let i=0;i<count;i++){
        const angle = Math.random()*Math.PI*2;
        const speed = (Math.random()*4) + 1.5;
        const vx = Math.cos(angle)*speed;
        const vy = Math.sin(angle)*speed;
        const dot = makeDot(e.clientX, e.clientY);
        animateDot(dot, vx, vy);
      }
    });
  })();

  /* ============================
     SKILLS
     ============================ */
  (function skillsPause(){
    const carousel = $('#skills-carousel');
    if (!carousel) return;
    carousel.addEventListener('mouseenter', ()=> carousel.classList.add('paused'));
    carousel.addEventListener('mouseleave', ()=> carousel.classList.remove('paused'));
  })();

  /* ============================
     ORBIT ICONS ROTATION
     ============================ */
  (function orbitRotate(){
    const orbit = document.querySelector('.orbit-icons');
    if (!orbit) return;
    let angle = 0;
    function spin(){
      angle = (angle + 0.04) % 360;
      orbit.style.transform = `rotate(${angle}deg)`;
      document.querySelectorAll('.orbit-item').forEach(item=>{
        const baseAngle = parseFloat(item.style.getPropertyValue('--angle')) || 0;
        item.style.transform = `rotate(${baseAngle}deg) translateX(120px) rotate(${-angle}deg)`;
      });
      requestAnimationFrame(spin);
    }
    spin();
  })();

  /* ============================
     Scroll Reveal
     ============================ */
  (function scrollReveal(){
    const sections = $$('section');
    window.addEventListener('scroll', () => {
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) sec.classList.add('visible');
      });
    });
  })();

  /* ============================
     Smooth Scroll
     ============================ */
  (function scrollSmooth(){
    $$('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href==='#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
  })();

  /* ============================
     Contact form submit
     ============================ */
  (function contactSubmit(){
    const form = document.querySelector('.contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], .btn.primary');
      const old = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(()=>{ 
        btn.textContent = 'Sent ✓'; form.reset(); 
        setTimeout(()=>{ btn.textContent = old; btn.disabled = false; }, 1400); 
      }, 900);
    });
  })();

  /* ============================
     Glitch Text
     ============================ */
  (function glitch(){
    const glitchEl = document.querySelector('.glitch');
    if (!glitchEl) return;

    function triggerGlitch(){
      glitchEl.classList.add('glitch-active');
      setTimeout(()=> glitchEl.classList.remove('glitch-active'), 400);
    }

    glitchEl.addEventListener('mouseenter', triggerGlitch);

    setInterval(()=>{
      if (Math.random() < 0.25) {
        triggerGlitch();
      }
    }, 2000);
  })();

})(); // end IIFE
