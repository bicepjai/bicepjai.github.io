// Classic Matrix Digital Rain - Dense curtain style
// Controllable via toggle button
(function() {
  'use strict';

  // Matrix character set: half-width katakana + kanji-like + symbols
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ日月火水木金土山川田中村上下左右大小中高低長短古新明暗0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*+=-:<>|_.';

  let canvas, ctx;
  let columns = [];
  let fontSize = 14;
  let animationId;
  let lastTime = 0;
  let isRunning = false;
  const frameInterval = 33; // ~30fps instead of 60fps (half speed)

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize column positions - each column tracks Y position
    const numColumns = Math.ceil(canvas.width / fontSize);
    columns = [];
    for (let i = 0; i < numColumns; i++) {
      // Random starting positions spread across the screen
      columns.push(Math.random() * canvas.height);
    }

    // Fill with black
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw(timestamp) {
    if (!isRunning) return;

    // Throttle frame rate for slower, cleaner animation
    if (timestamp - lastTime < frameInterval) {
      animationId = requestAnimationFrame(draw);
      return;
    }
    lastTime = timestamp;

    // Very subtle fade - creates long trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < columns.length; i++) {
      // Random character
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = columns[i];

      // Vary brightness per column for depth effect
      const brightness = 0.4 + Math.random() * 0.6;

      // Draw glowing head character
      ctx.shadowColor = '#0F0';
      ctx.shadowBlur = 8;

      // Bright head (white-green)
      ctx.fillStyle = `rgba(180, 255, 180, ${brightness})`;
      ctx.fillText(char, x, y);

      // Draw a second character slightly behind with less glow
      if (Math.random() > 0.5) {
        ctx.shadowBlur = 4;
        ctx.fillStyle = `rgba(0, 255, 70, ${brightness * 0.7})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);
      }

      // Occasionally draw extra characters in the trail for density
      if (Math.random() > 0.7) {
        ctx.shadowBlur = 2;
        ctx.fillStyle = `rgba(0, 255, 50, ${Math.random() * 0.5})`;
        const extraY = y - fontSize * (2 + Math.floor(Math.random() * 5));
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, extraY);
      }

      // Reset shadow
      ctx.shadowBlur = 0;

      // Move column down
      columns[i] += fontSize;

      // Random reset - some columns reset early, some go further
      if (columns[i] > canvas.height && Math.random() > 0.98) {
        columns[i] = -fontSize * Math.floor(Math.random() * 20);
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  function handleResize() {
    clearTimeout(handleResize.timeout);
    handleResize.timeout = setTimeout(resizeCanvas, 250);
  }

  function handleVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else if (isRunning) {
      animationId = requestAnimationFrame(draw);
    }
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    resizeCanvas();
    animationId = requestAnimationFrame(draw);
    updateToggle(true);
    localStorage.setItem('matrixRainEnabled', 'true');
  }

  function stop() {
    isRunning = false;
    cancelAnimationFrame(animationId);
    // Keep black background, just clear the rain
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateToggle(false);
    localStorage.setItem('matrixRainEnabled', 'false');
  }

  function toggle() {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }

  function updateToggle(active) {
    const toggle = document.getElementById('matrix-toggle');
    if (toggle) {
      toggle.checked = active;
    }
  }

  function init() {
    createCanvas();
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    // Check localStorage for saved preference
    const saved = localStorage.getItem('matrixRainEnabled');
    if (saved === 'true') {
      start();
    }
  }

  // Expose API globally
  window.MatrixRain = {
    start: start,
    stop: stop,
    toggle: toggle,
    isRunning: function() { return isRunning; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
