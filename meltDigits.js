function makex(digit, width, height) {
    if (digit == 0) {
        return make0(width, height);
    } else if (digit == 1) {
        return make1(width, height);
    } // TODO
}

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