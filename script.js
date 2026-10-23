const digit = document.getElementById("digit");

function make0(width, height) {
    // Zero is symmetric, so don't need to bother with proper y-coordinates
    // Parameters for ellipse equation
    h = width / 2;
    k = height / 2;
    a_inner = (width / 2) * 0.4;
    a_outer = width / 2;
    b_inner = (height / 2) * 0.7;
    b_outer = height / 2;

    points = [];

    // Outer boundary (+y and -y)
    for (let x = 0; x <= width; x++) {
        y_outer = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        points.push([x, height - y_outer]);
    }
    for (let x = width; x >= 0; x--) {
        y_outer = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        points.push([x, y_outer]);
    }

    // Inner boundary (+y and -y)
    for (let x = 0; x <= width; x++) {
        // Compute the scaled x value for inner part
        x0_inner = (width / 2) - a_inner;
        x1_inner = (width / 2) + a_inner;
        x_inner = x0_inner + (x / width) * (x1_inner - x0_inner);
        
        y_inner = Math.sqrt((1 - (Math.pow((x_inner-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        points.push([x_inner, y_inner]);
    }
    for (let x = width; x >= 0; x--) {
        // Compute the scaled x value for inner part
        x0_inner = (width / 2) - a_inner;
        x1_inner = (width / 2) + a_inner;
        x_inner = x0_inner + (x / width) * (x1_inner - x0_inner);
        
        y_inner = Math.sqrt((1 - (Math.pow((x_inner-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        points.push([x_inner, height - y_inner]);
    }

    return points;
}

function make1(width, height) {
    // Constants
    STEM_WIDTH = 0.45;
    DIAGONAL_OFFSET = 0.15;
    DIAGONAL_HEIGHT = (STEM_WIDTH * width) / height;

    points = [];

    // Bottom
    for (let x = Math.floor(width * (1 - STEM_WIDTH)); x < width; x++) {
        points.push([x, height - 1]);
    }

    // Top
    for (let x = width - 1; x >= Math.floor(width * (1 - STEM_WIDTH)); x--) {
        points.push([x, 0]);
    }

    // Top of the diagonal bit
    y0 = 0;
    y1 = DIAGONAL_OFFSET * height;
    nX = Math.floor(width * (1 - STEM_WIDTH));
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

function translatePoints(points) {
    pointsString = "";
    for (let i = 0; i < points.length; i++) {
        pointsString = pointsString + points[i][0] + "," + points[i][1] + " ";
    }

    return pointsString;
}

digit.setAttribute("points", translatePoints(make0(50, 100)));
// digit.setAttribute("points", translatePoints(make1(40, 100)));