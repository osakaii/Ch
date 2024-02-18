/* eslint-disable complexity */
import {
  Piece,
  UncoloredPiece,
  Colors,
  Pieces,
  Position,
  ColorType,
} from "shared/Pieces";
import { MAX, MIN, Vectors } from "./consts";
import { BoardState, PiecesUnderPressure } from "./types";
import { clone, isArray, isEmpty, isUndefined, omit, uniq } from "lodash";

export const posToString = ({ x, y }: Position) => String(y) + String(x);

export const isEven = (number: number) => number % 2 === 0;

export const isBlackSquare = (row: number, col: number) => {
  return isEven(col) ? isEven(row + 1) : isEven(row);
};

export const isBlackPiece = (piece: Piece) => {
  return piece[0] === Colors.BLACK;
};

export const getPieceColor = (piece: Piece) => piece[0] as ColorType;

const getOpositeColor = (color: ColorType) => (color === "w" ? "b" : "w");

type ReturnColorPieces<T extends Pieces[] | Pieces> = T extends Pieces[]
  ? Piece[]
  : Piece;

export const colorPieces = <T extends Pieces[] | Pieces>(
  pieceOrPieces: T,
  color: "w" | "b",
): ReturnColorPieces<T> => {
  return isArray(pieceOrPieces)
    ? (pieceOrPieces.map((piece) => color + piece) as ReturnColorPieces<T>)
    : ((color + pieceOrPieces) as ReturnColorPieces<T>);
};

export const uncolorPiece = (piece: Piece) => piece.slice(1) as UncoloredPiece;

type BaseInfoForCalc = {
  position: Position;
  boardState: BoardState;
  piece: Piece;
  legalMoves?: string[];
};

type GetPieceMovesArgs = BaseInfoForCalc & {
  attackedSquares?: Record<Colors, string[]>;
  piecesUnderPressure?: PiecesUnderPressure;
  isPawnAttacks?: boolean;
  isXRay?: boolean;
};

type CalcMovesArgs = BaseInfoForCalc & {
  attackedSquares?: Record<Colors, string[]>;
  vectors: Set<string>;
  limit?: number;
  isXRay?: boolean;
  isPawnAttacks?: boolean;
  piecesUnderPressure?: PiecesUnderPressure;
};

type IsInvalidPawnMoveArgs = {
  nextSquare: Piece | undefined;
  piece: Piece;
  vector: string;
  isPawnAttacks?: boolean;
};

export const getNextBoard = (
  boardState: BoardState,
  selectedPiece: { piece: Piece; position: Position },
  { x, y }: Position,
) => {
  const nextBoardState = clone(boardState);

  const { x: selectedX, y: selectedY } = selectedPiece.position;
  nextBoardState[selectedY][selectedX] = undefined;
  nextBoardState[y][x] = selectedPiece.piece;

  return nextBoardState;
};

const isInvalidPawnMove = ({
  nextSquare,
  piece,
  vector,
  isPawnAttacks,
}: IsInvalidPawnMoveArgs) => {
  if (isPawnAttacks) {
    return (
      (isBlackPiece(piece) && vector === Vectors.D) ||
      (!isBlackPiece(piece) && vector === Vectors.U)
    );
  }
  if (!nextSquare) {
    if (isBlackPiece(piece) && vector !== Vectors.D) return true;
    if (!isBlackPiece(piece) && vector !== Vectors.U) return true;
  }
  if (nextSquare) {
    if (isBlackPiece(piece) && vector === Vectors.D) return true;
    if (!isBlackPiece(piece) && vector === Vectors.U) return true;
  }
};

