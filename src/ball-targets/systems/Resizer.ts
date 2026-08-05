import type { PerspectiveCamera, WebGLRenderer } from "three";

function setSize(container: HTMLDivElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container: HTMLDivElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    // set initial size
    setSize(container, camera, renderer);

    window.addEventListener('resize', () => {
      setSize(container, camera, renderer);
      this.onResize();
    })
  }

  // Defined in BallTargets
  onResize() {}
}

export { Resizer };