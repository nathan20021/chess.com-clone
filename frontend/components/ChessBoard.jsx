import { useState } from "react";
import * as ChessJS from "chess.js";
import dynamic from 'next/dynamic';

const Chessboard = dynamic(() => import('chessboardjsx'), {
  ssr: false  // <- this do the magic ;)
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
            game.load(fen);
            setHistory(game.history({ verbose: true }));
        }
    }

    function onSquareClick(square){
        console.log("onSquareClick: " + square);
        console.log(fen);
        // let move = game.move({
        //     from: currentPieceSquare,
        //     to: square,
        //     promotion: "q" // always promote to a queen for example simplicity
        // });
        
        // setCurrentPieceSquare(square);
        // // illegal move
        // if (move === null) return;
        // setFen(game.fen()),
        // setHistory(game.history({ verbose: true })),
        // setCurrentPieceSquare("")


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
             <p>{fen}</p>
        </div>
    )
}

export default ChessBoard;