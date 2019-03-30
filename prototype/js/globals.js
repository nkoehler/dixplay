// User Input
var uploadPhotoInput = document.getElementById('uploadPhotoInput');
var writeCommentInput = document.getElementById('writeCommentInput');
var sendCommentButton = document.getElementById('sendCommentButton');
var addPhotoButton = document.getElementById('addPhotoButton');
var goFullscreenButton = document.getElementById('goFullscreenButton');
var randomPhotoButton = document.getElementById('randomPhotoButton');
var helpDialogButton = document.getElementById('helpDialogButton');

// Display
var displayMainPhoto = document.getElementById('displayMainPhoto');
var displayMainComments = document.getElementById('displayMainComments');
var displayMainVotable = document.getElementById('displayMainVotable');
var displayMainVotableExpires = document.getElementById('displayMainVotableExpires');
var expiresInterval;

// Fullscreen dialog
var imageFullscreenDialog = document.getElementById('imageFullscreenDialog');
var imageFullscreenDialogImage = document.getElementById('imageFullscreenDialogImage');

// Welcome dialog
var welcomeDialog = document.getElementById('welcomeDialog');
var welcomeDialogName = document.getElementById('welcomeDialogName');
var welcomeDialogEnterButton = document.getElementById('welcomeDialogEnterButton');
var username;

// Help dialog
var helpDialog = document.getElementById('helpDialog');