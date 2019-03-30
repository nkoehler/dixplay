var MessageType = {
    // User -> Server level
    UploadPhoto: 101,
    UploadComment: 102,
    UploadVote: 103,

    // Server -> User level
    GetPhoto: 201,
    GetComments: 202,
    GetVotable: 203,
};

const socket = new WebSocket('ws://localhost:8008');

socket.onopen = function (event) {
    //console.log('Connected', event);
};

socket.onmessage = function (event) {
    var msg = JSON.parse(event.data);
    //console.log(msg["Type"]);
    var payload = JSON.parse(msg["Payload"]);

    if (msg["Type"] == MessageType.GetPhoto) {
        updatePhoto(payload);
    }

    else if (msg["Type"] == MessageType.GetComments) {
        updateComments(payload);
    }

    else if (msg["Type"] == MessageType.GetVotable) {
        clearInterval(expiresInterval);
        updateVotable(payload);
    }
};

socket.onclose = function (event) {
    //console.log('Disconnected', event);
};

socket.onerror = function (event) {
    //console.log('Error', event);
};

function updatePhoto(photo) {
    displayMainVotableExpires.innerHTML = ""; // just in case of wonky timeout

    displayMainPhoto.classList.remove('zoom');

    displayMainPhoto.src = photo["Data"];
    displayMainPhoto.alt = photo["ID"];

    imageFullscreenDialogImage.src = photo["Data"];
    imageFullscreenDialogImage.alt = photo["ID"];

    void displayMainPhoto.offsetWidth; // trigger reflow

    displayMainPhoto.classList.add('zoom');
}

function updateComments(comments) {
    var commentsToRemove = displayMainComments.getElementsByClassName('comments-comment');
    Array.from(commentsToRemove).forEach(e => e.parentNode.removeChild(e));

    Array.from(comments).forEach(comment => {
        var div = document.createElement('div');
        div.className = "comments-comment";

        var nameDiv = document.createElement('div');
        nameDiv.className = "name";
        nameDiv.innerHTML = comment["Name"];

        var comDiv = document.createElement('div');
        comDiv.className = "comment";
        comDiv.innerHTML = comment["Text"];

        var timeDiv = document.createElement('div');
        timeDiv.className = "time";
        timeDiv.innerHTML = new Date(comment["Date"]).toLocaleString();

        div.appendChild(nameDiv);
        div.appendChild(comDiv);
        div.appendChild(timeDiv);

        displayMainComments.append(div);
    });

    if (displayMainComments.firstElementChild) {
        displayMainComments.firstElementChild.classList.add('zoom');
    }
}

function updateVotable(payload) {
    var votablesToRemove = displayMainVotable.getElementsByClassName('votable-item');
    var currentVotable = Array.from(votablesToRemove).length;
    Array.from(votablesToRemove).forEach(e => e.parentNode.removeChild(e));

    var expires = payload["Expires"];

    if (expires) {
        var date = new Date(expires);
        expiresInterval = setInterval(function () { updateVotingTimeout(date) }, 1000);
    }

    var nextVotable = Array.from(payload["Photos"]).length;
    Array.from(payload["Photos"]).forEach(photo => {
        var container = document.createElement('div');
        container.className = "votable-item";

        var img = document.createElement('img');
        img.className = "votable-image";
        img.src = photo["Data"];
        img.alt = photo["ID"];

        var ctrl = document.createElement('div');
        ctrl.className = "votable-controls";

        var count = document.createElement('div');
        count.innerHTML = photo["Votes"];

        var vote = document.createElement('i');
        vote.className = "material-icons";
        vote.innerHTML = "thumb_up";
        vote.onclick = function () { uploadVote(payload["ID"], photo["ID"]); };

        ctrl.appendChild(count);
        ctrl.appendChild(vote);

        container.appendChild(img);
        container.appendChild(ctrl);

        displayMainVotable.appendChild(container);
    });

    if (displayMainVotable.lastElementChild && currentVotable != nextVotable) {
        displayMainVotable.lastElementChild.classList.add('zoom');
    }
}

function updateVotingTimeout(expires) {
    var current = new Date();

    if (current < expires) {
        var seconds = Math.round((expires.getTime() - current.getTime()) / 1000);
        displayMainVotableExpires.innerHTML = seconds + " second" + (seconds != 1 ? "s " : " ") + "remaining until voting closes";
    } else {
        displayMainVotableExpires.innerHTML = "";
    }
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
    var name = username;
    var comment = writeCommentInput.value;

    if (comment) {
        var uploadComment = {
            Name: name,
            Text: comment
        };

        sendToServer(uploadComment, MessageType.UploadComment);

        writeCommentInput.value = "";
    }
}

function uploadVote(vote, id) {
    var session = sessionStorage.getItem(vote);

    if (id && !session) {
        var uploadVote = {
            ID: id
        };

        sendToServer(uploadVote, MessageType.UploadVote);

        sessionStorage.setItem(vote, id);
    }
}

// register events
uploadPhotoInput.addEventListener('change', uploadPhoto);
sendCommentButton.addEventListener('click', uploadComment);
$("#writeCommentInput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        uploadComment();
    }
});
