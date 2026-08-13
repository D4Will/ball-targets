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

export class GridShotGroup extends Group implements Updatable {
  config: GridConfig;
  grid: gridCell[][];

  constructor(zPos: number) {
    super();

    this.config = {
      targetRadius: .5,
      activeTargetCount: 3,
      rows: 5,
      cols: 5,
      gapSize: .1,
    }

    this.position.z = zPos;

    // create and initialize grid
    this.grid = [];
    this.initGrid();

    const target1Pos = new Vector3(
      this.grid[0][0].point.x,
      this.grid[0][0].point.y,
      0,
    );
    const target1 = new Target(0, 0, this.config.targetRadius, target1Pos);
    this.add(target1);
    this.grid[0][0].obj = target1;

    const target2Pos = new Vector3(
      this.grid[2][2].point.x,
      this.grid[2][2].point.y,
      0,
    );
    const target2 = new Target(0, 0, this.config.targetRadius, target2Pos);
    this.add(target2);
    this.grid[2][2].obj = target2;

    const target3Pos = new Vector3(
      this.grid[4][4].point.x,
      this.grid[4][4].point.y,
      0,
    );
    const target3 = new Target(0, 0, this.config.targetRadius, target3Pos);
    this.add(target3);
    this.grid[4][4].obj = target3;
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
    console.log("handle hit")
    if (!hits.length) {
      console.log("no hits")
      return;
    }

    console.log("hit");
    const hit = hits[0].object;
    console.log(hit.type);
    const { col, row } = this.findCellByObj(hit);
    console.log("Hit at: ", col, row);

    if (col > -1 && row > -1) {
      this.randomMovePoint(col, row);
    }
  };

  // return grid position of obj
  findCellByObj(obj: Object3D): {col: number, row: number} {
    for (let i = 0; i < this.grid.length; i++) {
      console.log("col: ", i);
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
  randomMovePoint(col: number, row: number): void {
    console.log("hi");
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

  // removes old target and adds new one
  movePoint(col1: number, row1: number, col2: number, row2: number): void {
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
    cell.obj = new Target(0, 0, this.config.targetRadius, targetPos);
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
    delta;
  };
}