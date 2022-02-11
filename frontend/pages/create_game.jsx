import {useState, useEffect} from "react"
import configData from "../config.json"
import Link from 'next/link'
import Image from 'next/image'
import { RadioGroup } from '@headlessui/react'

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
        <div className="flex flex-col justify-center items-center 
                        w-screen h-screen 
                        bg-[#1F2937] " 
            id="create-game-container" >

            <h1 className="mb-12 text-5xl font-bold text-[#766ffa]">Multiplayer Chess</h1>

            <div className="bg-[#dbdbdb] p-5 rounded-2xl
                                flex justify-center items-center 
                            w-1/2 
                            " 
                    id="create-game-box" >
                <div id ="inner-container" 
                    className="w-3/4 flex flex-col
                                justify-center items-center 
                                space-y-4 ">
                    <input 
                        className="appearance-none rounded-md
                                    relative block w-full px-3 py-2 my-2
                                    border border-gray-300 placeholder-gray-500 
                                    text-gray-900  focus:outline-none 
                                    focus:ring-indigo-500 focus:border-indigo-500 
                                    focus:z-10 sm:text-sm"
                        required
                        value={username} 
                        type="text" 
                        name="userName" 
                        placeholder="Username"
                        onChange={e => {setUsername(e.target.value)}}
                    />
                    <h2 className="pt-10">Create a game</h2>

                    <div id="side-selector" className="w-full flex">
                    <RadioGroup value={side} onChange={setSide} className="flex w-full gap-3">
                            <div className="w-1/2 text-center">
                                <RadioGroup.Option className={({checked}) =>`${checked ? 'bg-blue-200 border-2' : 'hover:cursor-pointer border-1'} h-10 border-2 border-black`} value="white">
                                <div className="flex justify-center items-center w-full h-full">
                                        <span>White</span>
                                    </div>
                                </RadioGroup.Option>
                            </div>
                            <div className="w-1/2 text-center">
                                <RadioGroup.Option className={({checked}) =>`${checked ? 'bg-blue-200 border-2' : 'hover:cursor-pointer border-1'} h-10 border-2 border-black`} value="black">
                                    <div className="flex justify-center items-center w-full h-full">
                                        <span>Black</span>
                                    </div>
                                </RadioGroup.Option>
                            </div>


                    </RadioGroup>
                    </div>

                        <Link href={`/chess/${username}`}>
                            <button className="rounded-md bg-[#4F46E5] text-slate-200
                                                w-full p-2
                                                " 
                            
                            onClick={createGame} > Host a Game </button>
                        </Link>
                        
                        <h2 className="pt-10">Join a Game</h2>
                        <input 
                            className="appearance-none rounded-md
                                    relative block w-full px-3 py-2 
                                    border border-gray-300 placeholder-gray-500 
                                    text-gray-900  focus:outline-none 
                                    focus:ring-indigo-500 focus:border-indigo-500 
                                    focus:z-10 sm:text-sm"
                            value={friendUsername} 
                            type="text" 
                            name="friendName" 
                            placeholder="Corn Soup"
                            onChange={e => {setFriendUsername(e.target.value)}}
                        />
                        <Link href={`/chess/${username}`}>
                            <button className="rounded-md bg-[#4F46E5] text-slate-200
                                            w-full p-2
                                            "  
                            onClick={connectToGame} > Join Game </button>
                        </Link>

                </div>

            </div>


        </div>
    )

}


export default createGame;