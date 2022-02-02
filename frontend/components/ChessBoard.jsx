import { useState } from "react";
import * as ChessJS from "chess.js";
import dynamic from 'next/dynamic';

const Chessboard = dynamic(() => import('chessboardjsx'), {
  ssr: false  // <- this do the magic ;)
});

 function ChessBoard(props){
    //Chess board is 8x8
    
    const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
    const chess = new Chess();
    const [chessFen, setChessFen] = useState(chess.ascii());
    console.log(chessFen);
    chess.move("e4");
    console.log(chess.ascii());
    console.log(chess.board());

    if (window === undefined) { 
        return null; 
    }else {
        return (
            <Chessboard position={props.position} /> 
        )
    }
}

export default ChessBoard;