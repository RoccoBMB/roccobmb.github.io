//Preload files
function preload() {
    soundFormats('mp3', 'm4a');
    mySound = loadSound('assets/meditate.mp3');
    nameFont = loadFont('fonts/Montserrat-Light.ttf');
}

var amplitude;

function setup() {

    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    //Aesthetics
    textFont(nameFont);
    textAlign(CENTER);
    textSize(30);

    // Colour
    noStroke();
    mySound.setVolume(0.5);
    mySound.loop();

    //Send up sound levels
    // values between 0 and .999 can be used to smooth the amplitude
    //.999 is too high for smoothing, almost preventing the pulse
    amplitude = new p5.Amplitude(.950);
}

var grabFriends;
var friendsList;
var friendsArray;
var displayFriendsArray;
var isFriendsArrayEstablished = false;

//Function to grab the list of Facebook friends from the FB Login SDK
//Then break it down into usable strings
function addFriendsToArray() {

    // Selects the friends items
    grabFriends = select('#read_result');

    // Selects the Friends Themselves
    friendsList = grabFriends.elt;

    // When additional users login (after the first)
    // Splits the friends into a new array and adds them to the already established 'friendsArray'
    if (isFriendsArrayEstablished == true) {
        //Splits Elements, Establishes Array
        additionalFriendsArray = split(friendsList.innerHTML, '<br>');
        //Pushes this array to our master array.
        Array.prototype.push.apply(friendsArray, additionalFriendsArray);
    };

    // On the first run, splits the 'friendsList' into usable strings and puts it into an array
    // Then changes the isFriendsArrayEstablished to 'true' so we don't overwrite our array 
    // This is the master array that is used for display purposes
    if (isFriendsArrayEstablished == false) {

        //Splits Elements, Establishes Array
        friendsArray = split(friendsList.innerHTML, '<br>');
        //Turns off this function from being able to run again
        isFriendsArrayEstablished = true;
    };

}

var opacity = 0;
var fadeInSpeed = .75;
var areFieldsUpdated = false;

var randomSelection;
var friendSelector;
var nameLocation;

var backgroundPulseOpacity = 0;
var backgroundFadeSpeed = .1;

function draw() {

    var level = amplitude.getLevel();
    //map volume levels from 0-0.5 to the colour range
    var size = map(level, 0, .5, 0, 70);
    //size = size+boom;
    background(0, 0, size);

    //    backgroundPulseOpacity = backgroundPulseOpacity + backgroundFadeSpeed;
    //
    //    if (backgroundPulseOpacity > 40 || backgroundPulseOpacity <= 0) {
    //        backgroundFadeSpeed = backgroundFadeSpeed * -1;
    //    };
    //
    //    background(0, 0, backgroundPulseOpacity, );

    //    Within the new window, opens the 'friendsArray'
    // We also end up changing the name to 'displayFriendsArray'
    displayFriendsArray = window.opener.friendsArray;

    //Take your time in milliseconds, then convert it to seconds and round it.
    //    var millisecond = millis();
    //    var timeInSeconds = int(millisecond / 1000);
    //    if (timeInSeconds % 2 == 0) {
    //        console.log(timeInSeconds)
    //    };


    // Creates the fields in which to display whewre the names are displayed
    // Adjusting the divisor changes how frequent the names are displayed
    if (frameCount % 120 == 0 && areFieldsUpdated == false) {

        // Randomly Select a friend from the 'friendsArray'
        randomSelection = random(0, displayFriendsArray.length);
        friendSelector = int(randomSelection); //Used to round to an integer value

        //Creates the location for the names to be displayed
        nameLocation = createVector(100, 100);
        nameLocation.x = random(200, width - 200);
        nameLocation.y = random(200, height - 200);

        areFieldsUpdated = true;
    };


    // After we have received the fields from the code above, we are free to display the name
    // We start out with our opacity and fade in the name over time
    if (areFieldsUpdated == true) {

        opacity = opacity + fadeInSpeed;
        fill(255, opacity);

        // Displays the name as per the displayName() class
        displayName(friendSelector, nameLocation.x, nameLocation.y);

        if (opacity >= 255) {
            fadeInSpeed = -fadeInSpeed;
        }

        if (opacity <= 0) {
            fadeInSpeed = .75;
            //Remove the chosen name from the array
            displayFriendsArray.splice(friendSelector, 1);
            areFieldsUpdated = false;
        }

    }

}

// I made this as class so we can control how EACH element is displayed
// This helps us animate each string of data.
function displayName(thisFriend, xPos, yPos) {
    text(displayFriendsArray[thisFriend], xPos, yPos);
}

//Variable to check if the DisplayWindow is already open. If not, it opens, if it is, it doesn't reopen.
//This is utilized in index.html with a simple ifStatement.
var isWindowOpen = false;

//Opens the Display Window
function openDisplayWindow() {
    var windowObjectReference;
    var strWindowFeatures = "menubar=no,location=no,resizable=no, scrollbars=no, status=yes, width= 1920, height= 1080";

    //Set Volume and play audio
    //This pauses the music in the login screen

    mySound.pause();

    //    mySound.setVolume(0.5);
    //    mySound.loop();

    //Opens new Window
    windowObjectReference = window.open("havehope.html", "Display for AllMyFriends Display", strWindowFeatures);

}