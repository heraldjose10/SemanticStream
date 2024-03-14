from flask import Flask, render_template, session, copy_current_request_context
from flask_socketio import (
    SocketIO,
    emit,
    join_room,
    leave_room,
    rooms,
    close_room,
    disconnect,
)

from config import configs

app = Flask(__name__)
app.config.from_object(configs["development"])
socketio = SocketIO(app)


@app.route("/")
def hello():
    return render_template("index.html")


@socketio.event
def my_event(message):
    session["receive_count"] = session.get("receive_count", 0) + 1
    # send response back to client
    emit("my_response", {"data": message["data"], "count": session["receive_count"]})


@socketio.event
def my_broadcast_event(message):
    session["receive_count"] = session.get("receive_count", 0) + 1
    emit(
        "my_response",
        {"data": message["data"], "count": session["receive_count"]},
        broadcast=True,
    )


@socketio.event
def join(message):
    join_room(message["room"])
    session["receive_count"] = session.get("receive_count", 0) + 1
    emit(
        "my_response",
        {"data": "In rooms: " + ", ".join(rooms()), "count": session["receive_count"]},
    )


@socketio.on("close_room")
def on_close_room(message):
    session["receive_count"] = session.get("receive_count", 0) + 1
    emit(
        "my_response",
        {
            "data": "Room " + message["room"] + " is closing.",
            "count": session["receive_count"],
        },
        to=message["room"],
    )
    close_room(message["room"])


@socketio.event
def leave(message):
    leave_room(message["room"])
    session["receive_count"] = session.get("receive_count", 0) + 1
    emit(
        "my_response",
        {"data": "In rooms: " + ", ".join(rooms()), "count": session["receive_count"]},
    )


@socketio.event
def my_room_event(message):
    session["receive_count"] = session.get("receive_count", 0) + 1
    # send the message to the given room
    emit(
        "my_response",
        {"data": message["data"], "count": session["receive_count"]},
        to=message["room"],
    )


@socketio.event
def disconnect_request():

    @copy_current_request_context
    def can_disconnect():
        disconnect()

    session["receive_count"] = session.get("receive_count", 0) + 1
    # for this emit we use a callback function
    # when the callback function is invoked we know that the message has been
    # received and it is safe to disconnect
    emit(
        "my_response",
        {"data": "Disconnected!", "count": session["receive_count"]},
        callback=can_disconnect,
    )


@socketio.event
def my_ping():
    emit("my_pong")


if __name__ == "__main__":
    socketio.run(app)
