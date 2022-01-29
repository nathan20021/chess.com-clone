import { useState } from "react";
import * as ChessJS from "chess.js";

 function ChessBoard(){
    //Chess board is 8x8
    
    const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
    const chess = new Chess();
    const [chessFen, setChessFen] = useState(chess.ascii());
    console.log(chessFen);
    chess.move("e4");
    console.log(chess.ascii());
    console.log(chess.board());

    return(
        <div>
            <h1>Chess Board</h1>
        </div>
    )
}

export default ChessBoard;