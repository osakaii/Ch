import { create } from "zustand";
import { boardInitialState } from "./consts";
import { BoardState, PiecesUnderPressure } from "./types";
import { Colors, Piece, Pieces, Position } from "shared/Pieces";
import {
  getKingsInfo,
  getNextBoard,
  getPieceMoves,
  posToString,
} from "./utils";
import { isEmpty, mapValues, omit } from "lodash";
import { immer } from "zustand/middleware/immer";

type SelectedPiece = {
  piece: Piece;
  position: Position;
  moves: string[];
};

type CheckState = {
  king: string;
  defendKingMoves: Position[];
};

type State = {
  boardState: BoardState;
  blackTurn: boolean;
  checkState?: CheckState;
  piecesUnderPressure: PiecesUnderPressure;
  attackedSquares: Record<Colors, string[]>;
  selectedPiece?: SelectedPiece;
};

type Action = {
  setSelectedPiece: (value?: SelectedPiece) => void;
  moveTo: (to: Position) => void;
  onSelectPiece: (position: Position, piece: Piece) => void;
};

const useBoardStore = create<State & Action>()(
  immer((set) => ({
    boardState: boardInitialState,
    blackTurn: false,
    checkState: undefined,
    piecesUnderPressure: [],
    attackedSquares: {
      w: [],
      b: [],
    },
    selectedPiece: undefined,

    setSelectedPiece: (value: SelectedPiece | undefined) =>
      set((state) => (state.selectedPiece = value)),

    moveTo: (to: Position) =>
      set((state) => {
        const { boardState, selectedPiece, blackTurn, attackedSquares } = state;
        if (!selectedPiece) return;

        const nextBoardState = getNextBoard(
          boardState,
          omit(selectedPiece, "moves"),
          to,
        );

        state.checkState = undefined;

        const kingsAttack = getKingsInfo(nextBoardState);

        mapValues(
          kingsAttack,
          (
            {
              defendKingMoves,
              piecesUnderPressure,
              attackedSquares: newAttackedSquares,
            },
            color,
          ) => {
            attackedSquares[color as Colors] = newAttackedSquares;
            if (!isEmpty(defendKingMoves)) {
              state.checkState = { king: color + Pieces.KING, defendKingMoves };
            }
            if (!isEmpty(piecesUnderPressure)) {
              state.piecesUnderPressure = piecesUnderPressure;
            }
          },
        );

        state.boardState = nextBoardState;
        state.blackTurn = !blackTurn;
        state.selectedPiece = undefined;
      }),

    onSelectPiece: (position: Position, piece: Piece) =>
      set((state) => {
        const { boardState, piecesUnderPressure, attackedSquares, checkState } =
          state;
        const moves = getPieceMoves({
          piece,
          position,
          boardState,
          piecesUnderPressure,
          attackedSquares,
          legalMoves: checkState?.defendKingMoves.map((move) =>
            posToString(move),
          ),
        });

        isEmpty(moves)
          ? (state.selectedPiece = undefined)
          : (state.selectedPiece = {
              piece,
              position,
              moves,
            });
      }),
  })),
);

export default useBoardStore;
