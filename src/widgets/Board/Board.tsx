import { useState } from "react";
import { boardInitialState, squaresArray } from "./consts";
import { getMoves, isBlack, posToString } from "./utils";
import { Position } from "./types";
import Square from "entities/Square/Square";
import { Piece } from "shared/pieceImages";

const Board = () => {
  //@ts-expect-error
  const [boardState, setBoardState] = useState(boardInitialState);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);

  const onPieceClick = (position: Position, piece: Piece) => {
    setAvailableMoves(getMoves(piece, position, boardState));
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 border-2 border-black">
        {squaresArray.map((row, y) =>
          row.map((_, x) => {
            const key = y + x;
            const piece = boardState[y][x];
            const isAvailable = availableMoves.includes(posToString(y, x));

            return (
              <Square
                isAvailable={isAvailable}
                isBlack={isBlack(y, x)}
                key={key}
                piece={piece}
                onClick={() => piece && onPieceClick({ x, y }, piece)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default Board;
