from flask import Flask, redirect, url_for
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'My name is Jeff'
socketio = SocketIO(app, cors_allowed_origins='*')

#Change on deployment
app.debug = True
app.host = 'localhost'

#Socket listening to messages
@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)
    return None

#app routing 
@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))

@app.route('/')
@app.route('/home')
def home():
    return None    

if __name__ == "__main__":
    socketio.run(app)
