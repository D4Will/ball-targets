import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLights } from "./components/lights";

import { Loop } from "./systems/Loop";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

import { type PerspectiveCamera, type Scene, type WebGLRenderer } from "three";
import { Controls } from "./components/controls";
import { GridShotGroup } from "./components/group";
import { createBackground } from "./components/map";

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

    const background = createBackground(20, 10, 2);
    const gridGroup = new GridShotGroup(-2);
    const lights = createLights();
    const controls = new Controls(this.camera, this.renderer.domElement);

    container.addEventListener('click', () => {
      if (!controls.isLocked) {
        controls.lock();
      } else {
        const hits = controls.getHits(this.camera, gridGroup.children);
        gridGroup.handleHit(hits);
      }
    })

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (controls.isLocked) {
          controls.unlock();
        }
      }
    })



    this.scene.add(background, gridGroup, ...lights);
    this.loop.add(gridGroup, controls);

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