export default class Game{
    constructor(){
        const Chess = require('chess.js');
        const chess = new Chess();
        console.log(chess.ascii());
        
    }

}