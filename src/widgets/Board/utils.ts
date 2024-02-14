/* eslint-disable complexity */
import {
  BlackPiece,
  Piece,
  UncoloredPiece,
  WhitePiece,
  Colors,
  Pieces,
  Position,
  BatteryPieces,
} from "shared/Pieces";
import { MAX, MIN, Vectors } from "./consts";
import { BoardState } from "./types";
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
  piece: Piece;
  legalMoves?: string[];
};

type GetPieceMovesArgs = BaseInfoForCalc & {
  isXRay?: boolean;
};

type CalcMovesArgs = BaseInfoForCalc & {
  isXRay?: boolean;
  vectors: Set<string>;
  limit?: number;
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
  limit = Number.POSITIVE_INFINITY,
  piece,
  legalMoves,
  isXRay,
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
        const nextMove = posToString({ y: nextY, x: nextX });

        if (nextX < MIN || nextY < MIN || nextX > MAX || nextY > MAX) break;

        const nextSquare = boardState[nextY][nextX];

        if (isPawn && isInvalidPawnMove({ nextSquare, piece, vector })) break;
        if (nextSquare && isBlackPiece(piece) === isBlackPiece(nextSquare))
          break;

        if (legalMoves && !legalMoves?.includes(nextMove)) continue;

        moves.push(nextMove);

        if (!isXRay && nextSquare) break;
      }
    }
  }
  return moves;
};

const calcKnightMoves = ({
  position,
  boardState,
  piece,
  legalMoves,
}: BaseInfoForCalc) => {
  const moves = [];
  for (let i = -2; i < 3; i++) {
    for (let k = -2; k < 3; k++) {
      if (Math.abs(i) === Math.abs(k) || k === 0 || i === 0) continue;
      const nextY = position.y + k;
      const nextX = position.x + i;
      const nextMove = posToString({ y: nextY, x: nextX });

      if (nextX < MIN || nextY < MIN || nextX > MAX || nextY > MAX) continue;

      const nextSquare = boardState[nextY][nextX];
      if (nextSquare && isBlackPiece(piece) === isBlackPiece(nextSquare))
        continue;
      if (legalMoves && !legalMoves?.includes(nextMove)) continue;

      moves.push(nextMove);
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

export const getPieceMoves = ({ piece, ...rest }: GetPieceMovesArgs) => {
  const uncoloredPiece = uncolorPiece(piece);

  if (uncoloredPiece === Pieces.KNIGHT)
    return calcKnightMoves({
      piece,
      ...rest,
    });

  if (uncoloredPiece === Pieces.PAWN) {
    return calcMoves({
      vectors: new Set(
        isBlackPiece(piece)
          ? [Vectors.D, Vectors.DL, Vectors.DR]
          : [Vectors.U, Vectors.UR, Vectors.UL],
      ),
      limit: 1,
      piece,
      ...rest,
    });
  }

  return calcMoves({
    piece,
    ...vectorOfPiece[uncoloredPiece],
    ...rest,
  });
};

type GetPiecesMovesArgs = Omit<BaseInfoForCalc, "position" | "piece"> & {
  pieces: Piece[];
  isXRay: boolean;
};

export const getPiecesMoves = ({
  pieces,
  boardState,
  isXRay,
}: GetPiecesMovesArgs) =>
  uniq(
    pieces.flatMap((piece) =>
      getPositions({ piece, boardState }).map((position) => ({
        piece,
        position,
        moves: getPieceMoves({
          piece,
          boardState,
          position,
          isXRay,
        }),
      })),
    ),
  );

export const getSquaresBetween = (pos1: Position, pos2: Position) => {
  const { x: x1, y: y1 } = pos1;
  const { x: x2, y: y2 } = pos2;

  const squaresBetween = [];

  const xVector = x1 < x2 ? 1 : -1;
  const yVector = y1 < y2 ? 1 : -1;

  let stepX = x1,
    stepY = y1;

  while (stepX !== x2 || stepY !== y2) {
    if (stepX !== x2) stepX += xVector;
    if (stepY !== y2) stepY += yVector;

    squaresBetween.push({ x: stepX, y: stepY });
  }

  squaresBetween.pop();

  return squaresBetween;
};

export const getKingAttack = (
  boardState: BoardState,
  blackTurn: boolean,
  nextBoardState: BoardState,
  piece: Piece,
) => {
  const possibleChecks = getPiecesMoves({
    pieces: [...toBlack(BatteryPieces), ...toWhite(BatteryPieces), piece],
    boardState,
    isXRay: true,
  });

  const kingPosition = getPositions({
    piece: blackTurn ? "wK" : "bK",
    boardState: nextBoardState,
  })[0];

  const defendKingMoves = [];

  for (const { moves, piece, position } of possibleChecks) {
    if (moves.includes(posToString(kingPosition))) {
      if (uncolorPiece(piece) === Pieces.KNIGHT) {
        defendKingMoves.push(position);
        continue;
      }

      const squaresBetween = getSquaresBetween(kingPosition, position);
      defendKingMoves.push(...squaresBetween, position);
    }
  }

  return [];
};
