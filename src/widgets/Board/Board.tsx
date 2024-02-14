import { useState } from "react";
import { boardInitialState, squaresArray } from "./consts";
import {
  getPieceMoves,
  isBlackPiece,
  isBlackSquare,
  posToString,
} from "./utils";
import Square from "entities/Square/Square";
import { clone, isEmpty, isUndefined } from "lodash";
import { Piece, Position } from "shared/Pieces";

type SelectedPiece = {
  piece: Piece;
  position: Position;
  moves: string[];
};

type CheckState = {
  king: "wK" | "bK";
  defendKingMoves: Position[];
};

const Board = () => {
  const [boardState, setBoardState] = useState(boardInitialState);
  const [blackTurn, setBlackTurn] = useState(false);
  const [checkState, setCheckState] = useState<CheckState>();
  const [selectedPiece, setSelectedPiece] = useState<
    SelectedPiece | undefined
  >();

  const onSelectPiece = (position: Position, piece: Piece) => {
    const moves = getPieceMoves({
      piece,
      position,
      boardState,
      legalMoves: checkState?.defendKingMoves.map((move) => posToString(move)),
    });

    if (isEmpty(moves)) {
      setSelectedPiece(undefined);
    } else {
      setSelectedPiece({
        piece,
        position,
        moves,
      });
    }
  };

  const moveTo = ({ x, y }: Position) => {
    if (!selectedPiece) return;

    const nextBoardState = clone(boardState);

    const { x: selectedX, y: selectedY } = selectedPiece.position;
    nextBoardState[selectedY][selectedX] = undefined;
    nextBoardState[y][x] = selectedPiece.piece;

    setCheckState(undefined);

    // if (!isEmpty(defendKingMoves)) {
    //   setCheckState({
    //     king: blackTurn ? "wK" : "bK",
    //     defendKingMoves,
    //   });
    // }

    setBoardState(nextBoardState);
    setBlackTurn((prev) => !prev);
    setSelectedPiece(undefined);
  };

  const onClick = (position: Position, isAvailable: boolean, piece?: Piece) => {
    if (isAvailable) return moveTo(position);

    // if clicked in unavailable square without piece or enemy piece remove selection
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
