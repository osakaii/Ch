import { Piece } from "shared/Pieces/types";

export type Position = {
  x: number;
  y: number;
};

export type BoardState = (Piece | undefined)[][];
