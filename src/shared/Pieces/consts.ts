export enum Pieces {
  QUEEN = "Q",
  ROOK = "R",
  KING = "K",
  KNIGHT = "N",
  PAWN = "P",
  BISHOP = "B",
}

export enum Colors {
  WHITE = "w",
  BLACK = "b",
}

export type ColorType = `${Colors}`;

export const BatteryPieces = [Pieces.BISHOP, Pieces.ROOK, Pieces.QUEEN];
