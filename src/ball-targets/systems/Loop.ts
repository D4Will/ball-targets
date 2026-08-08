import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import type { Updatable } from "../components/types";
import { Timer } from "three";

const timer = new Timer();
timer.connect(document);

class Loop {
  readonly camera: PerspectiveCamera;
  readonly scene: Scene;
  readonly renderer: WebGLRenderer;
  readonly updatables: Updatable[];

  constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, updateables: Updatable[] = []) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = updateables;
  }

  add(...objs: Updatable[]) {
    for (const obj of objs) {
      this.updatables.push(obj);
    }
  }

  start() {
    this.renderer.setAnimationLoop((time) => {
      // update timer
      timer.update(time);
      const delta = timer.getDelta();
      // update all objects in updatables
      this.tick(delta);
      // render next frame
      this.renderer.render(this.scene, this.camera);
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick(delta: number) {
    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };