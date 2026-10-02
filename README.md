# Astronaut mascot preview

A responsive static viewer for an actual Blender-built reconstruction of the supplied mascot concept. Drag to rotate, pinch or scroll to zoom, and use front/side/back, reset and auto-rotate controls. It uses no paid API, analytics or login.

This is reference reconstruction revision 6, not a claim of pixel-perfect or identical 3D identity from a 2D drawing. Materials use warm cream/porcelain, satin blue, brown eyes and peach cheeks. The hero wave/tablet pose follows the large concept image.

## Hosting

Upload every file in this flat directory to the same GitHub Pages folder. All paths are relative and support a project Pages base. `.nojekyll` is included.

## Rendering and validation

`astronaut-mascot.glb` contains mascot geometry and materials only. The source .blend, reference sheet, personal files and credentials are excluded. The real Blender-rendered `mascot-preview.webp` remains visible when WebGL cannot initialize.

The GLB was exported from the actual editable .blend, its color/roughness/metallic/specular factors checked numerically, and geometry re-imported into Blender for a real render. Browser rendering can still vary because PBR implementations and perspective differ. The cloud browser has WebGL disabled, so actual GPU interactivity must not be falsely described as fully tested there.

The viewer uses the same technical studio HDR as Blender, linear tone mapping and exposure 0.4, matching Blender Standard transform and world strength 0.4. Exact concept illumination and unseen depth were not supplied.

## Licensing scope

`LICENSE-model-viewer.txt` and `THIRD-PARTY-NOTICES.txt` apply only to the vendored Google model-viewer package and its dependencies. Apache-2.0 does not license the original mascot assets or interface. No new license for those original assets has been specified.

Revision 5 changes only the raised arm to a compact, straighter diagonal wave, with the cuff and mitten aligned. Palette, other geometry, camera and shared lighting were checked against the previous revision and preserved.

Revision 6 is an evidence-bounded refinement with a nearer/larger wave mitten, upright wrist, reduced face/rim profile depth and same-palette feathered pigment via standard vertex color. The exact source mesh, camera and lighting were not supplied; no exact all-view identity is claimed.
