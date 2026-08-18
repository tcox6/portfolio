COLOURS = [
    "#8D9DF5",
    "#D4EAA9",
    "#FCACB9",
    "#32BEB1"
];

// Container for the bubbles
const bubbleContainer = document.getElementById("floatingStuff");

// The thing that we want the bubbles to move around
const introContainer = document.getElementsByClassName("introduction")[0];

// Path that the bubbles follow
// Populated by makeBubblesPath
let bubblesPath;

// Don't want two consecutive colours that are the same
let prev_colour = "";

/**
 * Constructs a path around the border of the 'introduction' div that the bubbles
    move around. Path consists of a sequence of (x,y) points and features rounded
    edges. The distance between all points is the same, as these are used as keyframes
    for moving the bubbles around the path.
 */
function makeBubblesPath() {
    const rect = introContainer.getBoundingClientRect();
    // Path can be constructed by just considering the quarter-circles in the corners
    // and filling-in the straight-edge lines with a sequence of points.
    // This will not produce perfectly-distributed points for the quarter-circles, but 
    // it is close enough for small values of r.
    const r = 96;  // Radius, px
    const N = 100;  // Number of points in quarter-circle
    const delta = (Math.PI / 2) / (N - 1);  // Increment in angle for each point (rads)
    // Calculate the position of the centers of the corner circles
    const CENTERS = [
        {x: rect.right - r, y: rect.top + r}, 
        {x: rect.left + r, y: rect.top + r}, 
        {x: rect.left + r, y: rect.bottom - r}, 
        {x: rect.right - r, y: rect.bottom - r}
    ];
    let theta = 0; // Current angle (rads)
    // This will store a separate array for each corner and straight edge
    // and all subarrays will be merged later.
    let bubblesPathIntermediate = [];
    // Iterate over each corner
    for (let i = 0; i < 4; i++) {
        // Points for quarter-circles
        bubblesPathIntermediate.push([]);
        for (let j = 0; j < N; j++) {
            bubblesPathIntermediate[2*i].push({
                x: CENTERS[i].x + r * Math.cos(theta),
                y: CENTERS[i].y - r * Math.sin(theta),
            });
            theta += delta;
        }
        theta -= delta; // Reset to pi/2*n
        // Get an estimate of the distance between points on the circle
        // Sample at approximately 45 deg
        // Could just do this once before the loop, but it is what it is...
        let p_c0 = bubblesPathIntermediate[2*i][(N+N%2)/2]; // mod ensures integer
        let p_c1 = bubblesPathIntermediate[2*i][(N+N%2)/2-1]; // mod ensures integer
        let d_c = Math.sqrt((p_c0.x-p_c1.x)**2 + (p_c0.y-p_c1.y)**2);
        // Points for the linear lines
        let p_l0 = {x:CENTERS[i].x + r * Math.cos(theta), y:CENTERS[i].y - r * Math.sin(theta)};
        let p_l1 = {x:CENTERS[(i+1)%4].x + r * Math.cos(theta), y:CENTERS[(i+1)%4].y - r * Math.sin(theta)};
        let d_l = Math.sqrt((p_l0.x-p_l1.x)**2 + (p_l0.y-p_l1.y)**2);  // Length of the line segment
        let n_new_pts = Math.round(d_l / d_c);  // Actual number of new points will be 1 less
        let new_p = p_l0;
        bubblesPathIntermediate.push([]);
        for (let j = 0; j < n_new_pts; j++) {
            // Avoid duplicating the boundary point
            if (j >= 1) {
                bubblesPathIntermediate[2*i+1].push({
                    x: new_p.x,
                    y: new_p.y
                });
            }
            // Increment point along line
            new_p = {
                x: new_p.x + (p_l1.x - p_l0.x) / n_new_pts,
                y: new_p.y + (p_l1.y - p_l0.y) / n_new_pts,
            };
        }
    }
    // Now need to merge the sublists in bubblesPathIntermediate :(
    let bubblesPath = [];
    for (let i = 0; i < 8; i++) {
        bubblesPath.push(...bubblesPathIntermediate[i]);
    }

    return bubblesPath;
}
// Construct initial path
bubblesPath = makeBubblesPath();

// Get JSON and make the 'bubbles'
fetch('/skills.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        const bubbles = data;

        // Random index order
        let order = [];
        for (let i = 0; i < bubbles.Skills.length; i++) {
            order[i] = i;
        }
        order.sort(() => Math.random() - 0.5);

        // Spawn bubbles
        let spawn_idx = 0;  // The path node to spawn at
        for (let i = 0; i < bubbles.Skills.length; i++) {
            makeBubble(bubbles.Skills[order[i]], spawn_idx);
            // TODO: will introduce minor rounding errors
            spawn_idx += Math.round(bubblesPath.length / bubbles.Skills.length);
        }
    })


function makeBubble(text, spawn_idx) {
    const bubble = document.createElement("span");
    bubble.innerHTML = text;
    bubble.classList.add("bubble");

    bubble.style.visibility = "hidden";
    bubbleContainer.appendChild(bubble);

    let bubbleIdx = spawn_idx;
    let x = bubblesPath[bubbleIdx].x;
    let y = bubblesPath[bubbleIdx].y;
    bubble.style.left = `${x - bubble.offsetWidth / 2}px`;
    bubble.style.top = `${y - bubble.offsetHeight / 2}px`;

    let rotateDegrees = Math.atan2(
        bubblesPath[(bubbleIdx + 1)%bubblesPath.length].y - bubblesPath[bubbleIdx].y,
        bubblesPath[(bubbleIdx + 1)%bubblesPath.length].x - bubblesPath[bubbleIdx].x,
    ) * 180 / Math.PI + 180;
    bubble.style.transform = `rotate(${rotateDegrees}deg)`;

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

    // Update position every 0.1 seconds
    setInterval(() => {
        bubbleIdx = (1 + bubbleIdx) % bubblesPath.length;
        x = bubblesPath[bubbleIdx].x;
        y= bubblesPath[bubbleIdx].y;
        bubble.style.left = `${x - bubble.offsetWidth / 2}px`;
        bubble.style.top = `${y - bubble.offsetHeight / 2}px`;

        
        let rotateDegrees = Math.atan2(
            bubblesPath[(bubbleIdx + 1)%bubblesPath.length].y - bubblesPath[bubbleIdx].y,
            bubblesPath[(bubbleIdx + 1)%bubblesPath.length].x - bubblesPath[bubbleIdx].x,
        ) * 180 / Math.PI + 180;
        bubble.style.transform = `rotate(${rotateDegrees}deg)`;
    }, 10);
}

// Debugging
// function resizeBubblePath() {
//     bubblesPath = makeBubblesPath();
    // bubbleContainer.replaceChildren()
    // for (let i = 0; i<bubblesPath.length; i++) {
    //     const bubble = document.createElement("span");
    //     bubble.classList.add("bubble");
    //     bubble.style.width = "8px";
    //     bubble.style.height = "8px";
    //     bubble.style.borderRadius = "4px";
    //     bubble.style.backgroundColor = "red";
    //     bubble.style.left = `${bubblesPath[i].x}px`;
    //     bubble.style.top = `${bubblesPath[i].y}px`;
    //     bubbleContainer.appendChild(bubble);
    // }
// }
window.addEventListener('resize', (event) => {
    // TODO: adjust position indices
    bubblesPath = makeBubblesPath();
});
// Also need to recreate when introduction container resized
//https://stackoverflow.com/a/49475832
new ResizeObserver(() => {bubblesPath = makeBubblesPath();}).observe(introContainer);