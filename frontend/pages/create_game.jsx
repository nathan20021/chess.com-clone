import {useState} from "react"
import io from "socket.io-client"
const FLASK_ENDPOINT = "http://localhost:5000"
let socket = io.connect(FLASK_ENDPOINT)

function createGame(){
    const [username, setUsername] = useState("");
    const [friendUsername, setFriendUsername] = useState("");
    const [side, setSide] = useState("white")

    function connectToGame(){
        console.log("lmaoo");
        return "lol"
    }

    function createGame(){
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
            <button onClick={createGame} > Create A Game </button>
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
            <button onClick={()=>{
                socket.emit("connect-to-game", {client: username, friend: friendUsername});

            }} > Join Game </button>


        </div>
    )

}


export default createGame;