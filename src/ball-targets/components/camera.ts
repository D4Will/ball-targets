import { PerspectiveCamera } from "three";

function createCamera(): PerspectiveCamera {
  const camera = new PerspectiveCamera(
    75, // FOV
    1, // Aspect Ratio
    0.1, // Near clipping plane
    300, // Far clipping plane
  );

  camera.position.set(0, 0, 10);

  return camera;
}

export { createCamera };
