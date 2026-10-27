function makex(digit, width, height) {
    if (digit == 0) {
        return make0(width, height);
    } else if (digit == 1) {
        return make1(width, height);
    } else if (digit == 2) {
        return make2(width, height);
    }
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
    const DIAGONAL_OFFSET = 0.12;
    const DIAGONAL_HEIGHT = 0.8 * (STEM_WIDTH * width) / height;

    let points = [];
    let distortionExtents = [];

    // Bottom
    for (let x = Math.floor(width * (1 - STEM_WIDTH)); x < width; x++) {
        points.push([x, height - 1]);
        distortionExtents.push(1);
    }

    // Top
    for (let x = width - 1; x >= Math.floor(width * (1 - STEM_WIDTH)); x--) {
        points.push([x, 0]);
        distortionExtents.push(0.2);
    }

    // Top of the diagonal bit
    let y0 = 0;
    let y1 = DIAGONAL_OFFSET * height;
    let nX = Math.floor(width * (1 - STEM_WIDTH));
    for (let x = Math.floor(width * (1 - STEM_WIDTH)); x >= 0; x--) {
        y = y0 + ((nX - x) / nX) * (y1 - y0);
        points.push([x, y]);
        distortionExtents.push(0.2);
    }

    // Bottom of diagonal bit
    y0 = (DIAGONAL_OFFSET + DIAGONAL_HEIGHT) * height;
    y1 = DIAGONAL_HEIGHT * height;
    nX = Math.floor(width * (1 - STEM_WIDTH));
    for (let x = 0; x <= Math.floor(width * (1 - STEM_WIDTH)); x++) {
        y = y0 + (x / nX) * (y1 - y0);
        points.push([x, y]);
        distortionExtents.push(0.5);
    }

    return [points, distortionExtents];
}

function make2(width, height) {
    // Constants
    LINE_WIDTH = 0.1 * height;
    DIAGONAL_TOP_END_X = 0.7 * width;
    DIAGONAL_TOP_END_Y = 0.4 * height;
    CIRCLE_X = 0.5 * width;
    CIRCLE_Y = 0.25 * height;

    let points = [];
    let distortionExtents = [];

    // Bottom bit
    for (let x = 0; x <= width; x++) {
        points.push([x, height]);
        distortionExtents.push(1);
    }
    
    // Top of bottom bit
    // Calculate the start
    let diagonalAngle = Math.atan(((height - LINE_WIDTH) - DIAGONAL_TOP_END_Y) / (DIAGONAL_TOP_END_X));
    let startX = LINE_WIDTH / Math.sin(diagonalAngle);
    for (let x = width; x >= startX; x--) {
        points.push([x, height - LINE_WIDTH]);
        distortionExtents.push(0.2);
    }

    // Diagonal bit (bottom)
    // Calculate the end position
    let diagonalBottomX = DIAGONAL_TOP_END_X + Math.cos(Math.PI / 2 - diagonalAngle);
    let diagonalBottomY = DIAGONAL_TOP_END_Y + Math.sin(Math.PI / 2 - diagonalAngle);
    for (let x = startX; x <= diagonalBottomX; x++) {
        let xExtent = ((x - startX) / (diagonalBottomX - startX));
        let yInterp = (height - LINE_WIDTH) + xExtent * (height - LINE_WIDTH - diagonalBottomY);
        points.push([x, yInterp]);
        distortionExtents.push(0.5);
    }

    // Outer circle bit
    // Ideally, we require one point per pixel in the x-axis.
    // However, stepping over theta is a lot easier. Just need to use adequately small step size.
    let diagonalAngleCircle = Math.atan2(CIRCLE_Y - DIAGONAL_TOP_END_Y, DIAGONAL_TOP_END_X - CIRCLE_X);
    let radiusOuter = Math.sqrt(Math.pow(CIRCLE_X - diagonalBottomX, 2) + Math.pow(CIRCLE_Y - diagonalBottomY, 2));
    for (let theta = diagonalAngleCircle; theta <= Math.PI; theta+=0.001) {  // Tune theta increment
        points.push([
            CIRCLE_X + radiusOuter * Math.cos(theta),
            CIRCLE_Y - radiusOuter * Math.sin(theta)
        ]);
        distortionExtents.push(0.2);
    }

    // Bottom circle joining bit
    let joinX = points[points.length - 1][0];
    let joinY = points[points.length - 1][1];
    for (let x = joinX; x <= joinX + LINE_WIDTH; x++) {
        points.push([x, joinY]);
        distortionExtents.push(0.7);
    }

    // Inner circle bit
    let radiusInner = Math.sqrt(Math.pow(CIRCLE_X - DIAGONAL_TOP_END_X, 2) + Math.pow(CIRCLE_Y - DIAGONAL_TOP_END_Y, 2));
    for (let theta = Math.PI; theta >= diagonalAngleCircle; theta-=0.001) {  // Tune theta increment
        points.push([
            CIRCLE_X + radiusInner * Math.cos(theta),
            CIRCLE_Y - radiusInner * Math.sin(theta)
        ]);
        distortionExtents.push(0.6);
    }

    // Diagonal bit (top)
    for (let x = DIAGONAL_TOP_END_X; x >= 0; x--) {
        let xExtent = (x / DIAGONAL_TOP_END_X);
        let yInterp = DIAGONAL_TOP_END_Y + xExtent * (DIAGONAL_TOP_END_Y - (height - LINE_WIDTH));
        points.push([x, yInterp]);
        distortionExtents.push(0.5);
    }

    return [points, distortionExtents];
}

// TODO: other digits

function translatePoints(points) {
    pointsString = "";
    for (let i = 0; i < points.length; i++) {
        pointsString = pointsString + points[i][0] + "," + points[i][1] + " ";
    }

    return pointsString;
}