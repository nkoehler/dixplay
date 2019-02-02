function uploadImage(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function () {
        var uploadPhoto = {
            Data: reader.result,
        };
        sendToServer(uploadPhoto, MessageType.UploadPhoto);
    }
    reader.readAsDataURL(file);
}