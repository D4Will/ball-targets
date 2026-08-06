import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLights } from "./components/lights";
import { Target } from "./components/Target";

import { Loop } from "./systems/Loop";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";

class BallTargets {
  readonly camera: PerspectiveCamera;
  readonly scene: Scene;
  readonly renderer: WebGLRenderer;
  readonly loop: Loop;

  constructor(container: HTMLDivElement) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    container.append(this.renderer.domElement);

    const target = new Target();
    const light = createLights();
    this.scene.add(target, light);
    this.loop.add(target);

    new Resizer(container, this.camera, this.renderer);
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { BallTargets };