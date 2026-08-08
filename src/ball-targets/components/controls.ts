import { Raycaster, Vector3, type PerspectiveCamera } from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';

export class Controls extends PointerLockControls {
  raycast: Raycaster;

  constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
    super(camera, canvas);
    this.raycast = new Raycaster();
    this.raycast.far = 50;

    canvas.addEventListener('click', () => {
      if (!this.isLocked) {
        this.lock();
      } else {
        this.handleFire(camera);
      }
    })

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (this.isLocked) {
          this.unlock();
        }
      }
    })
  }
  
  handleFire(camera: PerspectiveCamera) {
    const origin = camera.position;
    const vector = new Vector3();
    const direction = this.getDirection(vector);

    this.raycast.set(origin, direction);
    
  }

  tick(delta: number) {
    this.update(delta);
  }
}