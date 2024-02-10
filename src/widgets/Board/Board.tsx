import { useState } from "react";
import { boardInitialState, squaresArray } from "./consts";
import {
  getPieceMoves,
  getPiecesMoves,
  getPositions,
  isBlackPiece,
  isBlackSquare,
  posToString,
  toBlack,
  toWhite,
} from "./utils";
import { Position } from "./types";
import Square from "entities/Square/Square";
import { clone } from "lodash";
import { Piece, BatteryPieces, Colors } from "shared/Pieces";

type SelectedPiece = {
  piece: Piece;
  position: Position;
  moves: string[];
};

const Board = () => {
  const [boardState, setBoardState] = useState(boardInitialState);
  const [blackTurn, setBlackTurn] = useState(false);
  const [checkState, setCheckState] = useState<Colors>();
  const [selectedPiece, setSelectedPiece] = useState<
    SelectedPiece | undefined
  >();

  const onSelectPiece = (position: Position, piece: Piece) => {
    setSelectedPiece({
      piece,
      position,
      moves: getPieceMoves({ piece, position, boardState, blackTurn }),
    });
  };

  const moveTo = ({ x, y }: Position) => {
    if (!selectedPiece) return;

    const nextBoardState = clone(boardState);

    const { x: selectedX, y: selectedY } = selectedPiece.position;
    nextBoardState[selectedY][selectedX] = undefined;
    nextBoardState[y][x] = selectedPiece.piece;

    const possibleChecks = getPiecesMoves({
      pieces: blackTurn ? toBlack(BatteryPieces) : toWhite(BatteryPieces),
      boardState,
      blackTurn,
    });

    const kingPosition = posToString(
      getPositions({
        piece: blackTurn ? "wK" : "bK",
        boardState: nextBoardState,
      })[0],
    );

    if (possibleChecks.includes(kingPosition))
      setCheckState(blackTurn ? Colors.WHITE : Colors.BLACK);

    setBoardState(nextBoardState);
    setBlackTurn((prev) => !prev);
    setSelectedPiece(undefined);
  };

  console.log(checkState);

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
