import { Piece, UncoloredPiece } from "shared/pieceImages";
import { BoardState, MAX, MIN, Vectors } from "./consts";
import { Position } from "./types";

export const posToString = (y: number, x: number) => String(y) + String(x);

export const isEven = (number: number) => number % 2 === 0;

export const isBlackSquare = (row: number, col: number) => {
  return isEven(col) ? isEven(row + 1) : isEven(row);
};

export const isBlackPiece = (piece: string) => {
  return piece[0] === "b";
};

type BaseInfoForCalc = {
  position: Position;
  boardState: BoardState;
  blackTurn: boolean;
};

const calcMoves = ({
  vectors,
  position,
  boardState,
  blackTurn,
  limit,
}: BaseInfoForCalc & { vectors: Set<string>; limit?: number }) => {
  const moves = [];

  for (let i = -1; i < 2; i++) {
    for (let k = -1; k < 2; k++) {
      if (i === 0 && k === 0) continue;
      if (!vectors.has(posToString(k, i))) continue;

      let nextX = position.x;
      let nextY = position.y;
      let step = 0;

      while (true) {
        nextX = nextX + i;
        nextY = nextY + k;

        if (step === limit) break;
        if (nextX < MIN || nextY < MIN || nextX > MAX || nextY > MAX) break;

        const nextSquare = boardState[nextY][nextX];
        if (nextSquare) {
          const isBlack = isBlackPiece(nextSquare);
          // Remove taking same color piece
          if (isBlack === blackTurn) break;
          moves.push(posToString(nextY, nextX));
          break;
        }

        moves.push(posToString(nextY, nextX));
        step++;
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

      moves.push(posToString(nextY, nextX));
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

export const getMoves = ({
  piece: coloredPiece,
  ...rest
}: BaseInfoForCalc & { piece: Piece }) => {
  const piece = coloredPiece.slice(1) as UncoloredPiece;

  console.log(calcKnightMoves({ ...rest }));
  if (piece === "N")
    return calcKnightMoves({
      ...rest,
    });

  if (piece === "P") {
    return calcMoves({
      vectors: new Set([coloredPiece[0] === "w" ? Vectors.U : Vectors.D]),
      limit: 1,
      ...rest,
    });
  }

  return calcMoves({
    ...vectorOfPiece[piece],
    ...rest,
  });
};
