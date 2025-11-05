// define strings to be 'typed' onto the screen
const topBlurb = "Hi, my name is";
const title = "Tim.";
const bottomBlurb = "I'm a student at the University of Tasmania studying a bachelor of ICT. My interests include algorithm design and optimisation, machine learning (especially reinforcement learning), and scientific programming. This website is a portfolio of some of the things I've done.";

const topBlurbContainer = document.getElementById("introductionTopBlurb");
const titleContainer = document.getElementById("introductionTitle");
const bottomBlurbContainer = document.getElementById("introductionBottomBlurb");

// parameters for the blinking cursor
const BLINK_RATE = 500;
var blink = false;

/**
 * Creates a typing animation by changing an element's text one character at a time.
 * Note that the animation will pause for slightly longer on commas and full-stops.
 * @param {HTMLElement} element HTML element to animate.
 * @param {String} text Text to create animation for.
 * @param {Number} pause Amount to pause between each character
 */
function typeText(element, text, pause) {
    let accumulatedTime = 0;
    let accumulatedString = "";

    for (char of text) {
        accumulatedString += char;
        
        // add 'cursor' to the end of the string if not finished typing string
        let currentText; // prevents implicit pointers issue
        if (accumulatedString != text) {
            currentText = accumulatedString + "|"; // prevents implicit pointers issue
        } else {
            currentText = accumulatedString; // prevents implicit pointers issue
        }
        setTimeout(() => produceText(element, currentText), accumulatedTime);

        if (char == ",") {
            accumulatedTime += 3 * pause;
        } else if (char == ".") {
            accumulatedTime += 6 * pause;
        } 
        else {
            accumulatedTime += pause;
        }
    }
}

/**
 * Helper function for `typeText` to actually update text for a given element.
 * @param {HTMLElement} element HTML element to animate.
 * @param {String} text Text to apply to `element`
 */
function produceText(element, text) {
    element.textContent = text;
}

/**
 * Animates a blinking 'cursor'.
 * Alternates between displaying a single pipe symbol and no text.
 */
function blinkingCursor() {
    if (blink) {
        bottomBlurbContainer.textContent = bottomBlurb + "|";
    } else {
        bottomBlurbContainer.textContent = bottomBlurb;
    }

    blink = !blink;
}

// top blurb
setTimeout(() => typeText(topBlurbContainer, topBlurb, 100), 0);
// title
setTimeout(() => typeText(titleContainer, title, 80), 2000);
// bottom blurb
setTimeout(() => typeText(bottomBlurbContainer, bottomBlurb, 30), 3000);
// blinking cursor
setTimeout(() => setInterval(blinkingCursor, BLINK_RATE), 11500);