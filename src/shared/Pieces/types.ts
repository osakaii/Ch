export type WhitePiece = "wR" | "wN" | "wB" | "wQ" | "wK" | "wP";
export type BlackPiece = "bR" | "bN" | "bB" | "bQ" | "bK" | "bP";

export type Piece = WhitePiece | BlackPiece;

export type UncoloredPiece = "R" | "Q" | "K" | "N" | "P" | "B";

export type Position = {
  x: number;
  y: number;
};
