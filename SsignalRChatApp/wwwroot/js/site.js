
//#region Send message

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

document.getElementById("sendMessage").addEventListener("click", event => {
    const user = $("#userName").text();
    const message = $("#chatMessage").val();
    connection.invoke("SendMessage", user, message).catch(err => console.error(err.toString()));
    event.preventDefault();
    $("#chatMessage").val("");
})

connection.on("ReceiveMessage", (user, message) => {
    const rec_msg = user + ": " + message;

    debugger;
    const li = document.createElement("li");

    const div = document.createElement("div");
    div.className = $("#userName").text() == user ? "alert alert-danger" : "alert alert-info";
    div.setAttribute("role", "alert");

    const p = document.createElement("p");
    p.setAttribute("align", ($("#userName").text() == user ? "left" : "right"));
    p.textContent = rec_msg;

    const span = document.createElement("span");
    span.className = $("#userName").text() == user ? "time-left" : "time-right";
    span.textContent = new Date().toTimeString();

    div.append(p);
    div.append(span);
    li.append(div);
    $("#messageList").append(li);

    var messageBody = document.querySelector('#messageContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
})    

connection.start().catch(err => console.error(err.toString()));

//#endregion Send message

//#region Take Report About online clients

const b2cConnection = new signalR.HubConnectionBuilder()
    .withUrl("/NodeHub")
    .build();

b2cConnection.on("SendMessage", (user, message) => {

    if (echo(user))
        return;

    var news = $("#Subscribers div[floodid=" + message + "]");
    $("#Subscribers div[id!=userName]").remove();
    $("#Subscribers").append(news);

    var control = $.grep($("#Subscribers div a"), function (n, i) { if (n.text == user) return true; });
    if (typeof control === undefined || control.length > 0)
        return;
    
    const div = document.createElement("div");
    div.setAttribute("floodId", message);
    const a = document.createElement("a");
    a.textContent = user;
    a.setAttribute("href", "#");
    
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = "";
    a.append(span);
    div.append(a);
    $("#Subscribers").append(div);

    sendAliveMessage(message);

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