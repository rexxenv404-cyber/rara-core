// Floating emoji background
(function () {
  const wrap = document.createElement('div');
  wrap.className = 'floaties';
  const icons = ['🎈', '🎀', '💖', '✨', '🎂', '🌸', '🎉', '⭐'];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.textContent = icons[i % icons.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 18 + Math.random() * 22 + 'px';
    s.style.animationDuration = 9 + Math.random() * 12 + 's';
    s.style.animationDelay = -Math.random() * 20 + 's';
    wrap.appendChild(s);
  }
  document.body.prepend(wrap);
})();

// Confetti
const Confetti = (function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let pieces = [], running = false;
  const colors = ['#ff6fa5', '#ffc857', '#b69cff', '#7fd8be', '#ff8a65', '#ffffff'];

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  addEventListener('resize', resize); resize();

  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
      pieces.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
        r: Math.random() * 6, vr: (Math.random() - .5) * .4,
        c: colors[(Math.random() * colors.length) | 0], life: 0
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.vy += .25; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    pieces = pieces.filter(p => p.y < canvas.height + 30 && p.life < 260);
    if (pieces.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  function rain(ms) {
    const end = Date.now() + ms;
    (function loop() {
      burst(Math.random() * canvas.width, -10, 6);
      if (Date.now() < end) setTimeout(loop, 120);
    })();
  }

  return { burst, rain };
})();

// Click / tap anywhere on elements with data-confetti
document.addEventListener('click', e => {
  if (e.target.closest('[data-confetti]')) Confetti.burst(e.clientX, e.clientY, 90);
});

// Auto celebration on load for pages that ask for it
if (document.body.dataset.celebrate === 'true') {
  setTimeout(() => Confetti.rain(2500), 500);
}
