import {useState, useEffect} from "react"
import * as ChessJS from "chess.js";
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router'
import configData from "../../config.json"
import axios from 'axios'

import io from "socket.io-client"
let socket = io.connect(configData.SOCKET_URL)

const Chessboard = dynamic(() => import('chessboardjsx'), {
  ssr: false
});

const Chessjs = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
const game = new Chessjs();


function ChessGame(){
  //------------------------- Chess States -------------------------------
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [currentSquare, setCurrentSquare] = useState("");
  const [currentPieceSquare, setCurrentPieceSquare] = useState("");
  
  //---------------------- Connection State  ----------------------------
  const [username, setUsername] = useState(useRouter().query.id);
  const [gameState, setGameState] = useState({});
  //-------------------- Chat States -------------------------------
  const [chatLogs, setChatLogs] = useState (["Welcome to Player 1 and 2 to Chess"]);
  const [message, setMessage] = useState("");
  //-------------- Initial Talk to Server ----------------------------

  useEffect(()=>{

    async function fetchUserData(){
      if(Object.keys(gameState).length === 0 && gameState.constructor === Object){
        let response = await fetch(`${configData.FLASK_URL}/user/${username}`);
        response = await response.json();
        setGameState(response)
      }
    }
    fetchUserData();
  }, [])

  useEffect(() =>{
   
    socket.on("connect-user", connectRequest=>{
      console.log("------------------------ connectRequest -----------------------");
      console.log(connectRequest);
      console.log("------------------------ --------------- -----------------------");

      setGameState(connectRequest);
    })

    socket.on("update-chess-move", chessData =>{
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
  }, [socket, game])

  useEffect(()=>{
    socket.open();
    
    socket.on("message", msg=>{
      setChatLogs([...chatLogs, msg]);
    })  

    // return( ()=>{
    //   socket.close();
    // })
  }, [socket,chatLogs.length])
    
  // UI Logic
  function changeTextBox(e){
    setMessage(e.target.value);
  }

  //When Send button is clicked
  function onSendClick(event){
    //Send the message to the Flask Socket Server 
    if(event.key ==='Enter'){
      if(message !== ""){
        socket.emit("message", message);
        setMessage("");
      } else{
        console.log("Bro Message can't be empty!!")
        console.log(document.cookie);
      }
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
        socket.emit("chess-move", {move: move, host : gameState.host});
    }
  }

  function onSquareClick(square){
      console.log("onSquareClick: " + square);
      console.log(fen);
      console.log(gameState);
  };

  function mouseOverSquare(square){
      console.log(square);
  }


  return(
      <div id="Chess" className="flex flex-row bg-[#1F2937] gap-4
                                  w-screen h-screen text-white                               
                                  overflow-hidden                "
      >
        {/* <h1>
          {gameState.status}
        </h1> */}
        <div id="ChessBoard">
          <h1>{gameState.with} </h1>
            <Chessboard
                onDrop={onDrop}
                onSquareClick={onSquareClick}
                position={fen}
                mouseOverSquare={mouseOverSquare}
                orientation={gameState.side}
                />
            <h1>{username} </h1>
          </div>

          <div id="game-box">
            <div id="history-box" className="h-1/2 overflow-y-auto overflow-x-hidden mt-5">
            {history.map( move => 
              <p key={move}>{move}</p>)
            }
            </div>
          <div id="chat-box" className="h-1/2  overflow-y-auto overflow-x-hidden">

            {
              //Display chat logs
              chatLogs.length > 0 && chatLogs.map((msg, index) => { 
                return(
                  <div className="chat-message" key={index}>
                  <p>{msg}</p>
                  </div>
              )})
            }
            <input
              className="appearance-none rounded-md
                block w-full px-3 py-2 my-2
                border border-gray-300 placeholder-gray-500 
                text-gray-900  focus:outline-none 
                focus:ring-indigo-500 focus:border-indigo-500 
                focus:z-10 sm:text-sm" 
              value={message} 
              name="message" 
              onChange={e => {changeTextBox(e)}}
              onKeyPress={onSendClick}
              />
          </div>
          </div>
      </div>
  )
}

export default ChessGame;