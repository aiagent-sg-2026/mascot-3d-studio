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
  const views = { front: '0deg 90deg 11.4m', side: '90deg 90deg 11.4m', back: '180deg 90deg 11.4m' };
  const home = '-16.7deg 85.3deg 11.4m';
  // Metre limits match index.html and keep button zoom independent of FOV.
  const minRadius = 5.8, maxRadius = 23.1;
  let zoomRadius = null;
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
    if (allowed) clearViews();
    rotate.setAttribute('aria-pressed', String(allowed));
    document.getElementById('rotate-label').textContent = allowed ? 'Auto-rotate on' : 'Auto-rotate off';
  }
  function clearViews() {
    document.querySelectorAll('.view-button').forEach(button => button.setAttribute('aria-pressed', 'false'));
  }
  function fail(message = 'The 3D view couldn’t load. The rendered preview is still here.') {
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
    if (!webglSupported) { fail('This browser can’t display interactive 3D. Here’s the rendered preview.'); return; }
    // model-viewer retains a hidden 2D canvas before its visible WebGL canvas.
    // Accept whichever canvas actually rendered, rather than the first node.
    const canvases = [...(viewer.shadowRoot?.querySelectorAll('canvas') || [])];
    const hasVisibleCanvas = canvases.some(canvas => {
      const rect = canvas.getBoundingClientRect();
      return canvas.width > 0 && canvas.height > 0 && rect.width > 0 && rect.height > 0;
    });
    if (!hasVisibleCanvas) {
      fail('Interactive 3D couldn’t start in this browser. Here’s the rendered preview.');
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
      zoomRadius = null;
      viewer.cameraTarget = '0m 2.28m 0m';
      viewer.fieldOfView = '28deg';
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
    viewer.cameraTarget = '0m 2.28m 0m';
    zoomRadius = 11.4;
    viewer.cameraOrbit = home;
    viewer.fieldOfView = '28deg';
    if (reduced.matches) viewer.jumpCameraToGoal();
  });
  rotate.addEventListener('click', () => setRotation(rotate.getAttribute('aria-pressed') !== 'true'));
  function zoomBy(direction) {
    if (!loaded) return;
    const orbit = viewer.getCameraOrbit();
    // Native zoom() changes both FOV and distance. Near a FOV limit that can
    // turn the first click after Reset into a large distance jump.
    zoomRadius = Math.max(minRadius, Math.min(maxRadius,
      (zoomRadius ?? orbit.radius) * Math.pow(1.1, direction)));
    viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${zoomRadius}m`;
    clearViews();
    if (reduced.matches) viewer.jumpCameraToGoal();
  }
  document.getElementById('zoom-in').addEventListener('click', () => zoomBy(-1));
  document.getElementById('zoom-out').addEventListener('click', () => zoomBy(1));
  viewer.addEventListener('camera-change', event => {
    const fromUser = event.detail?.source === 'user-interaction';
    if (fromUser) zoomRadius = null;
    if (fromUser || viewer.autoRotate) clearViews();
  });
  viewer.addEventListener('keydown', event => {
    if (!loaded || !['+', '=', '-', '_'].includes(event.key)) return;
    event.preventDefault();
    zoomBy(['+', '='].includes(event.key) ? -1 : 1);
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
    viewer.src = `./astronaut-mascot-v21.glb?retry=${Date.now()}`;
  });
  if (!webglSupported) {
    fail('This browser can’t display interactive 3D. Here’s the rendered preview.');
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
