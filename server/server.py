from flask import Flask, redirect, url_for
from flask_socketio import SocketIO, send, emit
from flask_socketio import join_room, leave_room


app = Flask(__name__)
app.config['SECRET_KEY'] = 'My name is Jeff'
socketio = SocketIO(app, cors_allowed_origins='*')

#Set-up logging to ERROR only
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.INFO)

#Change on deployment
app.host = 'localhost'

#Socket listening to messages
@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)
    return None

@socketio.on("chess-move")
def handleChessMove(chessMoveData):
    print(f"Chess Move: {chessMoveData}")
    # emit("Got the chess-move", {"chessMoveData":chessMoveData})
    return None

#app routing 
@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))



@app.route('/')
@app.route('/home')
def home():
    return "<div> Hello </div>"    

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
