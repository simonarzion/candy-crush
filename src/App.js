import React, { useEffect, useState } from 'react';
import './App.css';

const width = 8;
const candyColors = ['red', 'yellow', 'blue', 'green', 'orange', 'purple'];

const App = () => {
  const [board, setBoard] = useState([]);
  const [candyBeingDragged, setCandyBeingDragged] = useState(null);
  const [candyBeingReplazed, setCandyBeingReplazed] = useState(null);

  const createBoard = () => {
    const boardCopy = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      boardCopy.push(randomColor);
    }
    setBoard(boardCopy);
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = board[i];

      if (columnOfFour.every((col) => board[col] === decidedColor)) {
        columnOfFour.forEach((square) => (board[square] = 'white'));
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfFour = [i, i + 1, i + 2, 1 + 3];
      const decidedColor = board[i];
      const invalidSquares = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63,
      ];

      if (invalidSquares.includes(i)) continue;

      if (rowOfFour.every((col) => board[col] === decidedColor)) {
        rowOfFour.forEach((square) => (board[square] = 'white'));
        return true;
      }
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = board[i];

      if (columnOfThree.every((col) => board[col] === decidedColor)) {
        columnOfThree.forEach((square) => (board[square] = 'white'));
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < width * width; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = board[i];
      const invalidSquares = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

      if (invalidSquares.includes(i)) continue;

      if (rowOfThree.every((col) => board[col] === decidedColor)) {
        rowOfThree.forEach((square) => (board[square] = 'white'));
        return true;
      }
    }
  };

  const handleClick = (index) => {
    console.log(index);
  };

  const handleDragEnter = (e) => {
    setCandyBeingDragged(e.target);
  };

  const handleDrop = (e) => {
    setCandyBeingReplazed(e.target);
  };

  const handleDragEnd = (e) => {
    const candyBeingDraggedId = parseInt(candyBeingDragged.getAttribute('data-id'));
    const candyBeingReplazedId = parseInt(candyBeingReplazed.getAttribute('data-id'));

    board[candyBeingReplazedId] = candyBeingDragged.style.backgroundColor;
    board[candyBeingDraggedId] = candyBeingReplazed.style.backgroundColor;

    const validMoves = [
      candyBeingDraggedId + width,
      candyBeingDraggedId - width,
      candyBeingDraggedId + 1,
      candyBeingDraggedId - 1,
    ];

    const isValidMove = validMoves.includes(candyBeingReplazedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (
      candyBeingReplazedId &&
      isValidMove &&
      (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)
    ) {
      setCandyBeingDragged(null);
      setCandyBeingReplazed(null);
      console.log('a');
    } else {
      board[candyBeingReplazedId] = candyBeingReplazed.style.backgroundColor;
      board[candyBeingDraggedId] = candyBeingDragged.style.backgroundColor;
      setBoard([...board]);
      console.log('aa');
    }
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const moveIntoSquareBelow = () => {
      for (let i = 0; i <= 55; i++) {
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);

        if (isFirstRow && board[i] === 'white') {
          const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
          board[i] = randomColor;
        }

        if (board[i + width] === 'white') {
          board[i + width] = board[i];
          board[i] = 'white';
        }
      }
    };
    const interval = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setBoard([...board]);
    }, 100);

    return () => clearInterval(interval);
  }, [board]);

  return (
    <div className='board'>
      {board.map((candy, index) => {
        return (
          <div
            draggable
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDragStart={handleDragEnter}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            key={index}
            data-id={index}
            onClick={() => handleClick(index)}
            className={`candy`}
            style={{ backgroundColor: candy }}
          ></div>
        );
      })}
    </div>
  );
};

export default App;
