# Astronaut mascot 3D studio

A static, responsive viewer for an actual Blender-built astronaut mascot.
The model is exported from the editable Blender source, with its original
evaluated geometry and materials. No studio or reference image is included.

## Preview

Serve this folder with any static HTTP server, then open `index.html`.
For example: `python3 -m http.server 8000`.
The page is also ready for GitHub Pages at a project subpath: all URLs are relative.

Controls include drag/touch orbit, wheel/pinch zoom, front/side/back views,
reset, zoom buttons and optional auto-rotation. The default rotation is off.
Reduced-motion preferences are respected. A real Blender-rendered poster is
shown while loading and as a fallback if the 3D viewer is unavailable.
Browsers without WebGL 2 display that poster with interactive controls disabled.

## Files

- `index.html`, `style.css`, `app.js`: interface
- `astronaut-mascot.glb`: actual model, including editable IP lettering converted to mesh
- `mascot-preview.webp`: Blender-rendered poster
- `model-viewer.min.js`: pinned Google model-viewer 4.3.1
- `LICENSE-model-viewer.txt`: Apache 2.0 license
- `THIRD-PARTY-NOTICES.txt`: notices and licenses for bundled dependencies
- `favicon.svg`, `.nojekyll`: static hosting support

No login, paid APIs, analytics, external fonts or runtime CDN requests are required.
All render and library assets are served from this project.

## Credits

The model was created in Blender 4.3.2. Interactive viewing uses Google's
[model-viewer](https://modelviewer.dev/), licensed under Apache 2.0.

This is a multi-part static character, not an animation or deformation-rigged asset.

## Licensing scope

`LICENSE-model-viewer.txt` applies only to the vendored Google model-viewer
library. Bundled dependency licenses are listed in `THIRD-PARTY-NOTICES.txt`.
No license has been specified for the original mascot asset or interface code;
the vendor license does not license those original project files.
