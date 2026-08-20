import { Group, Object3D, type Intersection, type Object3DEventMap } from "three";
import { Target } from "./Target";
import type { Updatable } from "./types";

type BounceConfig = {
  targetRadius: number,
  activeTargetCount: number,
  bounds: {
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
  },
  gravity: number,
};

export class BounceTrack extends Group implements Updatable {
  config: BounceConfig;

  constructor(
    distance: number,
    config?: Partial<BounceConfig>,
  ) {
    super();

    const defaultConfig: BounceConfig = {
      targetRadius: .5,
      activeTargetCount: 3,
      bounds: {
        xMin: -8,
        xMax: 8,
        yMin: -3,
        yMax: 20,
      },
      gravity: 10,
    }

    this.config = { ...defaultConfig, ...config };

    this.position.z = -1 * distance;
    
    // randomly add initial targets
    for (let i = 0; i < this.config.activeTargetCount; i++) {
      this.addTarget()
    }
  }

  // handles click input
  handleHit(hits: Intersection<Object3D<Object3DEventMap>>[]) {
    if (!hits.length) {
      return;
    }

    const hit = hits[0].object;
    this.removeTarget(hit);
  };

  // add target 
  addTarget(): void {
    let xVelocity = Math.random() * 10 - 5;
    let yVelocity = Math.random() * 4 + 8;
    const radius = this.config.targetRadius;
    const { bounds, gravity } = this.config;

    const target = new Target(
      {
        x: Math.random() * (bounds.xMax - bounds.xMin) + bounds.xMin,
        y: Math.random() * (bounds.yMax - bounds.yMin) + bounds.yMin,
        z: 0,
      },
      radius,
      (self, delta) => {
        yVelocity -= gravity * delta;
        self.position.x += xVelocity * delta;
        self.position.y += yVelocity * delta;

        if (self.position.x < bounds.xMin + radius) {
          self.position.x = (bounds.xMin + radius) + (bounds.xMin + radius - self.position.x)
          xVelocity *= -1;
        }
        else if (self.position.x > bounds.xMax - radius) {
          self.position.x = (bounds.xMax - radius) - (self.position.x - (bounds.xMax - radius))
          xVelocity *= -1;
        }

        if (self.position.y < bounds.yMin + radius) {
          self.position.y = (bounds.yMin + radius) + (bounds.yMin + radius - self.position.y);
          yVelocity *= -1;
        } else if (self.position.y > bounds.yMax - radius) {
          self.position.y = (bounds.yMax - radius) - (self.position.y - (bounds.yMax - radius));
          yVelocity *= -1;
        }
      },
    );

    this.add(target);
  }

  // remove target
  removeTarget(obj: Object3D): void {
    this.remove(obj);
  }

  // implemented for Updatable
  tick(delta: number): void {
    for (const child of this.children) {
      if (child instanceof Target) {
        child.tick(delta);
      }
    }
  };
}