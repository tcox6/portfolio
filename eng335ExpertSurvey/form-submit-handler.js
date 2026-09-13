// Need to manually post data to prevent Formspree splash page
const form = document.getElementById("timetable-form");
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
            alert("Thank you!");
            form.reset();
        } else {
            alert("An unexpected error occurred. Please try again.");
        }
    } catch (error) {
        alert("There was a problem submitting the form. Please check your network connection and try again.");
    }
});