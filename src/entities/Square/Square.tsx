import { cloneElement } from "react";
import { pieceImages, Piece } from "shared/Pieces";
import { twMerge } from "tailwind-merge";
import "./index.css";

type SquareProps = {
  isBlack?: boolean;
  piece: Piece | undefined;
  isAvailable: boolean;
  isChecked: boolean;
  isSelectedSquare?: boolean;
  onClick: () => void;
};

const TakeSquare = () => {
  return (
    <>
      <span className="takeSquareCorner top-[-16px] left-[-16px]" />
      <span className="takeSquareCorner top-[-16px] right-[-16px]" />
      <span className="takeSquareCorner bottom-[-16px] left-[-16px]" />
      <span className="takeSquareCorner bottom-[-16px] right-[-16px]" />
    </>
  );
};

const Square = ({
  isBlack,
  piece,
  isAvailable,
  isChecked,
  isSelectedSquare,
  onClick,
}: SquareProps) => {
  const isMoveSquare = isAvailable && !piece;
  const isTakeSquare = isAvailable && piece;

  const backgroundStyle = isBlack ? "bg-dark" : "bg-white";
  const selectedStyle = isSelectedSquare ? "bg-red-600" : "";
  return (
    <div
      className={twMerge(
        "w-16 h-16 flex justify-center items-center relative overflow-hidden",
        backgroundStyle,
        selectedStyle,
      )}
      onClick={onClick}
    >
      {isChecked ? (
        <div className="animate-ping bg-red-700 w-8 h-8 absolute rounded-full z-5" />
      ) : undefined}
      {piece
        ? cloneElement(pieceImages[piece], {
            className: "cursor-pointer absolute z-10",
          })
        : undefined}
      {isMoveSquare ? (
        <div className="w-4 h-4 rounded-full bg-green-800" />
      ) : undefined}
      {isTakeSquare ? <TakeSquare /> : undefined}
    </div>
  );
};

export default Square;
