COLOURS = [
    "#8D9DF5",
    "#D4EAA9",
    "#FCACB9",
    "#32BEB1"
];

// Timeout to allow the 'Tim' heading to be displayed
setTimeout(() => {
    doStuff();
}, 2000);

// Container for the bubbles
// TODO: could probably just make this the 'Tim' heading, and just set either
// width or height to 100%, with the other scaled.
const bubbleContainer = document.getElementById("floatingStuff");

// Record previous bubble colour and contents, to avoid displaying the same consecutively
// Also don't want the same edge twice in a row
let prev_colour = "";
let prev_text = "";
let prev_edge_idx = -1;

function doStuff() {
    // Need the bounding rectangle of the 'Tim' title
    const timText = document.getElementById("introductionTitle");
    const rect = timText.getBoundingClientRect();
    const timEdges = [
        {x0: rect.left,  y0: rect.top, x1: rect.right, y1: rect.top},  // Top
        {x0: rect.left, y0: rect.top, x1: rect.left, y1: rect.bottom},  // Left
        {x0: rect.right, y0: rect.top, x1: rect.right, y1: rect.bottom},  // Right
        {x0: rect.left,  y0: rect.bottom, x1: rect.right, y1: rect.bottom}  // Bottom
    ]

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
                makeBubble(text, timEdges);
            }, 1500)
        })
}

function makeBubble(text, timEdges) {
    const bubble = document.createElement("span");
    bubble.innerHTML = text;
    bubble.classList.add("bubble");

    // Need to append to parent here so can get rendered width
    bubble.style.visibility = "hidden";
    bubbleContainer.appendChild(bubble);

    // Random pos along border of 'Tim' heading
    // Choose the edge
    let valid = false;
    let edge_idx;
    while (!valid) {
        edge_idx = Math.floor(Math.random() * 4);
        valid = edge_idx != prev_edge_idx;
    }
    prev_edge_idx = edge_idx;
    let edge = timEdges[edge_idx];
    // Randomly get an extent along this edge
    let extent = Math.random();
    // Now just interpolate between the two points
    let x = edge.x0 + (edge.x1 - edge.x0) * extent;
    let y = edge.y0 + (edge.y1 - edge.y0) * extent;
    // Add x offset if left/right edge
    if (edge_idx == 1 || edge_idx == 2) {
        x -= bubble.offsetWidth / 2;
    }

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    // Set random background colour
    valid = false;
    let colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    while (!valid) {
        colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
        valid = colour != prev_colour;
    }
    prev_colour = colour;
    bubble.style.backgroundColor = colour;

    bubble.style.visibility = "visible";

    // Need to remove the bubble after some time
    setTimeout(() => {
        bubbleContainer.removeChild(bubble);
    }, 4000);
}