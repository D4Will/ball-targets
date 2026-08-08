import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLights } from "./components/lights";
import { Target } from "./components/Target";

import { Loop } from "./systems/Loop";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Controls } from "./components/controls";

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

    const target = new Target(3, 1.5);
    const lights = createLights();
    const controls = new Controls(this.camera, this.renderer.domElement);

    this.scene.add(target, ...lights);
    this.loop.add(target, controls);

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