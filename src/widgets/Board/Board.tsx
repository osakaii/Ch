import { twMerge } from "tailwind-merge";

const boardSquares = Array.from(Array(8).keys()).map(() =>
  Array.from(Array(8).keys()),
);

const isEven = (number: number) => number % 2 === 0;

const isBlack = (row: number, col: number) => {
  return isEven(col) ? isEven(row + 1) : isEven(row);
};

const Square = ({ isBlack }: { isBlack?: boolean }) => {
  const background = isBlack ? "bg-black" : "bg-white";
  return <div className={twMerge("w-1 h-1", background)} />;
};

const Board = () => {
  console.log(boardSquares);
  return (
    <div className="relative">
      <h1 className="">Chess game2</h1>
      <div className="grid grid-cols-8 border-2 border-black">
        {boardSquares.map((row, rowIndex) =>
          row.map((_, colIndex) => {
            const key = rowIndex + colIndex;
            return isBlack(rowIndex, colIndex) ? (
              <Square isBlack key={key} />
            ) : (
              <Square key={key} />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default Board;
