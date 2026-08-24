import type { PerspectiveCamera, WebGLRenderer } from "three";

function setSize(container: HTMLDivElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  readonly onWindowResize: () => void;

  constructor(container: HTMLDivElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    // set initial size
    setSize(container, camera, renderer);

    this.onWindowResize = () => {
      setSize(container, camera, renderer);
      this.onResize();
    };

    window.addEventListener('resize', this.onWindowResize)
  }

  // Defined in BallTargets
  onResize() {}

  dispose() {
    window.removeEventListener('resize', this.onWindowResize);
  }
}

export { Resizer };