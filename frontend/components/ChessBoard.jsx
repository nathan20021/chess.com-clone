import { useState } from "react";
import * as ChessJS from "chess.js";
import dynamic from 'next/dynamic';

const Chessboard = dynamic(() => import('chessboardjsx'), {
  ssr: false
});

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
const game = new Chess();

function ChessBoard(){
    

    const [fen, setFen] = useState("start");
    const [history, setHistory] = useState([]);
    const [currentSquare, setCurrentSquare] = useState("");
    const [currentPieceSquare, setCurrentPieceSquare] = useState("");

    function onDrop( {sourceSquare, targetSquare} ){
        // Pass in an object with sourceSquare and targetSquare 
        console.log(`on Drop: from ${sourceSquare} to ${targetSquare}`);
        let move = game.move({
            from : sourceSquare,
            to: targetSquare,
            promotion: "q"
        })
        if(move !== null){
            setFen(game.fen());
            setHistory(game.history());
        }
    }

    function onSquareClick(square){
        console.log("onSquareClick: " + square);
        console.log(fen);
    };

    function mouseOverSquare(square){
        console.log(square);
    }

    return (
        <div>
            <Chessboard
                onDrop={onDrop}
                onSquareClick={onSquareClick}
                position={fen}
                mouseOverSquare={mouseOverSquare}
             />
             <p>
                {history.forEach(
                item=>{
                    return(
                        <p>{item}</p>
                    )}
                )}
             </p>
        </div>
    )
}

export default ChessBoard;