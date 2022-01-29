import Chessboard from "chessboardjsx"
import dynamic from "next/dynamic"

const chessboardNoSSR = dynamic(
    () => {
        return import("chessboardjsx");
    },
    {ssr : false}
  )

function chessGame(){

    return(
        <div>
            <chessboardNoSSR position="start"/>
            <h1>Hello</h1>
        </div>
    )

}

export default chessGame;