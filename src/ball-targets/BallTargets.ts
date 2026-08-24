import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLights } from "./components/lights";

import { Loop } from "./systems/Loop";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/Resizer";

import {
  Mesh,
  type Material,
  type PerspectiveCamera,
  type Scene,
  type Texture,
  type WebGLRenderer,
} from "three";
import { Controls } from "./components/controls";
import { Structure } from "./components/map";
import { BounceTrack } from "./components/bounceTrack";

class BallTargets {
  readonly camera: PerspectiveCamera;
  readonly scene: Scene;
  readonly renderer: WebGLRenderer;
  readonly loop: Loop;
  readonly container: HTMLDivElement;
  readonly controls: Controls;
  readonly resizer: Resizer;
  readonly handleClick: () => void;
  readonly handleKeyDown: (event: KeyboardEvent) => void;

  disposed = false;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    container.append(this.renderer.domElement);

    const structure = new Structure();
    // const gameGroup = new GridShot();
    const gameGroup = new BounceTrack();
    gameGroup.position.z = -10;
    const lights = createLights();
    this.controls = new Controls(this.camera, this.renderer.domElement);

    this.handleClick = () => {
      if (!this.controls.isLocked) {
        this.controls.lock();
      } else {
        const hits = this.controls.getHits(this.camera, gameGroup.children);
        gameGroup.handleHit(hits);
      }
    };

    this.handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (this.controls.isLocked) {
          this.controls.unlock();
        }
      }
    };

    container.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKeyDown);

    this.scene.add(structure, gameGroup, ...lights);
    this.loop.add(gameGroup, this.controls);

    this.resizer = new Resizer(container, this.camera, this.renderer);
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

  dispose() {
    if (this.disposed) {
      return;
    }

    this.stop();
    this.disposed = true;

    this.container.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    this.resizer.dispose();

    this.controls.unlock();
    this.controls.disconnect();
    this.loop.updatables.length = 0;

    this.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.geometry.dispose();
        this.disposeMaterial(object.material);
      }
    });

    if (this.scene.background && "dispose" in this.scene.background) {
      (this.scene.background as Texture).dispose();
    }

    if (this.scene.environment) {
      this.scene.environment.dispose();
    }

    this.scene.clear();

    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();

    this.renderer.domElement.remove();
  }

  disposeMaterial(material: Material | Material[]) {
    if (Array.isArray(material)) {
      for (const mat of material) {
        this.disposeMaterial(mat);
      }
      return;
    }

    for (const value of Object.values(material)) {
      if (value && typeof value === "object" && "isTexture" in value) {
        (value as Texture).dispose();
      }
    }

    material.dispose();
  }
}

export { BallTargets };