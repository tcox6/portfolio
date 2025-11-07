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
 * @returns {Number} The total time needed for the animation.
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

        // increment the accumulated time
        if (char == ",") {
            accumulatedTime += 3 * pause;
        } else if (char == ".") {
            accumulatedTime += 6 * pause;
        } 
        else {
            accumulatedTime += pause;
        }
    }

    return accumulatedTime;
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

/**
 * Calculates the time required for an animation given the text and pause duration.
 * @param {String} text The text to use for the animation.
 * @param {Number} pause The amount of time to pause between characters during  the animation.
 * @returns {Number} The total time required for the animation
 */
function calculateAnimationTime(text, pause) {
    let dummy = document.createElement("div");
    dummy.style.visibility="false";

    return typeText(dummy, text, pause);
}

// define parameters for each animation
const TOP_BLURB_PAUSE = 100;
const TITLE_PAUSE = 80;
const BOTTOM_BLURB_PAUSE = 30;

// calculate times needed for animations
let topBlurbTime = calculateAnimationTime(topBlurb, TOP_BLURB_PAUSE);
let titleTime = calculateAnimationTime(title, TITLE_PAUSE);
let bottomBlurbTime = calculateAnimationTime(bottomBlurb, BOTTOM_BLURB_PAUSE);

// top blurb
let waitTime = 0;
setTimeout(() => typeText(topBlurbContainer, topBlurb, TOP_BLURB_PAUSE), waitTime);
// title
waitTime += topBlurbTime + 100;
setTimeout(() => typeText(titleContainer, title, TITLE_PAUSE), waitTime);
// bottom blurb
waitTime += titleTime + 200;
setTimeout(() => typeText(bottomBlurbContainer, bottomBlurb, BOTTOM_BLURB_PAUSE), waitTime);
// blinking cursor
waitTime += bottomBlurbTime;
setTimeout(() => setInterval(blinkingCursor, BLINK_RATE), waitTime);