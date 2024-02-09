import { useState } from "react";
import { boardInitialState, squaresArray } from "./consts";
import { getMoves, isBlackPiece, isBlackSquare, posToString } from "./utils";
import { Position } from "./types";
import Square from "entities/Square/Square";
import { Piece } from "shared/pieceImages";
import { clone } from "lodash";

type SelectedPiece = {
  piece: Piece;
  position: Position;
  moves: string[];
};

const Board = () => {
  const [boardState, setBoardState] = useState(boardInitialState);
  const [blackTurn, setBlackTurn] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<
    SelectedPiece | undefined
  >();

  const onSelectPiece = (position: Position, piece: Piece) => {
    setSelectedPiece({
      piece,
      position,
      moves: getMoves({ piece, position, boardState, blackTurn }),
    });
  };

  const moveTo = ({ x, y }: Position) => {
    if (!selectedPiece) return;

    setBoardState((prev) => {
      prev[selectedPiece.position.y][selectedPiece.position.x] = undefined;
      prev[y][x] = selectedPiece?.piece;

      return clone(prev);
    });

    setBlackTurn((prev) => !prev);
    setSelectedPiece(undefined);
  };

  const onClick = (position: Position, isAvailable: boolean, piece?: Piece) => {
    if (isAvailable) return moveTo(position);
    if (!piece) return setSelectedPiece(undefined);

    const isBlack = isBlackPiece(piece);

    if (blackTurn === isBlack) {
      onSelectPiece(position, piece);
    } else {
      setSelectedPiece(undefined);
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 border-2 border-black">
        {squaresArray.map((row, y) =>
          row.map((_, x) => {
            const key = y + x;
            const piece = boardState[y][x];
            const isAvailable =
              selectedPiece?.moves.includes(posToString(y, x)) || false;

            return (
              <Square
                isAvailable={isAvailable}
                isBlack={isBlackSquare(y, x)}
                key={key}
                piece={piece}
                onClick={() => onClick({ x, y }, isAvailable, piece)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default Board;
