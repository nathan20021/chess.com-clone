import {useState, useEffect} from "react"
import * as ChessJS from "chess.js";
import dynamic from 'next/dynamic';
import configData from "../config.json"

import io from "socket.io-client"
let socket = io.connect(configData.SOCKET_URL)

const Chessboard = dynamic(() => import('chessboardjsx'), {
  ssr: false
});

const Chessjs = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
const game = new Chessjs();


function Chess(){
  //----------- Chess States ----------------------------------
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [currentSquare, setCurrentSquare] = useState("");
  const [currentPieceSquare, setCurrentPieceSquare] = useState("");
  
  //-------------- Initial Talk to Server ----------------------------
  useEffect(()=>{
    
  }, [])

  //----------- Chat States ----------------------------------
    const [chatLogs, setChatLogs] = useState (["Welcome to Player 1 and 2 to Chess"]);
    const [message, setMessage] = useState("");

    function getMessages(){
        socket.on("message", msg => {
          setChatLogs([...chatLogs, msg]);
        })
      }

    function socketInitializer(){
      socket.on("message", msg => {
        setChatLogs([...chatLogs, msg]);
      })

      socket.on("update-chess-move", chessData =>{
        console.log(chessData.from);
        let move = game.move({
          from : chessData.from,
          to: chessData.to,
          promotion: "q"
        })
        if(move !== null){
          setFen(game.fen());
          setHistory(game.history());
        }
      })
    }
      useEffect(() => {
        socketInitializer();
      }, [socket]);
    
      // UI Logic
      function changeTextBox(e){
        setMessage(e.target.value);
      }
    
      //When Send button is clicked
      function onSendClick(){
        //Send the message to the Flask Socket Server 
        if(message !== ""){
          socket.emit("message", message);
          setMessage("");
        } else{
          console.log("Bro Message can't be empty!!")
          console.log(document.cookie);
        }
      }
      
    // --------------------------- Chess Stuffs ---------------------------------------  

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
            socket.emit("chess-move", move);
            console.log(history);
        }
    }

    function onSquareClick(square){
        console.log("onSquareClick: " + square);
        console.log(fen);
        console.log(history);
    };

    function mouseOverSquare(square){
        console.log(square);
    }


    return(
        <div className="Chess">
          <div id="ChessBoard">
            <Chessboard
                onDrop={onDrop}
                onSquareClick={onSquareClick}
                position={fen}
                mouseOverSquare={mouseOverSquare}
                />
              {history.map( move => <p>{move}</p>)}
            </div>

            <div id="ChatBox">
            {
              //Display chat logs
              chatLogs.length > 0 && chatLogs.map((msg, index) => { 
                return(
                  <div className="chat-message" key={index}>
                  <p>{msg}</p>
                  </div>
              )})
            }
            </div>
            <input value={message} name="message" onChange={e => {changeTextBox(e)}}/>
            <button onClick={onSendClick}>Send Message</button>
        </div>
    )
}

export default Chess;