// src/components/Piece.js
import React from 'react';
import './Piece.css';

const Piece = ({ type, color }) => {
  const unicodePieces = {
    P: { white: '♙', black: '♟' },
    R: { white: '♖', black: '♜' },
    N: { white: '♘', black: '♞' },
    B: { white: '♗', black: '♝' },
    Q: { white: '♕', black: '♛' },
    K: { white: '♔', black: '♚' }
  };

  return (
    <div className={`piece ${color}`}>
      {unicodePieces[type] ? unicodePieces[type][color] : null}
    </div>
  );
};

export default Piece;
