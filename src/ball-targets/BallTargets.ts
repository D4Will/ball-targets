import { createCamera } from "./components/camera";
import { createSphere } from "./components/sphere";
import { createScene } from "./components/scene";
import { createLights } from "./components/lights";

import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";
import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";

class BallTargets {
  readonly camera: PerspectiveCamera;
  readonly scene: Scene;
  readonly renderer: WebGLRenderer;

  constructor(container: HTMLDivElement) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    container.append(this.renderer.domElement);

    const cube = createSphere();
    this.scene.add(cube);

    const light = createLights();
    this.scene.add(light);

    const resizer = new Resizer(container, this.camera, this.renderer);
    resizer.onResize = () => {
      this.render();
    };
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}

export { BallTargets };