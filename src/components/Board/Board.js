import React, { useState } from "react";
import Square from "../Square/Square";
import "./Board.css";

const Board = () => {
  const initialBoard = [
    [
      { type: "R", color: "black" },
      { type: "N", color: "black" },
      { type: "B", color: "black" },
      { type: "Q", color: "black" },
      { type: "K", color: "black" },
      { type: "B", color: "black" },
      { type: "N", color: "black" },
      { type: "R", color: "black" },
    ],
    Array(8).fill({ type: "P", color: "black", moved: false }),
    ...Array(4).fill(Array(8).fill(null)),
    Array(8).fill({ type: "P", color: "white", moved: false }),
    [
      { type: "R", color: "white" },
      { type: "N", color: "white" },
      { type: "B", color: "white" },
      { type: "Q", color: "white" },
      { type: "K", color: "white" },
      { type: "B", color: "white" },
      { type: "N", color: "white" },
      { type: "R", color: "white" },
    ],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("white"); // Jogador atual
  const [whitePawnMoved, setWhitePawnMoved] = useState(false);
  const [blackPawnMoved, setBlackPawnMoved] = useState(false);

  const handleSquareClick = (row, col) => {
    if (selectedPiece) {
      if (possibleMoves.some(([r, c]) => r === row && c === col)) {
        const piece = selectedPiece.piece;

        // Verifica se a peça é do jogador atual
        if (piece.color !== currentPlayer) {
          return;
        }

        const newBoard = board.map((r) => r.slice());
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        const movedPiece = { ...piece, moved: true };
        newBoard[row][col] = movedPiece;

        // Atualiza o estado de peão movido
        if (piece.color === "white" && !whitePawnMoved) {
          setWhitePawnMoved(true);
        }
        if (piece.color === "black" && !blackPawnMoved) {
          setBlackPawnMoved(true);
        }

        // Verifica promoção de peões
        if (
          (movedPiece.color === "white" && row === 0) ||
          (movedPiece.color === "black" && row === 7)
        ) {
          if (movedPiece.type === "P") {
            const newPieceType = prompt(
              "Promova o peão para: Q (Dama), R (Torre), B (Bispo), C (Cavalo)"
            );
            if (["Q", "R", "B", "C"].includes(newPieceType)) {
              newBoard[row][col] = { ...movedPiece, type: newPieceType };
            } else {
              alert("Tipo de peça inválido!");
              newBoard[row][col] = movedPiece; // Reverte a peça para peão se a promoção falhar
            }
          }
        }

        setBoard(newBoard);
        setSelectedPiece(null);
        setPossibleMoves([]);

        // Alterna o jogador
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (board[row][col]) {
      const piece = board[row][col];
      if (piece.color === currentPlayer) {
        setSelectedPiece({ piece, row, col });
        const moves = getPossibleMoves(board, row, col);
        setPossibleMoves(moves);
      }
    }
  };

  const getPossibleMoves = (board, row, col) => {
    const piece = board[row][col];
    let moves = [];

    if (piece.type === "P") {
      const direction = piece.color === "white" ? -1 : 1;
      const startRow = piece.color === "white" ? 6 : 1;

      // Movimento básico (uma casa para frente)
      if (board[row + direction] && !board[row + direction][col]) {
        moves.push([row + direction, col]);

        // Movimento duplo (duas casas para frente a partir da posição inicial)
        if (
          row === startRow &&
          !board[row + 2 * direction][col] &&
          ((piece.color === "white" && !whitePawnMoved) ||
            (piece.color === "black" && !blackPawnMoved))
        ) {
          moves.push([row + 2 * direction, col]);
        }
      }

      // Captura diagonal
      const captureMoves = [
        [row + direction, col - 1], // Diagonal esquerda
        [row + direction, col + 1], // Diagonal direita
      ];
      captureMoves.forEach(([r, c]) => {
        if (board[r] && board[r][c] && board[r][c].color !== piece.color) {
          moves.push([r, c]);
        }
      });
    } else if (piece.type === "R") {
      // Movimento da torre
      const directions = [
        { row: -1, col: 0 }, // Para cima
        { row: 1, col: 0 }, // Para baixo
        { row: 0, col: -1 }, // Para esquerda
        { row: 0, col: 1 }, // Para direita
      ];

      directions.forEach(({ row: rDir, col: cDir }) => {
        let r = row;
        let c = col;
        while (true) {
          r += rDir;
          c += cDir;
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c]) {
              if (board[r][c].color !== piece.color) {
                moves.push([r, c]); // Captura
              }
              break; // Não pode pular peças
            } else {
              moves.push([r, c]); // Movimento vazio
            }
          } else {
            break; // Sai do tabuleiro
          }
        }
      });
    } else if (piece.type === "N") {
      // Movimento do cavalo
      const knightMoves = [
        { row: -2, col: -1 },
        { row: -1, col: -2 },
        { row: 1, col: -2 },
        { row: 2, col: -1 },
        { row: 2, col: 1 },
        { row: 1, col: 2 },
        { row: -1, col: 2 },
        { row: -2, col: 1 },
      ];

      knightMoves.forEach(({ row: rDir, col: cDir }) => {
        const r = row + rDir;
        const c = col + cDir;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          if (!board[r][c] || board[r][c].color !== piece.color) {
            moves.push([r, c]); // Movimento ou captura
          }
        }
      });
    } else if (piece.type === "B") {
      // Movimento do bispo
      const directions = [
        { row: -1, col: -1 }, // Diagonal superior esquerda
        { row: -1, col: 1 }, // Diagonal superior direita
        { row: 1, col: -1 }, // Diagonal inferior esquerda
        { row: 1, col: 1 }, // Diagonal inferior direita
      ];

      directions.forEach(({ row: rDir, col: cDir }) => {
        let r = row;
        let c = col;
        while (true) {
          r += rDir;
          c += cDir;
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c]) {
              if (board[r][c].color !== piece.color) {
                moves.push([r, c]); // Captura
              }
              break; // Não pode pular peças
            } else {
              moves.push([r, c]); // Movimento vazio
            }
          } else {
            break; // Sai do tabuleiro
          }
        }
      });
    } else if (piece.type === "K") {
      // Movimento do rei
      const kingMoves = [
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ];

      kingMoves.forEach(({ row: rDir, col: cDir }) => {
        const r = row + rDir;
        const c = col + cDir;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          if (!board[r][c] || board[r][c].color !== piece.color) {
            moves.push([r, c]); // Movimento ou captura
          }
        }
      });
    } else if (piece.type === "Q") {
      // Movimento da rainha
      // Combinando movimentos da torre e do bispo
      const directions = [
        { row: -1, col: 0 }, // Para cima
        { row: 1, col: 0 }, // Para baixo
        { row: 0, col: -1 }, // Para esquerda
        { row: 0, col: 1 }, // Para direita
        { row: -1, col: -1 }, // Diagonal superior esquerda
        { row: -1, col: 1 }, // Diagonal superior direita
        { row: 1, col: -1 }, // Diagonal inferior esquerda
        { row: 1, col: 1 }, // Diagonal inferior direita
      ];

      directions.forEach(({ row: rDir, col: cDir }) => {
        let r = row;
        let c = col;
        while (true) {
          r += rDir;
          c += cDir;
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c]) {
              if (board[r][c].color !== piece.color) {
                moves.push([r, c]); // Captura
              }
              break; // Não pode pular peças
            } else {
              moves.push([r, c]); // Movimento vazio
            }
          } else {
            break; // Sai do tabuleiro
          }
        }
      });
    }

    return moves;
  };

  const renderSquare = (row, col) => {
    const isSelected =
      selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    const isPossibleMove = possibleMoves.some(
      ([r, c]) => r === row && c === col
    );
    const isDark = (row + col) % 2 === 1;
    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"} ${
          isSelected ? "selected" : ""
        } ${isPossibleMove ? "possible-move" : ""}`}
        onClick={() => handleSquareClick(row, col)}
      >
        <Square piece={board[row][col]} />
      </div>
    );
  };

  const createBoard = () => {
    let boardRows = [];
    for (let row = 0; row < 8; row++) {
      let squares = [];
      for (let col = 0; col < 8; col++) {
        squares.push(renderSquare(row, col));
      }
      boardRows.push(
        <div key={row} className="board-row">
          {squares}
        </div>
      );
    }
    return boardRows;
  };

  return (
    <div className="board-container">
      <div className="board">{createBoard()}</div>
    </div>
  );
};

export default Board;
