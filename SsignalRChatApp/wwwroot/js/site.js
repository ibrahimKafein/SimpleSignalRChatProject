﻿var lastFloodingTime = + new Date();
const floodInterval = 3000; // 3 seconds
var newerFloodId = lastFloodingTime;

//#region Send message

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

// send chat Message
document.getElementById("sendMessage").addEventListener("click", event => {
    const user = $("#userName").text();
    const message = $("#chatMessage").val();
    connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
    event.preventDefault();
    $("#chatMessage").val("");
})

//receive chat message
connection.on("ReceiveMessage", (user, message) => {

    $("#messageList").append(createMessageElement(user, message));
    var messageBody = document.querySelector('#messageContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
})

connection.start().catch(err => console.error(err.toString()));

//#endregion Send message

//#region Take Report About online clients

const b2cConnection = new signalR.HubConnectionBuilder()
    .withUrl("/NodeHub")
    .build();

// receive and send  "i am alive" (flooding)
b2cConnection.on("SendMessage", (user, message) => {
    
    
    // message about newer flooding operation?
    if (message < newerFloodId)
        return;
    else newerFloodId = message;
    
    // its me?
    if (echo(user))
        return;

    var control = $("#Subscribers div a[userId=" + user + "]").attr("floodId", message);
    if (typeof control !== undefined && control.length > 0) {
        return;
    }

    $("#Subscribers").append(createSubscriberElement(user, message));
    sendAliveMessage(message);
    lastFloodingTime = +new Date();
})

b2cConnection.start().then(function () {
    sendAliveMessage(+new Date());
});


function sendAliveMessage(floodId) {
    b2cConnection.invoke("SendMessage", $("#userName").text(), floodId).catch(err => console.error(err.toString()));
}

//#endregion Take Report About online clients


function echo(user) {
    return $("#userName").text() == user;
}

function createSubscriberElement(user, message) {
    const div = document.createElement("div");
    const a = document.createElement("a");
    a.textContent = user;
    a.setAttribute("href", "#");
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = "";
    a.append(span);
    a.setAttribute("floodId", message);
    a.setAttribute("userId", user);
    div.append(a);
    return div;
}

function createMessageElement(user, message) {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.className = $("#userName").text() == user ? "alert alert-danger" : "alert alert-info";
    div.setAttribute("role", "alert");
    const p = document.createElement("p");
    p.setAttribute("align", ($("#userName").text() == user ? "left" : "right"));
    p.textContent = message;
    const span = document.createElement("span");
    span.className = $("#userName").text() == user ? "time-left" : "time-right";
    span.textContent = user + " at :" + new Date().toLocaleTimeString();
    div.append(p);
    div.append(span);
    li.append(div);
    return li;
}


// check older subscribers
setInterval(function () {
    if ((+new Date()) - lastFloodingTime > floodInterval) {
        $("#Subscribers div a").each(function (number, element) {
            var floodId = element.getAttribute("floodId");
            if ((floodId*1 + floodInterval) < newerFloodId)
                element.parentElement.remove();
        });
    }
    sendAliveMessage(+new Date());
}, floodInterval);