/**
 * This script handles the submission of the contact form (using Formspree).
 * 
 * Also implements the untickable checkbox.
 */

// Need to manually post data to prevent Formspree splash page
const form = document.getElementById("contactForm");
form.addEventListener('submit', async function(e) {
    // prevent normal splash page behaviour
    e.preventDefault();

    // ensure that the default text isn't
    const data = new FormData(form);
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert("Thank you for contacting me! I'll be in-touch shortly.");
            form.reset();
        } else {
            alert("An unexpected error occurred. Please try again, and if not successful, reach-out to me directly via my email address.");
        }
    } catch (error) {
        alert("There was a problem submitting the form. Please check your network connection and try again.");
    }
});



// make untickable box unticked
const untickable = document.getElementById("untick");
untickable.checked = true; // set initial state

// ensure that the untickable box cannot be unticked permanently
untickable.addEventListener('change', (event) => {
    // use setTimeout to annoy people
    setTimeout(() => {
        untickable.checked = true;
    }, 500);
});