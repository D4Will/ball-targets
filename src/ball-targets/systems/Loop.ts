import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import type { Updatable } from "../components/types";


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
    this.renderer.setAnimationLoop(() => {
      // update objects
      this.tick();
      // render next frame
      this.renderer.render(this.scene, this.camera);
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    for (const object of this.updatables) {
      object.tick();
    }
  }
}

export { Loop };