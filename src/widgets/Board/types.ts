import { Piece, Position } from "shared/Pieces/types";

export type BoardState = (Piece | undefined)[][];

export type PiecesUnderPressure = {
  moves: Position[];
  piece: Piece;
  position: Position;
}[];
