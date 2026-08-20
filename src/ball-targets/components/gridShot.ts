import { Group, Object3D, Vector3, type Intersection, type Object3DEventMap } from "three";
import { Target } from "./Target";
import type { Updatable } from "./types";

type GridConfig = {
  targetRadius: number,
  activeTargetCount: number,
  rows: number,
  cols: number,
  gapSize: number,
};

type point2D = {x: number, y: number}
type gridCell = {point: point2D, obj: Object3D | null}

export class GridShot extends Group implements Updatable {
  config: GridConfig;
  grid: gridCell[][];

  constructor(
    distance: number,
    config?: Partial<GridConfig>,
  ) {
    super();

    const defaultConfig: GridConfig = {
      targetRadius: .5,
      activeTargetCount: 3,
      rows: 5,
      cols: 5,
      gapSize: .1,
    }

    this.config = { ...defaultConfig, ...config };

    this.position.z = -1 * distance;

    // create and initialize grid
    this.grid = [];
    this.initGrid();
    
    // randomly add initial targets
    for (let i = 0; i < this.config.activeTargetCount; i++) {
      this.randomAddTarget()
    }
  }

  // initializes grid based on config
  initGrid() {
    const rows = this.config.rows;
    const cols = this.config.cols;
    // target diameter + gap between
    const space = this.config.targetRadius * 2 + this.config.gapSize;

    for (let i = 0; i < rows; i++) {
      this.grid[i] = [];
      const colPos = space * (i - Math.floor(rows / 2));
      for (let j = 0; j < cols; j++) {
        const rowPos = space * (j - Math.floor(rows / 2));
        this.grid[i][j] = {
          point: {
            x: colPos,
            y: rowPos,
          },
          obj: null,
        };
      }
    }
  };

  // handles click input
  handleHit(hits: Intersection<Object3D<Object3DEventMap>>[]) {
    if (!hits.length) {
      return;
    }

    const hit = hits[0].object;
    const { col, row } = this.findCellByObj(hit);

    if (col > -1 && row > -1) {
      this.randomMoveTarget(col, row);
    }
  };

  // return grid position of obj
  findCellByObj(obj: Object3D): {col: number, row: number} {
    for (let i = 0; i < this.grid.length; i++) {
      // loop through columns
      for (let j = 0; j < this.grid[i].length; j++) {
        // loop through rows
        const target = this.grid[i][j].obj
        if (
          target &&
          target.uuid === obj.uuid
        ) {
          return {col: i, row: j}
        }
      }
    }
    return {col: -1, row: -1};
  }

  // randomly moves target to open spot
  randomMoveTarget(col: number, row: number): void {
    this.removeTarget(col, row);

    let randCol: number;
    let randRow: number;    
    do {
      randCol = Math.floor(Math.random() * this.config.cols);
      randRow = Math.floor(Math.random() * this.config.rows);
    } while (
      (randCol === col && randRow === row) ||
      (this.grid[randCol][randRow].obj)
    )
    
    this.addTarget(randCol, randRow);
  }

  // randomly adds target to grid
  randomAddTarget(): void {
    let randCol: number;
    let randRow: number;    
    do {
      randCol = Math.floor(Math.random() * this.config.cols);
      randRow = Math.floor(Math.random() * this.config.rows);
    } while (
      (this.grid[randCol][randRow].obj)
    )
    
    this.addTarget(randCol, randRow);
  }

  // removes old target and adds new one
  moveTarget(col1: number, row1: number, col2: number, row2: number): void {
    this.removeTarget(col1, row1);
    this.addTarget(col2, row2);
  }

  // add target 
  addTarget(col: number, row: number): void {
    const cell = this.grid[col][row];

    if (cell.obj) {
      this.removeTarget(col, row);
    }

    const targetPos = new Vector3(
      cell.point.x,
      cell.point.y,
      0,
    );
    cell.obj = new Target(targetPos, this.config.targetRadius);
    this.add(cell.obj);
  }

  // remove target
  removeTarget(col: number, row: number): void {
    const cell = this.grid[col][row]
    if (cell.obj) {
      this.remove(cell.obj);
      cell.obj = null;
    }
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