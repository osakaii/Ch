import { cloneElement } from "react";
import { Piece, pieceImages } from "shared/pieceImages";
import { twMerge } from "tailwind-merge";
import "./index.css";

type SquareProps = {
  isBlack?: boolean;
  piece: Piece | undefined;
  isAvailable: boolean;
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

const Square = ({ isBlack, piece, isAvailable, onClick }: SquareProps) => {
  const isMoveSquare = isAvailable && !piece;
  const isTakeSquare = isAvailable && piece;

  const backgroundStyle = isBlack ? "bg-dark" : "bg-white";

  return (
    <div
      className={twMerge(
        "w-16 h-16 flex justify-center items-center relative overflow-hidden",
        backgroundStyle,
      )}
      onClick={onClick}
    >
      {piece
        ? cloneElement(pieceImages[piece], { className: "cursor-pointer" })
        : undefined}
      {isMoveSquare ? (
        <div className="w-4 h-4 rounded-full bg-green-800" />
      ) : undefined}
      {isTakeSquare ? <TakeSquare /> : undefined}
    </div>
  );
};

export default Square;
