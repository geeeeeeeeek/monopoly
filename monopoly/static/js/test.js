/**
 * Todo delete it after finish dev of frontend js.
 * This file is just for test for purpose, just to provide an example for
 * frontend js development.
 *
 */


function displayMessage(message) {
    var errorElement = document.getElementById("message");
    errorElement.innerHTML = message;
    alert(message)
}

var a = 1;
window.onload = function() {
    // Create a new WebSocket.
    var socket = new WebSocket("ws://" + window.location.host + "/test/");

    // Handle any errors that occur.
    socket.onerror = function(error) {
        displayMessage("WebSocket Error: " + error);
    }

    // Show a connected message when the WebSocket is opened.
    socket.onopen = function(event) {
        displayMessage("WebSocket Connected");
    }


    // Handle messages sent by the server.
    socket.onmessage = function(event) {
         displayMessage(event.data + " " + a.toString());
    }

    // Show a disconnected message when the WebSocket is closed.
    socket.onclose = function(event) {
        displayMessage("WebSocket Disconected");
    }
}
