var MessageType = {
    // User -> Server level
    UploadPhoto: 101,
    UploadComment: 102,

    // Server -> User level
    GetDixplay: 201,
    GetComments: 202,
  };

const socket = new WebSocket('ws://localhost:8008');

socket.onopen = function (event) {
    console.log('Connected', event);
};

socket.onmessage = function (event) {
    var msg = JSON.parse(event.data);
    console.log(msg["Type"]);
    var payload = JSON.parse(msg["Payload"]);

    if(msg["Type"] == MessageType.GetDixplay)
    {
        /* Dixplay Model */
        /*
            Photo: string;
            Comments: string[];
        */
        
        mainImage.src = payload["Photo"];
        // comments.whatever = comments;
    }

    else if (msg["Type"] == MessageType.GetComments)
    {

    }
};

socket.onclose = function (event) {
    console.log('Disconnected', event);
};

socket.onerror = function (event) {
    console.log('Error', event);
};

function sendToServer(message, type) {
    var msg = {
        type: type,
        payload: JSON.stringify(message)
    };

    var packet = JSON.stringify(msg);

    socket.send(packet);
}