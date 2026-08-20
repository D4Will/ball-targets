import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLights } from "./components/lights";

import { Loop } from "./systems/Loop";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

import { type PerspectiveCamera, type Scene, type WebGLRenderer } from "three";
import { Controls } from "./components/controls";
import { GridShot } from "./components/gridShot";
import { Structure } from "./components/map";
import { BounceTrack } from "./components/bounceTrack";

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

    const structure = new Structure();
    // const gameGroup = new GridShot(10, { targetRadius: .5, activeTargetCount: 2 });
    const gameGroup = new BounceTrack(10);
    const lights = createLights();
    const controls = new Controls(this.camera, this.renderer.domElement);

    container.addEventListener('click', () => {
      if (!controls.isLocked) {
        controls.lock();
      } else {
        const hits = controls.getHits(this.camera, gameGroup.children);
        gameGroup.handleHit(hits);
      }
    })

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (controls.isLocked) {
          controls.unlock();
        }
      }
    })

    this.scene.add(structure, gameGroup, ...lights);
    this.loop.add(gameGroup, controls);

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