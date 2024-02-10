/* eslint-disable complexity */
import {
  BlackPiece,
  Piece,
  UncoloredPiece,
  WhitePiece,
  Colors,
  Pieces,
} from "shared/Pieces";
import { MAX, MIN, Vectors } from "./consts";
import { BoardState, Position } from "./types";
import { uniq } from "lodash";

export const posToString = ({ x, y }: Position) => String(y) + String(x);

export const isEven = (number: number) => number % 2 === 0;

export const isBlackSquare = (row: number, col: number) => {
  return isEven(col) ? isEven(row + 1) : isEven(row);
};

export const isBlackPiece = (piece: Piece) => {
  return piece[0] === Colors.BLACK;
};

export const toBlack = (pieces: Pieces[]) =>
  pieces.map((piece) => "b" + piece) as BlackPiece[];
export const toWhite = (pieces: Pieces[]) =>
  pieces.map((piece) => "w" + piece) as WhitePiece[];

export const uncolorPiece = (piece: Piece) => piece.slice(1) as UncoloredPiece;

type BaseInfoForCalc = {
  position: Position;
  boardState: BoardState;
  blackTurn: boolean;
};

type CalcMovesArgs = BaseInfoForCalc & {
  vectors: Set<string>;
  limit?: number;
  piece?: Piece;
};

type IsInvalidPawnMoveArgs = {
  nextSquare: Piece | undefined;
  piece: Piece;
  vector: string;
};

const isInvalidPawnMove = ({
  nextSquare,
  piece,
  vector,
}: IsInvalidPawnMoveArgs) => {
  if (!nextSquare) {
    if (isBlackPiece(piece) && vector !== Vectors.D) return true;
    if (!isBlackPiece(piece) && vector !== Vectors.U) return true;
  }
  if (nextSquare) {
    if (isBlackPiece(piece) && vector === Vectors.D) return true;
    if (!isBlackPiece(piece) && vector === Vectors.U) return true;
  }
};

export const getPositions = ({
  piece,
  boardState,
}: {
  piece: Piece;
  boardState: BoardState;
}) => {
  const positions = [];
  for (const [y, row] of boardState.entries())
    for (const [x, square] of row.entries()) {
      if (square === piece) positions.push({ x, y });
    }
  return positions;
};

const calcMoves = ({
  vectors,
  position,
  boardState,
  blackTurn,
  limit = Number.POSITIVE_INFINITY,
  piece,
}: CalcMovesArgs) => {
  const moves = [];

  const isPawn = piece && uncolorPiece(piece) === Pieces.PAWN;

  if (isPawn) {
    if (isBlackPiece(piece) && position.y === 1) {
      limit = 2;
    }
    if (!isBlackPiece(piece) && position.y === 6) {
      limit = 2;
    }
  }

  for (let i = -1; i < 2; i++) {
    for (let k = -1; k < 2; k++) {
      const vector = posToString({ y: k, x: i });
      if (i === 0 && k === 0) continue;
      if (!vectors.has(vector)) continue;

      let nextX = position.x;
      let nextY = position.y;

      for (let step = 0; step < limit; step++) {
        nextX += i;
        nextY += k;

        if (nextX < MIN || nextY < MIN || nextX > MAX || nextY > MAX) break;

        const nextSquare = boardState[nextY][nextX];

        if (isPawn && isInvalidPawnMove({ nextSquare, piece, vector })) break;

        if (nextSquare) {
          // Remove taking same color piece
          if (isBlackPiece(nextSquare) === blackTurn) break;
          moves.push(posToString({ y: nextY, x: nextX }));
          break;
        }

        moves.push(posToString({ y: nextY, x: nextX }));
      }
    }
  }
  return moves;
};

const calcKnightMoves = ({
  position,
  blackTurn,
  boardState,
}: BaseInfoForCalc) => {
  const moves = [];
  for (let i = -2; i < 3; i++) {
    for (let k = -2; k < 3; k++) {
      // Remove non L moves
      if (Math.abs(i) === Math.abs(k) || k === 0 || i === 0) continue;
      const nextY = position.y + k;
      const nextX = position.x + i;

      if (nextX < MIN || nextY < MIN || nextX > MAX || nextY > MAX) continue;

      const nextSquare = boardState[nextY][nextX];
      // Remove taking same color piece
      if (nextSquare && blackTurn === isBlackPiece(nextSquare)) continue;

      moves.push(posToString({ y: nextY, x: nextX }));
    }
  }
  return moves;
};

const vectorOfPiece = {
  R: { vectors: new Set([Vectors.D, Vectors.R, Vectors.U, Vectors.L]) },
  B: { vectors: new Set([Vectors.DL, Vectors.DR, Vectors.UR, Vectors.UL]) },
  Q: { vectors: new Set(Object.values(Vectors)) },
  K: { vectors: new Set(Object.values(Vectors)), limit: 1 },
};

export const getPieceMoves = ({
  piece: coloredPiece,
  ...rest
}: BaseInfoForCalc & { piece: Piece }) => {
  const piece = uncolorPiece(coloredPiece);

  if (piece === Pieces.KNIGHT)
    return calcKnightMoves({
      ...rest,
    });

  if (piece === Pieces.PAWN) {
    return calcMoves({
      vectors: new Set(
        isBlackPiece(coloredPiece)
          ? [Vectors.D, Vectors.DL, Vectors.DR]
          : [Vectors.U, Vectors.UR, Vectors.UL],
      ),
      limit: 1,
      piece: coloredPiece,
      ...rest,
    });
  }

  return calcMoves({
    ...vectorOfPiece[piece],
    ...rest,
  });
};

export const getPiecesMoves = ({
  pieces,
  boardState,
  blackTurn,
}: Omit<BaseInfoForCalc, "position"> & { pieces: Piece[] }) =>
  uniq(
    pieces.flatMap((piece) =>
      getPositions({ piece, boardState }).flatMap((position) =>
        getPieceMoves({ piece, boardState, position, blackTurn }),
      ),
    ),
  );
