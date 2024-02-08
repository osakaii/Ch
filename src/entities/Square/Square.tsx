import { cloneElement } from "react";
import { Piece, pieceImages } from "shared/pieceImages";
import { twMerge } from "tailwind-merge";

type SquareProps = {
  isBlack?: boolean;
  piece: Piece | undefined;
  isAvailable: boolean;
  onClick: () => void;
};

const Square = ({ isBlack, piece, isAvailable, onClick }: SquareProps) => {
  const background = isBlack ? "bg-dark" : "bg-white";

  return (
    <div
      className={twMerge(
        "w-16 h-16 flex justify-center items-center",
        background,
      )}
      onClick={onClick}
    >
      {piece
        ? cloneElement(pieceImages[piece], { className: "cursor-pointer" })
        : undefined}
      {isAvailable ? (
        <div className="w-4 h-4 rounded-full bg-green-800" />
      ) : undefined}
    </div>
  );
};

export default Square;
