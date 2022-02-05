from flask import Flask, redirect, url_for, request, session
from flask_session import Session
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from config import ApplicationConfig


app = Flask(__name__)
app.config.from_object(ApplicationConfig)

socketio = SocketIO(app, cors_allowed_origins='*')
server_session = Session(app)

#Set-up logging to ERROR only
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

#Change on deployment
app.host = 'localhost'
app.debug = True;
USERS={}
#------------------------- socket ----------------------------------------
@socketio.on('connect')
def connect(auth):
    pass
    # print("----------------------- | Connected | -----------------------------")
    # print(f"User Connected with ID: {request.sid}")
    # print("-------------------------------------------------------------")

@socketio.on('connect-to-game')
def connect_to_game(payload):
    try:
        roomHost = payload['friendUsername']
        userName = payload['username']
        USERS[roomHost]["with"] = userName
        USERS[roomHost]["withSid"] = request.sid
        USERS[roomHost]["status"] = "in-game"

        # Create the player object
        USERS[userName] = {
            "status" : "in-game",
            "sid"    : request.sid,
            "with"   : roomHost,
            "withSid": USERS[roomHost]["sid"],
        }
        if(USERS[roomHost]["side"] == "black"):
            USERS[userName]["side"] = "white"
        else:
            USERS[userName]["side"] = "black"
        return True
    except:
        return False


@socketio.on("create-user")
def onCreateUser(payload):
    USERS[payload['username']] = {
        "status" : "pending",
        "sid"    : request.sid,
        "with"   : "None",
        "withSid": "None",
        "side"   : payload['side']
    }
    session['username']= payload['username']


@socketio.on('disconnect')
def disconnect():
    # print("########################| Disconnected | ########################")
    # print(f"User disconnected with ID: {request.sid}")
    # print("##################################################################")
    pass


@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)
    return None

@socketio.on("chess-move")
def handleChessMove(chessMoveData):
    print(f"{request.sid} Move: {chessMoveData}")
    return None

#------------------------- app routing ------------------------------------
@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))



@app.route('/')
@app.route('/home')
def home():
    return "<div> Hello </div>"

@app.route('/user', methods=['GET'])
def get_user():
    return USERS

if __name__ == "__main__":
    socketio.run(app, port=5000)
