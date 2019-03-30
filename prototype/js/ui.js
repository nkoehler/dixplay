var accessKey = "810371d7672fe6e11755e44c317d1752d8617a822d5cc979b6bf020bd35cf6d5";
var secretKey = "dfd64ae63364bdf7177a9c388407fdb5301364238d3ac10fa2a7c85a98ca0fba";

var api = "https://api.unsplash.com/photos/random?client_id=" + accessKey;

// register events
addPhotoButton.addEventListener('click', function () {
    uploadPhotoInput.click();
});

goFullscreenButton.addEventListener('click', function () {
    imageFullscreenDialog.style.display = "flex";
    imageFullscreenDialog.onclick = function () {
        imageFullscreenDialog.onclick = null;
        imageFullscreenDialog.style.display = "none";
    }
});

welcomeDialogEnterButton.addEventListener('click', function () {
    var name = welcomeDialogName.value;

    if (!name || name == "") {
        return;
    } else {
        username = name;
        sessionStorage.setItem('username', username);
        welcomeDialog.style.display = "none";
    }
});

randomPhotoButton.addEventListener('click', function () {
    $.get(api).done(function (data) {
        var url = data["urls"]["regular"];

        var xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.open("GET", url);

        xhr.onload = function () {
            var bytes = new Uint8Array(xhr.response);
            var binary = [].map.call(bytes, function (byte) {
                return String.fromCharCode(byte);
            }).join('');
            var mediaType = xhr.getResponseHeader('content-type');
            var base64 = [
                'data:',
                mediaType ? mediaType + ';' : '',
                'base64,',
                btoa(binary)
            ].join('');

            var uploadPhoto = {
                Data: base64,
            };
            sendToServer(uploadPhoto, MessageType.UploadPhoto);
        };
        xhr.send();
    });
});

helpDialogButton.addEventListener('click', function () {
    helpDialog.style.display = "flex";
    helpDialog.onclick = function () {
        helpDialog.onclick = null;
        helpDialog.style.display = "none";
    }
});


// Processing
username = sessionStorage.getItem('username');

if (username) {
    welcomeDialog.value = username;
} else {
    welcomeDialog.style.display = "flex";
}