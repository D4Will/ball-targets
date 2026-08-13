import { Object3D, Raycaster, Vector3, type Intersection, type Object3DEventMap, type PerspectiveCamera } from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import type { Updatable } from './types';

export class Controls extends PointerLockControls implements Updatable {
  raycast: Raycaster;

  constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
    super(camera, canvas);
    this.raycast = new Raycaster();
    this.raycast.far = 50;
  }
  
  getHits(camera: PerspectiveCamera, objects: Object3D[]): Intersection<Object3D<Object3DEventMap>>[] {
    const origin = camera.position;
    const direction = this.getDirection(new Vector3());

    this.raycast.set(origin, direction);
    return this.raycast.intersectObjects(objects)
  }

  tick(delta: number) {
    this.update(delta);
  }
}