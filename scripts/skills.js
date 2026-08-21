/**
 * This is a mess - poor planning on my part :)
 */

// Container for the bubbles
const bubbleContainer = document.getElementById("floatingStuff");

// The thing that we want the bubbles to move around
const introContainer = document.getElementsByClassName("introduction")[0];

// Path that the bubbles follow
// Populated by makeBubblesPath
let bubblesPath;

let bubbleData;
let order;
let intervals = [];
let bubbleDivs = [];

// Update period
INC_PERIOD = 12;

let mobileMode = false;

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
                y: CENTERS[i].y - r * Math.sin(theta) + window.scrollY
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
                    y: new_p.y + window.scrollY
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
    let bubblesPathFinal = [];
    for (let i = 0; i < 8; i++) {
        bubblesPathFinal.push(...bubblesPathIntermediate[i]);
    }

    return bubblesPathFinal;
}

function init() {
    mobileMode = window.innerWidth < 1800;
    // Construct initial path
    bubblesPath = makeBubblesPath();

    // Get JSON and make the 'bubbles'
    fetch('/skills.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            bubbleData = data;
            
            // Prune to fit desired length
            remove_idx = [];
            if (mobileMode) {
                for (let i = 0; i < bubbleData.Skills.length; i++) {
                    if (!bubbleData.Skills[i].emphasise) {
                        remove_idx.push(i);
                    }
                }
            }
            for (let i = 0; i < remove_idx.length; i++) {
                bubbleData.Skills.splice(remove_idx[i] - i, 1);
            }

            // Random index order
            order = [];
            for (let i = 0; i < bubbleData.Skills.length; i++) {
                order[i] = i;
            }
            order.sort(() => Math.random() - 0.5);

            // Spawn bubbles
            let spawn_idx = 0;  // The path node to spawn at
            for (let i = 0; i < bubbleData.Skills.length; i++) {
                makeBubble(bubbleData.Skills[order[i]].text, 
                    spawn_idx, 
                    bubblesPath, 
                    bubbleData.Skills[order[i]].colour,
                    bubbleData.Skills[order[i]].emphasise
                );
                // TODO: will introduce minor rounding errors
                // would be better to use an approach similar to DDA
                spawn_idx += Math.round(bubblesPath.length / bubbleData.Skills.length);
            }

            window.addEventListener('resize', (event) => {
                resizeContainer();
            });
            // Also need to recreate when introduction container resized
            //https://stackoverflow.com/a/49475832
            new ResizeObserver(() => {resizeContainer();}).observe(introContainer);
    });
}
init();


function makeBubble(text, spawn_idx, bubblesPath, colour, emphasise) {
    const bubble = document.createElement("span");
    bubble.innerHTML = text;
    bubble.classList.add("bubble");
    if (emphasise) {
        bubble.classList.add("emphasise");
    }

    bubble.style.visibility = "hidden";
    bubbleContainer.appendChild(bubble);

    let bubbleIdx = spawn_idx;
    let x = bubblesPath[bubbleIdx].x;
    let y = bubblesPath[bubbleIdx].y;
    bubble.style.left = `${x - bubble.offsetWidth / 2}px`;
    bubble.style.top = `${y - bubble.offsetHeight / 2}px`;
    bubble.bubbleIdx = bubbleIdx;

    let rotateDegrees = Math.atan2(
        bubblesPath[(bubbleIdx + 1)%bubblesPath.length].y - bubblesPath[bubbleIdx].y,
        bubblesPath[(bubbleIdx + 1)%bubblesPath.length].x - bubblesPath[bubbleIdx].x,
    ) * 180 / Math.PI + 180;
    bubble.style.transform = `rotate(${rotateDegrees}deg)`;

    // Set background colour
    bubble.style.backgroundColor = colour;

    bubble.style.visibility = "visible";

    bubbleDivs.push(bubble);

    // Update position every 0.1 seconds
    intervals.push(setInterval(() => {
        bubbleIdx = (bubbleIdx + 1) % bubblesPath.length;
        bubble.bubbleIdx = bubbleIdx;
        x = bubblesPath[bubbleIdx].x;
        y= bubblesPath[bubbleIdx].y;
        bubble.style.left = `${x - bubble.offsetWidth / 2}px`;
        bubble.style.top = `${y - bubble.offsetHeight / 2}px`;

        let rotateDegrees = Math.atan2(
            bubblesPath[(bubbleIdx + 1)%bubblesPath.length].y - bubblesPath[bubbleIdx].y,
            bubblesPath[(bubbleIdx + 1)%bubblesPath.length].x - bubblesPath[bubbleIdx].x,
        ) * 180 / Math.PI + 180;
        bubble.style.transform = `rotate(${rotateDegrees}deg)`;
    }, INC_PERIOD));
}

function resizeContainer() {
    // Handle the case where the async init has not finished
    if (bubbleData.Skills.length != bubbleDivs.length) {
        return;
    }

    // Clear intervals
    for (let i = 0; i < bubbleDivs.length; i++) {
        clearInterval(intervals[i]);
    }
    intervals = [];

    // Remove existing bubbles
    spawn_offsets = [];
    for (let i = 0; i < bubbleDivs.length; i++) {
        spawn_offsets.push(bubbleDivs[i].bubbleIdx);
        bubbleDivs[i].remove();
    }
    bubbleDivs = [];

    // Check if need to restart everything
    if (window.innerWidth <= 1800 && !mobileMode || window.innerWidth > 1800 && mobileMode) {
        init();
    } else {
        prevLen = bubblesPath.length;
        bubblesPath = makeBubblesPath();

        // Spawn bubbles
        for (let i = 0; i < bubbleData.Skills.length; i++) {
            if (prevLen != 0 && bubblesPath.length > 0) {
                // console.log(spawn_offsets[i]);
                // console.log(bubblesPath.length);
                // console.log("");
                spawn_offsets[i] = Math.round(spawn_offsets[i] * (bubblesPath.length / prevLen));
                spawn_offsets[i] = spawn_offsets[i] % bubblesPath.length;
                makeBubble(bubbleData.Skills[order[i]].text, 
                    spawn_offsets[i], 
                    bubblesPath, 
                    bubbleData.Skills[order[i]].colour,
                    bubbleData.Skills[order[i]].emphasise
                );
            }
        }
    }
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