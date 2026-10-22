const digit = document.getElementById("digit");

function make0(width, height) {

}

function make1(width, height) {
    // Constants
    STEM_WIDTH = 0.45;
    DIAGONAL_OFFSET = 0.15;
    DIAGONAL_HEIGHT = (STEM_WIDTH * width) / height;

    n = 0;  // Number of points; used for appending to `points`
    points = [];

    // Bottom
    for (let x = Math.floor(width * (1 - STEM_WIDTH)); x < width; x++) {
        points[n] = [x, height - 1];
        n++;
    }

    // Top
    for (let x = width - 1; x >= Math.floor(width * (1 - STEM_WIDTH)); x--) {
        points[n] = [x, 0];
        n++;
    }

    // Top of the diagonal bit
    y0 = 0;
    y1 = DIAGONAL_OFFSET * height;
    nX = Math.floor(width * (1 - STEM_WIDTH));
    for (let x = Math.floor(width * (1 - STEM_WIDTH)); x >= 0; x--) {
        y = y0 + ((nX - x) / nX) * (y1 - y0);
        points[n] = [x, y];
        n++;
    }

    // Bottom of diagonal bit
    y0 = (DIAGONAL_OFFSET + DIAGONAL_HEIGHT) * height;
    y1 = DIAGONAL_HEIGHT * height;
    nX = Math.floor(width * (1 - STEM_WIDTH));
    for (let x = 0; x <= Math.floor(width * (1 - STEM_WIDTH)); x++) {
        y = y0 + (x / nX) * (y1 - y0);
        points[n] = [x, y];
        n++;
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

digit.setAttribute("points", translatePoints(make1(40, 100)));