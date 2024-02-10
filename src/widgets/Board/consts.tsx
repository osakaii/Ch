import { BoardState } from "./types";

export const [MIN, MAX] = [0, 7];

export const boardInitialState: BoardState = [
  ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
  ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
  [, , , , , , , ,],
  [, , , , , , , ,],
  [, , , , , , , ,],
  [, , , , , , , ,],
  ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
  ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
];

export const squaresArray = Array.from(Array(8).keys()).map(() =>
  Array.from(Array(8).keys()),
);

export enum Vectors {
  UL = "-1-1",
  D = "10",
  UR = "-11",
  R = "01",
  DR = "11",
  U = "-10",
  DL = "1-1",
  L = "0-1",
}
