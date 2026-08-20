export interface Updatable {
  tick(delta: number): void;
};

export type point = {
  x: number,
  y: number,
  z: number,
};