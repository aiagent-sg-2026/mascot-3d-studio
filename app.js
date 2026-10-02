(() => {
  'use strict';
  const viewer = document.getElementById('mascot');
  const stage = document.getElementById('stage');
  const status = document.getElementById('load-status');
  const fallback = document.getElementById('fallback');
  const error = document.getElementById('error-message');
  const hint = document.getElementById('stage-hint');
  const progress = document.getElementById('progress-fill');
  const rotate = document.getElementById('auto-rotate');
  const controls = [...document.querySelectorAll('.view-button, #reset, #auto-rotate, #zoom-in, #zoom-out')];
  const views = { front: '0deg 90deg 110%', side: '90deg 90deg 110%', back: '180deg 90deg 110%' };
  const home = '-16.7deg 85.3deg 10.5m';
  let loaded = false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let webglSupported = false;
  try {
    const probe = document.createElement('canvas');
    webglSupported = !!probe.getContext('webgl2');
  } catch (_) { webglSupported = false; }
  function setRotation(on) {
    const allowed = !!on && !reduced.matches;
    viewer.autoRotate = allowed;
    rotate.setAttribute('aria-pressed', String(allowed));
    document.getElementById('rotate-label').textContent = allowed ? 'Auto-rotate on' : 'Auto-rotate off';
  }
  function clearViews() {
    document.querySelectorAll('.view-button').forEach(button => button.setAttribute('aria-pressed', 'false'));
  }
  function fail(message = 'The 3D view couldn’t load. The Blender-rendered preview is still here.') {
    loaded = false;
    stage.setAttribute('aria-busy', 'false');
    status.textContent = 'Rendered preview';
    fallback.hidden = false;
    error.hidden = false;
    error.querySelector('p').textContent = message;
    hint.hidden = true;
    viewer.style.visibility = 'hidden';
    controls.forEach(button => button.disabled = true);
    setRotation(false);
  }
  viewer.addEventListener('progress', event => {
    progress.style.width = `${Math.round((event.detail?.totalProgress || 0) * 100)}%`;
  });
  function showLive() {
    if (!webglSupported) { fail('This browser can’t display interactive 3D. Here’s the Blender-rendered preview.'); return; }
    // model-viewer retains a hidden 2D canvas before its visible WebGL canvas.
    // Accept whichever canvas actually rendered, rather than the first node.
    const canvases = [...(viewer.shadowRoot?.querySelectorAll('canvas') || [])];
    const hasVisibleCanvas = canvases.some(canvas => {
      const rect = canvas.getBoundingClientRect();
      return canvas.width > 0 && canvas.height > 0 && rect.width > 0 && rect.height > 0;
    });
    if (!hasVisibleCanvas) {
      fail('Interactive 3D couldn’t start in this browser. Here’s the Blender-rendered preview.');
      return;
    }
    loaded = true;
    stage.setAttribute('aria-busy', 'false');
    status.textContent = 'Live 3D';
    fallback.hidden = true;
    error.hidden = true;
    hint.hidden = false;
    viewer.style.visibility = 'visible';
    controls.forEach(button => button.disabled = false);
    rotate.disabled = reduced.matches;
    rotate.title = reduced.matches ? 'Auto-rotate is off because reduced motion is enabled on your device' : '';
  }
  viewer.addEventListener('load', () => window.requestAnimationFrame(showLive));
  viewer.addEventListener('error', () => fail());
  document.querySelectorAll('.view-button').forEach(button => {
    button.addEventListener('click', () => {
      if (!loaded) return;
      setRotation(false);
      clearViews();
      button.setAttribute('aria-pressed', 'true');
      viewer.cameraTarget = 'auto auto auto';
      viewer.cameraOrbit = views[button.dataset.view];
      viewer.resetTurntableRotation?.(0);
      if (reduced.matches) viewer.jumpCameraToGoal();
    });
  });
  document.getElementById('reset').addEventListener('click', () => {
    if (!loaded) return;
    setRotation(false);
    clearViews();
    viewer.resetTurntableRotation?.(0);
    viewer.cameraTarget = '0m 2.24m 0m';
    viewer.cameraOrbit = home;
    viewer.fieldOfView = '28deg';
    if (reduced.matches) viewer.jumpCameraToGoal();
  });
  rotate.addEventListener('click', () => setRotation(rotate.getAttribute('aria-pressed') !== 'true'));
  document.getElementById('zoom-in').addEventListener('click', () => { if (loaded) viewer.zoom(2); });
  document.getElementById('zoom-out').addEventListener('click', () => { if (loaded) viewer.zoom(-2); });
  viewer.addEventListener('camera-change', event => {
    if (event.detail?.source === 'user-interaction') clearViews();
  });
  viewer.addEventListener('keydown', event => {
    if (!loaded || !['+', '=', '-', '_'].includes(event.key)) return;
    event.preventDefault();
    viewer.zoom(['+', '='].includes(event.key) ? 1 : -1);
  });
  reduced.addEventListener('change', () => {
    setRotation(false);
    rotate.disabled = reduced.matches || !loaded;
    rotate.title = reduced.matches ? 'Auto-rotate is off because reduced motion is enabled on your device' : '';
  });
  document.getElementById('retry').addEventListener('click', () => {
    if (!webglSupported || !customElements.get('model-viewer')) { window.location.reload(); return; }
    error.hidden = true;
    status.textContent = 'Loading 3D…';
    stage.setAttribute('aria-busy', 'true');
    viewer.src = `./astronaut-mascot.glb?retry=${Date.now()}`;
  });
  if (!webglSupported) {
    fail('This browser can’t display interactive 3D. Here’s the Blender-rendered preview.');
  } else {
    const library = document.createElement('script');
    library.type = 'module';
    library.src = './model-viewer.min.js';
    library.id = 'viewer-library';
    library.addEventListener('error', () => fail());
    library.addEventListener('load', () => {
      if (!customElements.get('model-viewer')) fail();
    });
    document.head.appendChild(library);
  }
})();
