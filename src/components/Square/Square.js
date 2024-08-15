import React from "react";
import "./Square.css";
import Piece from "../Piece/Piece";

const Square = ({ piece, isDark }) => {
  // Apenas renderiza a peça, não afeta o estilo do quadrado
  return (
    <div className={`square-piece ${piece ? piece.color : ""}`}>
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

export default Square;
