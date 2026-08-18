COLOURS = [
    "#8D9DF5",
    "#D4EAA9",
    "#FCACB9",
    "#32BEB1"
];

// Record previous bubble colour and contents, to avoid displaying the same consecutively
let prev_colour = "";
let prev_text = "";

// Wait for header to load
setTimeout(() => {
    const bubbleContainer = document.getElementById("floatingStuff");
    const header = document.getElementsByTagName("header")[0];

    function makeBubble(text) {
        const bubble = document.createElement("span");
        bubble.innerHTML = text;
        bubble.classList.add("bubble");

        // Random xy pos for bubble
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight + header.offsetHeight;
        x = Math.min(x, window.innerWidth - 36);
        y = Math.min(y, window.innerHeight - 36);
        x = Math.max(x, 36);
        y = Math.max(y, 36);
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        // Set random background colour
        let valid = false;
        let colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
        while (!valid) {
            colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
            valid = colour != prev_colour;
        }
        prev_colour = colour;
        bubble.style.backgroundColor = colour;

        bubbleContainer.appendChild(bubble);

        // Need to remove the bubble after some time
        setTimeout(() => {
            bubbleContainer.removeChild(bubble);
        }, 1500);
    }

    // Get JSON and make the 'bubbles'
    fetch('/skills.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            const bubbles = data;

            setInterval(() => {
                // Select text randomly
                let valid = false;
                let text;
                while (!valid) {
                    text = bubbles.Skills[Math.floor(Math.random() * bubbles.Skills.length)];
                    valid = text != prev_text;
                }
                prev_text = text;
                makeBubble(text);
            }, 1500)
        })
}, 1000);