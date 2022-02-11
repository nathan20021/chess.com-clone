from flask import Flask, redirect, url_for, request, session
from flask_session import Session
from flask_socketio import SocketIO, send, emit, join_room
from config import ApplicationConfig
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object(ApplicationConfig)

socketio = SocketIO(app, cors_allowed_origins='*', async_mode="eventlet")
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
@socketio.on('join')
def on_join(data):
    if data['room']!="host":
        join_room(USERS[data['room']]['sid'])
        print(f"{request.sid} has joined room {USERS[data['room']]['sid']}")
        # to=USERS[data['room']]['sid'],
        send(f"Welcome to {request.sid}, {data['username']}", broadcast=True)
    else:
        join_room(request.sid)
        print(f"{request.sid} has joined room {request.sid}")
        send( f"Welcome to {request.sid}, {data['username']}")

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
            "host"   : USERS[roomHost]['sid'],
            "status" : "in-game",
            "sid"    : request.sid,
            "with"   : roomHost,
            "withSid": USERS[roomHost]["sid"],
        }
        if(USERS[roomHost]["side"] == "black"):
            USERS[userName]["side"] = "white"
        else:
            USERS[userName]["side"] = "black"

        # Sending data to the host 
        to_send = {
            "host"    : USERS[roomHost]['sid'],
            "status"  : "in-game",
            "sid"     : USERS[roomHost]["sid"],
            "with"    : userName,
            "withSid" : request.sid,
            "side"    : USERS[roomHost]["side"]
        }
        # join_room(roomHost)
        # print(f"{userName} has join room: {USERS[roomHost]['sid']}")
        print(f"{to_send}")
        #, to=USERS[roomHost]['sid']
        emit("connect-user", to_send, broadcast=True)
        return True
    except:
        return False


@socketio.on("create-user")
def onCreateUser(payload):
    USERS[payload['username']] = {
        "host"    : request.sid,
        "status" : "pending",
        "sid"    : request.sid,
        "with"   : "None",
        "withSid": "None",
        "side"   : payload['side']
    }
    # join_room(request.sid)
    # print(f"{payload['username']} has join room: {request.sid}")

    # session['username']= payload['username']

@socketio.on('disconnect')
def disconnect():
    pass


@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)
    return None

@socketio.on("chess-move")
def handleChessMove(chessMoveData):
    # room=USERS[chessMoveData['username']]['withSid']
    print(f"{request.sid} is Sending data via room: {chessMoveData['host']}")
    #, room=chessMoveData['host']

    emit("update-chess-move", chessMoveData['move'], broadcast=True)

#------------------------- app routing ------------------------------------
@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))


@app.route('/api/user/<username>', methods=['GET'])
def get_user(username):
    return USERS[username], 200

@app.route('/api/users', methods=['GET'])
def get_users():
    return USERS, 200

if __name__ == "__main__":
    socketio.run(app, port=5000)
