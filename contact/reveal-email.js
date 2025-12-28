const emailSpan = document.getElementById("email");
const emailParagraph = document.getElementById("emailParagraph");
const copyEmail = document.getElementById("copyEmailClipboardSpan");

reverseEmailAddress = "moc.kooltuo@emoh02mit"; // email address in reverse

/**
 * Decrypts the email address (stored in reverse to prevent scraping).
 * @returns the decrypted email address.
 */
function decryptEmail() {
    return reverseEmailAddress.split('').reverse().join('');
}

/**
 * onClick event handler for revealing contact email.
 */
function revealEmail() {
    let email = decryptEmail(reverseEmailAddress);

    // change text
    emailParagraph.innerHTML = "You can contact me here: " + '<a href="mailto:' + email + '">' + email + "</a>" + ". ";

    // make the 'click to copy' button visible
    copyEmail.style.visibility = "visible";
    copyEmail.style.animation = "copyEmailFadeOut";
    copyEmail.style.animationDuration = "1s";
    copyEmail.style.animationDelay = "3s";
    copyEmail.style.animationFillMode = "forwards";
}

emailSpan.addEventListener('click', revealEmail);

/**
 * Copies the decrypted email to the clipboard.
 * Also changes the text in the 'copy email' span to "Successfully copied email to clipboard.", and makes the span invisible.
 */
function copyEmailOnClick() {
    // copy to clipboard
    navigator.clipboard.writeText(decryptEmail(reverseEmailAddress));

    // show success message
    copyEmail.innerHTML = "<strong>Successfully copied email to clipboard.</strong>";

    // make the message disappear
    copyEmail.style.animation = "copyEmailFadeOut";
    copyEmail.style.animationDuration = "1s";
    copyEmail.style.animationDelay = "3s";
    copyEmail.style.animationFillMode = "forwards";
}

copyEmail.addEventListener('click', copyEmailOnClick);