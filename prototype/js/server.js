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

    if (msg["Type"] == MessageType.GetDixplay) {
        /* Dixplay Model */
        /*
            Photo = {
                Data: string;
                Date: string;
            };
            Comments[] = {
                Text: string;
                Date: string;
            };
        */

        updatePhoto(payload["Photo"]);
        console.log(payload["Comments"]);
        updateComments(payload["Comments"]);
    }

    else if (msg["Type"] == MessageType.GetComments) {
        /* Comments Model */
        /*
            [] of {
                Text: string;
                Date: string;
            }
        */
       updateComments(payload);
    }
};

socket.onclose = function (event) {
    console.log('Disconnected', event);
};

socket.onerror = function (event) {
    console.log('Error', event);
};

function updatePhoto(photo) {
    displayMainPhoto.src = photo["Data"];
    displayMainPhoto.alt = photo["Date"];
}

function updateComments(comments) {
    var commentsToRemove = displayMainComments.getElementsByClassName('comment');
    Array.from(commentsToRemove).forEach(e => e.parentNode.removeChild(e));

    Array.from(comments).forEach(comment => {
        var div = document.createElement('div');
        div.className = "comment";
        div.innerHTML = comment["Text"] + ' - ' + comment["Date"];
        displayMainComments.append(div);
    })
}

function sendToServer(message, type) {
    var msg = {
        type: type,
        payload: JSON.stringify(message)
    };

    var packet = JSON.stringify(msg);

    socket.send(packet);
}

function uploadPhoto(event) {
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function () {
            var uploadPhoto = {
                Data: reader.result,
            };
            sendToServer(uploadPhoto, MessageType.UploadPhoto);
        }
        reader.readAsDataURL(file);
    }
}

function uploadComment() {
    var comment = writeCommentInput.value;
    console.log(comment);

    if (comment) {
        var uploadComment = {
            Text: comment
        };

        sendToServer(uploadComment, MessageType.UploadComment);
    }
}

// register events
uploadPhotoInput.addEventListener('change', uploadPhoto);
uploadCommentInput.addEventListener('click', uploadComment);
