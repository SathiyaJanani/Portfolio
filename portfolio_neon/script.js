// ══════════════════════════════
//  PHOTO
// ══════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('heroPhoto');
  if (typeof PHOTO_B64 !== 'undefined' && PHOTO_B64) {
    img.src = 'data:image/png;base64,' + PHOTO_B64;
  }
});

// ══════════════════════════════
//  NEON MOUSE LIGHTING EFFECT
//  (on photo + global halo)
// ══════════════════════════════
(function() {
  const outer = document.getElementById('photoOuter');
  const wrap  = document.getElementById('photoWrap');
  const glow  = document.getElementById('photoGlow');
  const spot  = document.getElementById('photoSpotlight');
  if (!outer || !wrap) return;

  document.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);

    // Neon cyan-magenta glow shifts with mouse
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${px}% ${py}%,
        rgba(0,255,255,.3) 0%,
        rgba(255,0,170,.12) 40%,
        transparent 70%)`;
    }

    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = 500;
    const intensity = Math.max(0, 1 - dist / maxDist);

    if (spot) {
      spot.style.background = `radial-gradient(circle at ${px}% ${py}%,
        rgba(0,255,255,${(0.25 * intensity).toFixed(2)}) 0%,
        rgba(255,0,170,${(0.1 * intensity).toFixed(2)}) 40%,
        transparent 70%)`;
      spot.style.opacity = intensity > 0.03 ? '1' : '0';
    }

    // 3D parallax tilt
    const tiltX = (dy / 300) * 8;
    const tiltY = -(dx / 300) * 8;
    outer.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  outer.addEventListener('mouseleave', () => {
    outer.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    if (spot) spot.style.opacity = '0';
  });
})();

// ══════════════════════════════
//  NEON PARTICLE RAIN BACKGROUND
//  (replaces aurora canvas)
// ══════════════════════════════
(function() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Vertical glowing lines (digital rain effect)
  const cols = Math.floor(W / 28);
  const drops = Array.from({ length: cols }, () => Math.random() * H);
  const colColors = Array.from({ length: cols }, () =>
    Math.random() < 0.6 ? '0,255,255' : (Math.random() < 0.5 ? '255,0,170' : '170,255,0')
  );

  // Floating orbs (neon glows)
  const orbs = [
    { x:0.15, y:0.3, r:0.3, c:'0,255,255', spd:0.00025 },
    { x:0.75, y:0.65, r:0.28, c:'255,0,170', spd:0.0003 },
    { x:0.5, y:0.1, r:0.22, c:'0,100,255', spd:0.0002 },
    { x:0.85, y:0.2, r:0.18, c:'170,255,0', spd:0.00035 },
  ];
  let t = 0;

  function drawOrbs() {
    orbs.forEach((o, i) => {
      const cx = (o.x + Math.sin(t * o.spd * 1000 + i) * 0.12) * W;
      const cy = (o.y + Math.cos(t * o.spd * 1000 + i * 2) * 0.1) * H;
      const r  = o.r * Math.min(W, H);
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${o.c},.09)`);
      g.addColorStop(1, `rgba(${o.c},0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
  }

  function drawGrid() {
    // Subtle perspective grid
    ctx.strokeStyle = 'rgba(0,255,255,0.04)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawRain() {
    ctx.font = '14px "DM Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      const chars = ['0','1','|','/','-','▲','◆','*','#'];
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const alpha = 0.06 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(${colColors[i]},${alpha})`;
      ctx.fillText(ch, i * 28, drops[i]);
      drops[i] += 18;
      if (drops[i] > H) drops[i] = Math.random() * -200;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawOrbs();
    drawRain();
    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ══════════════════════════════
//  GLOBAL NEON CURSOR GLOW
// ══════════════════════════════
(function() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function lerp() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(lerp);
  })();
})();

// ══════════════════════════════
//  TYPING
// ══════════════════════════════
const roles = [
  'CSE Student',
  'C++ Developer',
  'Web Developer',
  'Classical Dancer 💃',
  'Competitive Swimmer 🏊',
  'Problem Solver',
];
let rIdx = 0, cIdx = 0, del = false;
const roleEl = document.getElementById('typedRole');
function type() {
  if (!roleEl) return;
  const cur = roles[rIdx];
  roleEl.textContent = del ? cur.slice(0, --cIdx) : cur.slice(0, ++cIdx);
  if (!del && cIdx === cur.length) { del = true; setTimeout(type, 1800); return; }
  if (del && cIdx === 0) { del = false; rIdx = (rIdx + 1) % roles.length; }
  setTimeout(type, del ? 38 : 65);
}
setTimeout(type, 1200);

// ══════════════════════════════
//  NAV
// ══════════════════════════════
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ══════════════════════════════
//  COMMAND PANEL
// ══════════════════════════════
function toggleCmd() {
  document.getElementById('cmdBox').classList.toggle('open');
}
function cmdGo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('cmdBox').classList.remove('open');
}

// ══════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ══════════════════════════════
//  PROJECTS SCROLL
// ══════════════════════════════
let curProj = 0;
const totalProj = 2;

function scrollProjects(dir) {
  curProj = (curProj + dir + totalProj) % totalProj;
  updateProj();
}
function goToProject(i) { curProj = i; updateProj(); }
function updateProj() {
  document.getElementById('projectsTrack').style.transform =
    `translateX(calc(-${curProj * 100}% - ${curProj * 2}rem))`;
  document.querySelectorAll('.proj-dot').forEach((d, i) =>
    d.classList.toggle('active', i === curProj));
}

// Touch swipe
let tx0 = 0;
const track = document.getElementById('projectsTrack');
if (track) {
  track.addEventListener('touchstart', e => tx0 = e.touches[0].clientX, { passive:true });
  track.addEventListener('touchend', e => {
    const dx = tx0 - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) scrollProjects(dx > 0 ? 1 : -1);
  });
}

// ══════════════════════════════
//  CERT / RESUME VIEWER
// ══════════════════════════════
function openViewer(key) {
  if (typeof CERTS === 'undefined' || !CERTS[key]) return;
  const { data, mime } = CERTS[key];
  const modal = document.getElementById('viewerModal');
  const body  = document.getElementById('viewerBody');
  body.innerHTML = '';
  if (mime === 'application/pdf') {
    const bytes = atob(data);
    const buf = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
    const blob = new Blob([buf], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.src = url;
    body.appendChild(iframe);
  } else {
    const img = document.createElement('img');
    img.src = `data:${mime};base64,${data}`;
    img.alt = key;
    body.appendChild(img);
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeViewerOut(e) {
  if (e.target === document.getElementById('viewerModal')) closeViewer();
}
function closeViewer() {
  document.getElementById('viewerModal').classList.remove('open');
  document.getElementById('viewerBody').innerHTML = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeViewer(); });
