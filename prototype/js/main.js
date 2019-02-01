/*const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function (event) {
    console.log('Connected', event);
};

socket.onmessage = function (event) {
    console.log('Message', event);
};

socket.onclose = function (event) {
    console.log('Disconnected', event);
};

socket.onerror = function (event) {
    console.log('Error', event);
};*/

var uploadImageInput = document.getElementById('uploadImageInput');
uploadImageInput.addEventListener('change', setImage);

function setImage(event) {
    var img = document.getElementById('main-image');
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function () {
        img.src = reader.result;
    }
    reader.readAsDataURL(file);
}