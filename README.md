# Astronaut mascot preview

Interactive revision 20 of the Blender-built mascot reconstruction. Drag to rotate, pinch or scroll to zoom, and use the front, side, back, reset and auto-rotate controls. No paid API, analytics or login is required.

The reconstruction follows the supplied reference views. Subtle contact-tone vertex colors approximate the observed soft shading on the face and holding glove. Face contour, both hands, ear attachment, boot contact, helmet crown and antenna placement have been revised. It remains an approximation: the original 3D mesh, camera, lighting and unseen surfaces were not supplied. No exact identity or similarity percentage is claimed.

## Assets and rendering

- `astronaut-mascot-v20.glb` contains the actual exported mascot geometry and materials, including feathered cheek and soft contact-tone vertex colors.
- `studio-lighting-v20.hdr` contains the revised studio illumination. Its query-free `.hdr` filename avoids incorrect HDRJPG loader selection.
- Both the authoring preview and viewer use that HDR with PBR Neutral tone mapping and exposure/strength 1. All Blender area lights are disabled in the final scene.
- `mascot-preview-v20.webp` is a real render of the re-imported GLB, retained as a clearly labelled static fallback when WebGL cannot initialize.

Material base color, roughness, metallic and specular factors are checked against the source. The GLB is re-imported and its world bounds verified before rendering. Browser PBR, perspective and shadows can still differ from Blender; an offline render is not proof of browser GPU acceptance.

The editable source and supplied reference sheet are not embedded in the public GLB. Previous versioned assets and Git history remain available.

## Hosting

All file paths are relative and support the existing GitHub Pages project base. Keep the bundled model-viewer script and its notices alongside the viewer files.

## Licensing

`LICENSE-model-viewer.txt` and `THIRD-PARTY-NOTICES.txt` cover the vendored Google model-viewer package and dependencies only. They do not grant a new license for the original mascot assets or interface.
