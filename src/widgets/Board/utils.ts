import { Piece } from "shared/pieceImages";
import { BoardState } from "./consts";
import { Position } from "./types";

const [MIN, MAX] = [0, 7];

export const posToString = (y: number, x: number) => String(y) + String(x);

export const isEven = (number: number) => number % 2 === 0;

export const isBlack = (row: number, col: number) => {
  return isEven(col) ? isEven(row + 1) : isEven(row);
};

export const getMoves = (
  piece: Piece,
  position: Position,
  boardState: BoardState,
) => {
  const moves = [];
  if (piece === "wR") {
    // const vectors = [Vectors.D, Vectors.R, Vectors.U, Vectors.L];

    for (let i = -1; i < 2; i++) {
      for (let k = -1; k < 2; k++) {
        if (i === 0 && k === 0) continue;

        let nextX = position.x;
        let nextY = position.y;

        while (true) {
          nextX = nextX + i;
          nextY = nextY + k;

          if (nextX < MIN || nextY < MIN || nextX > MAX || nextY > MAX) break;
          if (boardState[nextY][nextX] !== undefined) break;

          moves.push(posToString(nextY, nextX));
        }
      }
    }
    console.log(moves);
  }
  return moves;
};
