import { squaresArray } from "./consts";
import { isBlackPiece, isBlackSquare, posToString } from "./utils";
import Square from "entities/Square/Square";
import { isUndefined } from "lodash";
import { Piece, Position } from "shared/Pieces";
import useBoardStore from "./useBoardStore";

const Board = () => {
  const {
    blackTurn,
    boardState,
    checkState,
    selectedPiece,
    setSelectedPiece,
    moveTo,
    onSelectPiece,
  } = useBoardStore();

  const onClick = (position: Position, isAvailable: boolean, piece?: Piece) => {
    if (isAvailable) return moveTo(position);

    if (!piece || blackTurn !== isBlackPiece(piece)) {
      setSelectedPiece(undefined);
    } else {
      onSelectPiece(position, piece);
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
              selectedPiece?.moves.includes(posToString({ y, x })) || false;
            const isSelectedSquare =
              x === selectedPiece?.position.x && y === selectedPiece.position.y;
            const isChecked =
              !isUndefined(checkState) && checkState?.king === piece;

            return (
              <Square
                isAvailable={isAvailable}
                isBlack={isBlackSquare(y, x)}
                isChecked={isChecked}
                isSelectedSquare={isSelectedSquare}
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
