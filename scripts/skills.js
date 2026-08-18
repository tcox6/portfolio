COLOURS = [
    "#8D9DF5",
    "#D4EAA9",
    "#FCACB9",
    "#32BEB1"
];

// Container for the bubbles
const bubbleContainer = document.getElementById("floatingStuff");

/**
 * Constructs a path around the border of the 'introduction' div that the bubbles
    move around. Path consists of a sequence of (x,y) points and features rounded
    edges. The distance between all points is the same, as these are used as keyframes
    for moving the bubbles around the path.
 */
function makebubblesPathIntermediate() {
    const introContainer = document.getElementsByClassName("introduction")[0];
    const rect = introContainer.getBoundingClientRect();
    // Path can be constructed by just considering the quarter-circles in the corners
    // and filling-in the straight-edge lines with a sequence of points.
    // This will not produce perfectly-distributed points for the quarter-circles, but 
    // it is close enough for small values of r.
    const r = 24;  // Radius, px
    const N = 12;  // Number of points in quarter-circle
    const delta = Math.PI / 2 / (N - 1);  // Increment in angle for each point (rads)
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
                y: CENTERS[i].y + r * Math.sin(theta),
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
        let p_l1 = {x:CENTERS[(i+1)%2].x + r * Math.cos(theta), y:CENTERS[(i+1)%2].y - r * Math.sin(theta)};
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
let bubblesPath = makebubblesPathIntermediate();
window.addEventListener('resize', (event) => {
    bubblesPath = makebubblesPathIntermediate();
});

// // Get JSON and make the 'bubbles'
// fetch('/skills.json')
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         const bubbles = data;

//         for (let i = 0; i < bubbles.Skills.length; i++) {

//         }

//         setInterval(() => {
//             // Select text randomly
//             let valid = false;
//             let text;
//             while (!valid) {
//                 text = bubbles.Skills[Math.floor(Math.random() * bubbles.Skills.length)];
//                 valid = text != prev_text;
//             }
//             prev_text = text;
//             makeBubble(text, timEdges);
//         }, 1500)
//     })


// function makeBubble(text, timEdges) {
//     const bubble = document.createElement("span");
//     bubble.innerHTML = text;
//     bubble.classList.add("bubble");

//     // Need to append to parent here so can get rendered width
//     bubble.style.visibility = "hidden";
//     bubbleContainer.appendChild(bubble);

//     // Random pos along border of 'Tim' heading
//     // Choose the edge
//     let valid = false;
//     let edge_idx;
//     while (!valid) {
//         edge_idx = Math.floor(Math.random() * 4);
//         valid = edge_idx != prev_edge_idx;
//     }
//     prev_edge_idx = edge_idx;
//     let edge = timEdges[edge_idx];
//     // Randomly get an extent along this edge
//     let extent = Math.random();
//     // Now just interpolate between the two points
//     let x = edge.x0 + (edge.x1 - edge.x0) * extent;
//     let y = edge.y0 + (edge.y1 - edge.y0) * extent;
//     // Add x offset if left/right edge
//     if (edge_idx == 1 || edge_idx == 2) {
//         x -= bubble.offsetWidth / 2;
//     }

//     bubble.style.left = `${x}px`;
//     bubble.style.top = `${y}px`;

//     // Set random background colour
//     valid = false;
//     let colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
//     while (!valid) {
//         colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
//         valid = colour != prev_colour;
//     }
//     prev_colour = colour;
//     bubble.style.backgroundColor = colour;

//     bubble.style.visibility = "visible";

//     // Need to remove the bubble after some time
//     setTimeout(() => {
//         bubbleContainer.removeChild(bubble);
//     }, 4000);
// }