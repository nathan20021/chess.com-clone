import {useState, useEffect} from "react"
import configData from "../config.json"
import Link from 'next/link'

import io from "socket.io-client"
let socket = io.connect(configData.SOCKET_URL)



function createGame(){
    const [username, setUsername] = useState("");
    const [friendUsername, setFriendUsername] = useState("");
    const [side, setSide] = useState("white")

    useEffect(()=>{
        // console.log(session);
    }, [])

    function connectToGame(){
        socket.emit('join', {username: username,room:friendUsername})

        socket.emit("connect-to-game", {
            username: username,
            friendUsername: friendUsername
        });

    }
    function createGame(){
        socket.emit("join", {username: username, room : "host"})
        socket.emit("create-user", {username: username, side: side});

    }

    return(
        <div>
            <label htmlFor="userName">Your preffered username: </label>
            <input 
                value={username} 
                type="text" 
                name="userName" 
                placeholder="Wonton Soup"
                onChange={e => {setUsername(e.target.value)}}
            />
            <br />
            <br />
            <label>
                <input  type="radio" 
                        checked={side==="white"}
                        onChange={() =>{setSide("white")}} 
                        name="side"/>
                White
            </label>
            <br />
            <label>
                <input  type="radio" 
                        checked={side==="black"}
                        onChange={() =>{setSide("black")}}
                        name="side"/>

                Black
            </label>
            <br />
            <br />
            <Link href={`/chess/${username}`}>
                <button onClick={createGame} > Create A Game </button>
            </Link>

            <br />
            <br />
            <br />
            <label htmlFor="friendName">Your friend already set up a game?? Join their game by their username</label>
            <br />
            <br />
            <input 
                value={friendUsername} 
                type="text" 
                name="friendName" 
                placeholder="Corn Soup"
                onChange={e => {setFriendUsername(e.target.value)}}
            />
            <Link href={`/chess/${username}`}>
                <button onClick={connectToGame} > Join Game </button>
            </Link>


        </div>
    )

}


export default createGame;