const isUnderPressure = (
  nextSquare: Position,
  position: Position,
  piecesUnderPressure?: PiecesUnderPressure,
) => {
  if (isUndefined(piecesUnderPressure) || isEmpty(piecesUnderPressure))
    return false;

  for (const piece of piecesUnderPressure) {
    if (
      piece.position.x === position.x &&
      piece.position.y === position.y &&
      !piece.moves.includes(nextSquare)
    ) {
      return true;
    }
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

export const calcMoves = ({
  vectors,
  position,
  boardState,
  piecesUnderPressure,
  limit = Number.POSITIVE_INFINITY,
  piece,
  legalMoves,
  isXRay,
  attackedSquares,
  isPawnAttacks,
}: CalcMovesArgs) => {
  const moves = [];
  const uncoloredPiece = piece && uncolorPiece(piece);

  if (uncoloredPiece === Pieces.PAWN) {
    if (isBlackPiece(piece) && position.y === 1) {
      limit = 2;
    }
    if (!isBlackPiece(piece) && position.y === 6) {
      limit = 2;
    }
  }

  if (uncoloredPiece === Pieces.PAWN && isPawnAttacks) limit = 1;

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

        if (
          isUnderPressure({ x: nextX, y: nextY }, position, piecesUnderPressure)
        )
          continue;

        if (
          uncoloredPiece === Pieces.PAWN &&
          isInvalidPawnMove({ nextSquare, piece, vector, isPawnAttacks })
        )
          break;

        if (
          uncoloredPiece === Pieces.KING &&
          attackedSquares &&
          attackedSquares[getPieceColor(piece)].includes(nextMove)
        )
          break;

        if (
          !isXRay &&
          nextSquare &&
          isBlackPiece(piece) === isBlackPiece(nextSquare)
        )
          break;

        if (legalMoves && !legalMoves?.includes(nextMove)) continue;

        moves.push(nextMove);

        if (!isXRay && nextSquare) break;
      }
    }
  }
  return moves;
};

export const calcKnightMoves = ({
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
  isXRay?: boolean;
};

export const getPiecesMoves = ({
  pieces,
  boardState,
  isXRay,
}: GetPiecesMovesArgs) =>
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
  );

export const getSquaresBetween = (pos1: Position, pos2: Position) => {
  const { x: x1, y: y1 } = pos1;
  const { x: x2, y: y2 } = pos2;

  const squaresBetween = [];

  let stepX = x1,
    stepY = y1;

  while (stepX !== x2 || stepY !== y2) {
    if (stepX !== x2) stepX += x1 < x2 ? 1 : -1;
    if (stepY !== y2) stepY += y1 < y2 ? 1 : -1;

    squaresBetween.push({ x: stepX, y: stepY });
  }

  squaresBetween.pop();

  return squaresBetween;
};

export const getKingInfo = (nextBoardState: BoardState, color: ColorType) => {
  const piecesWihtoutKing = Object.values(omit(Pieces, Pieces.KING));

  const potentialAttackedSquares = [
    ...colorPieces(piecesWihtoutKing, color),
  ].flatMap((piece) =>
    getPositions({ piece, boardState: nextBoardState }).map((position) => ({
      piece,
      position,
      moves: getPieceMoves({
        piece,
        boardState: nextBoardState,
        position,
        isXRay: true,
      }),
    })),
  );

  const attackedSquares = uniq(
    [...colorPieces(piecesWihtoutKing, color)].flatMap((piece) =>
      getPositions({ piece, boardState: nextBoardState }).flatMap((position) =>
        getPieceMoves({
          piece,
          boardState: nextBoardState,
          position,
          isPawnAttacks: true,
        }),
      ),
    ),
  );

  const kingPosition = getPositions({
    piece: colorPieces(Pieces.KING, getOpositeColor(color)),
    boardState: nextBoardState,
  })[0];

  const defendKingMoves = [];
  const piecesUnderPressure: PiecesUnderPressure = [];

  for (const { moves, piece, position } of potentialAttackedSquares) {
    if (moves.includes(posToString(kingPosition))) {
      if (uncolorPiece(piece) === Pieces.KNIGHT) {
        defendKingMoves.push(position);
        continue;
      }

      const squaresBetween = getSquaresBetween(kingPosition, position);

      const piecesBetween = [];

      for (const square of squaresBetween) {
        const pieceOnSquare = nextBoardState[square.y][square.x];

        if (pieceOnSquare)
          piecesBetween.push({
            piece: pieceOnSquare,
            position: { x: square.x, y: square.y },
          });
      }

      if (piecesBetween.length === 1) {
        piecesUnderPressure.push({
          moves: [...squaresBetween, position],
          piece: piecesBetween[0].piece,
          position: piecesBetween[0].position,
        });
      }

      if (piecesBetween.length === 0) {
        defendKingMoves.push(...squaresBetween, position);
      }
    }
  }

  return {
    defendKingMoves,
    piecesUnderPressure,
    attackedSquares,
  };
};

export const getKingsInfo = (nextBoardState: BoardState) => ({
  [Colors.WHITE]: getKingInfo(nextBoardState, Colors.BLACK),
  [Colors.BLACK]: getKingInfo(nextBoardState, Colors.WHITE),
});
