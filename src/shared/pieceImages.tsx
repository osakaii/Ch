import {
  BBishop,
  BKing,
  BKnight,
  BPawn,
  BQueen,
  BRook,
  WBishop,
  WKing,
  WKnight,
  WPawn,
  WQueen,
  WRook,
} from "shared/assets/pieces";

export const pieceImages = {
  bR: <BRook />,
  bN: <BKnight />,
  bB: <BBishop />,
  bQ: <BQueen />,
  bK: <BKing />,
  bP: <BPawn />,
  wR: <WRook />,
  wN: <WKnight />,
  wB: <WBishop />,
  wQ: <WQueen />,
  wK: <WKing />,
  wP: <WPawn />,
};

export type Piece = keyof typeof pieceImages;
export type UncoloredPiece = "R" | "Q" | "K" | "N" | "P" | "B";
