import {useState, useEffect} from "react"
import io from "socket.io-client"

const FLASK_ENDPOINT = "http://localhost:5000"
let socket = io.connect(FLASK_ENDPOINT)


function Chess(){

    const [chatLogs, setChatLogs] = useState (["Welcome to Player 1 and 2 to Chess"]);
    const [message, setMessage] = useState("");

    function getMessages(){
        socket.on("message", msg => {
          setChatLogs([...chatLogs, msg]);
        })
      }
    
      useEffect(() => {
        getMessages();
        console.log(chatLogs);
      }, [chatLogs.length]);
    
      // UI Logic
      function changeTextBox(e){
        setMessage(e.target.value);
      }
    
      //When Send button is clicked
      function onSendClick(){
        //Send the message to the Flask Socket Server 
        if(message !== ""){
          socket.emit("message", message);
          // console.log(message);
          setMessage("");
        } else{
          console.log("Bro Message can't be empty!!")
        }
      } 
    return(
        <div className="Chess">
            {
            //Display chat logs
            chatLogs.length > 0 && chatLogs.map((msg, index) => { 
            return(
                <div className="chat-message" key={index}>
                <p>{msg}</p>
                </div>
            )})
            }
            <input value={message} name="message" onChange={e => {changeTextBox(e)}}/>
            <button onClick={onSendClick}>Send Message</button>
        </div>
    )
}

export default Chess;