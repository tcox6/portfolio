function slideshow(images, descriptions, imageID, descriptionID, backID, forwardID) {
    let slideshowImage = document.getElementById(imageID);
    let slideshowDescription = document.getElementById(descriptionID);
    let slideshowBack = document.getElementById(backID);
    let slideshowForward = document.getElementById(forwardID);

    // current slide index
    let i = 0;

    // set initial slide and description
    i = changeSlide(0, i, slideshowImage, slideshowDescription, slideshowBack, slideshowForward, images, descriptions);

    // event listener for the back button
    slideshowBack.addEventListener('click', () => {
        i = changeSlide(-1, i, slideshowImage, slideshowDescription, slideshowBack, slideshowForward, images, descriptions);
    });

    // event listener for the forward button
    slideshowForward.addEventListener('click', () => {
        i = changeSlide(1, i, slideshowImage, slideshowDescription, slideshowBack, slideshowForward, images, descriptions);
    });
}

/**
 * Changes the slide and description, and changes the value of `i`.
 * 
 * @param {Number} inc Direction to change slide in (-1 or 1) 
 */
function changeSlide(inc, i, slideshowImage, slideshowDescription, slideshowBack, slideshowForward, images, descriptions) {
    i += inc;

    // prevent index out of bounds error
    i = Math.min(i, images.length - 1);
    i = Math.max(i, 0);

    // hide back or forwards button, if necessary
    if (i == 0) {
        slideshowBack.style.visibility = "hidden";
    } else {
        slideshowBack.style.visibility = "visible";
    }

    if (i == images.length - 1) {
        slideshowForward.style.visibility = "hidden";
    } else {
        slideshowForward.style.visibility = "visible";
    }

    // change slideshow image and description
    slideshowImage.src = images[i];
    slideshowDescription.innerText = descriptions[i];

    return i;
}