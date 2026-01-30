
const mainHeader = document.getElementById("mainHeader");
const intro = document.getElementById("intro");
const preventScraping = document.getElementById("preventScraping");
const formTextArea = document.getElementById("messageField");
const formSillyOptions = document.getElementById("sillyOptions");
const messageLabel = document.getElementById("messageLabel");

// get query parameters to check whether 'bug mode' needs to be activated
const params = new URLSearchParams(window.location.search);

// if bug mode, hide contactHeader and contactIntro (and vice-versa)
if (params.has("bugs")) {
    mainHeader.innerHTML = "Report Bugs";
    intro.innerHTML = "Please use this page to report bugs. There are two contact options provided below.";
    preventScraping.innerHTML = "";

    formTextArea.innerHTML = "";
    formSillyOptions.innerHTML = "";
    messageLabel.innerHTML = "Please describe the bug. It may help to provide your browser version and system specs.";
}