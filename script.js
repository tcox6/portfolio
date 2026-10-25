const digit = document.getElementById("digit");
const digit2 = document.getElementById("digit2");

function make0(width, height) {
    // Zero is symmetric, so don't need to bother with proper y-coordinates
    // Parameters for ellipse equation
    let h = width / 2;
    let k = height / 2;
    let a_inner = (width / 2) * 0.4;
    let a_outer = width / 2;
    let b_inner = (height / 2) * 0.7;
    let b_outer = height / 2;

    let points = [];
    let distortionExtents = [];

    // Outer boundary (+y and -y) [+y downwards]
    for (let x = 0; x <= width; x++) {
        y_outer = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        points.push([x, height - y_outer]);
        distortionExtents.push(0.3);
    }
    for (let x = width; x >= 0; x--) {
        y_outer = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        points.push([x, y_outer]);
        distortionExtents.push(1);
    }

    // Inner boundary (-y and +y) [+y downwards]
    for (let x = 0; x <= width; x++) {
        // Compute the scaled x value for inner part
        x0_inner = (width / 2) - a_inner;
        x1_inner = (width / 2) + a_inner;
        x_inner = x0_inner + (x / width) * (x1_inner - x0_inner);
        
        y_inner = Math.sqrt((1 - (Math.pow((x_inner-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        points.push([x_inner, y_inner]);
        distortionExtents.push(0.3);
    }
    for (let x = width; x >= 0; x--) {
        // Compute the scaled x value for inner part
        x0_inner = (width / 2) - a_inner;
        x1_inner = (width / 2) + a_inner;
        x_inner = x0_inner + (x / width) * (x1_inner - x0_inner);
        
        y_inner = Math.sqrt((1 - (Math.pow((x_inner-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        points.push([x_inner, height - y_inner]);
        distortionExtents.push(0.3);
    }

    // Link back to start for melting effect to work properly.
    points.push([0, height/2]);
    distortionExtents.push(1);

    return [points, distortionExtents];
}

function make1(width, height) {
    // Constants
    const STEM_WIDTH = 0.45;
    const DIAGONAL_OFFSET = 0.15;
    const DIAGONAL_HEIGHT = (STEM_WIDTH * width) / height;

    let points = [];

    // Bottom
    for (let x = Math.floor(width * (1 - STEM_WIDTH)); x < width; x++) {
        points.push([x, height - 1]);
    }

    // Top
    for (let x = width - 1; x >= Math.floor(width * (1 - STEM_WIDTH)); x--) {
        points.push([x, 0]);
    }

    // Top of the diagonal bit
    let y0 = 0;
    let y1 = DIAGONAL_OFFSET * height;
    let nX = Math.floor(width * (1 - STEM_WIDTH));
    for (let x = Math.floor(width * (1 - STEM_WIDTH)); x >= 0; x--) {
        y = y0 + ((nX - x) / nX) * (y1 - y0);
        points.push([x, y]);
    }

    // Bottom of diagonal bit
    y0 = (DIAGONAL_OFFSET + DIAGONAL_HEIGHT) * height;
    y1 = DIAGONAL_HEIGHT * height;
    nX = Math.floor(width * (1 - STEM_WIDTH));
    for (let x = 0; x <= Math.floor(width * (1 - STEM_WIDTH)); x++) {
        y = y0 + (x / nX) * (y1 - y0);
        points.push([x, y]);
    }

    return points;
}

// TODO: other digits

function translatePoints(points) {
    pointsString = "";
    for (let i = 0; i < points.length; i++) {
        pointsString = pointsString + points[i][0] + "," + points[i][1] + " ";
    }

    return pointsString;
}

// Generate polygon points
let pointsTuple = make0(50,100);
let points = pointsTuple[0];
let distortionExtents = pointsTuple[1];

pointsTuple = make0(50,100);
let points2 = pointsTuple[0];

// Create GP and condition
let gp = new GP(10);
let xVals = [];
let yVals = [];
for (let x = 0; x <= 50; x+=10) {
    xVals.push(x);
    yVals.push(Math.random() * 40 + 5);
}
gp.condition(xVals, yVals);

let gp2 = new GP(5);
for (let i = 0; i < yVals.length; i++) {
    yVals[i] -= 5;
}
gp2.condition(xVals, yVals);

// Get offsets predicted by GP
xQ = [];
for (let x = 0; x <= 50; x++) {
    xQ.push(x);
}
let offsets = gp.predict(xQ.slice());
let offsets2 = gp2.predict(xQ.slice());

originalPoints = [];
for (let i = 0; i < points.length; i++) {
    originalPoints[i] = points[i].slice();
}
setInterval(() => {
    // Adjust points
    for (let i = 0; i < points.length; i++) {
        points[i][1] +=  offsets[Math.round(points[i][0])][0] * distortionExtents[i] * 0.01;
        points2[i][1] += offsets2[Math.round(points2[i][0])][0] * distortionExtents[i] * 0.01;
    }

    digit.setAttribute("points", translatePoints(points));
    digit2.setAttribute("points", translatePoints(points2));
    // digit.setAttribute("points", translatePoints(make1(40, 100)));
}, 1000/30);

// TODO: define vector of meltExtents for each point so that
// not all points are heavily affected. For example, the meltExtent
// of the inner bottom points of the zero may have low melt effects.

// TODO: set a good random seed