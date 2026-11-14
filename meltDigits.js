// TODO: convert these to ratios
const TEXT_WIDTH = [
    50,  // 0
    40,  // 1
    65,  // 2
    50,  // ...
    65,
    65,
    55,
    55,
    60,
    55
]

function makex(digit, width, height) {
    let digitFuncMap = [
        make0,
        make1,
        make2,
        make3,
        make4,
        make5,
        make6,
        make7,
        make8,
        make9
    ]
    // TODO: probably a better way to do this
    if (digit == 0) {
        return make0(width, height);
    } else if (digit == 1) {
        return make1(width, height);
    } else if (digit == 2) {
        return make2(width, height);
    } else if (digit == 3) {
        return make3(width, height);
    } else if (digit == 4) {
        return make4(width, height);
    } else if (digit == 5) {
        return make5(width, height);
    } else if (digit == 6) {
        return make6(width, height);
    } else if (digit == 7) {
        return make7(width, height);
    } else if (digit == 8) {
        return make8(width, height);
    } else if (digit == 9) {
        return make9(width, height);
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
        let y_outer = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        points.push([x, height - y_outer]);
        distortionExtents.push(0.3);
    }
    for (let x = width; x >= 0; x--) {
        let y_outer = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        points.push([x, y_outer]);
        distortionExtents.push(1);
    }

    // Inner boundary (-y and +y) [+y downwards]
    for (let x = 0; x <= width; x++) {
        // Compute the scaled x value for inner part
        let x0_inner = (width / 2) - a_inner;
        let x1_inner = (width / 2) + a_inner;
        let x_inner = x0_inner + (x / width) * (x1_inner - x0_inner);
        
        let y_inner = Math.sqrt((1 - (Math.pow((x_inner-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        points.push([x_inner, y_inner]);
        distortionExtents.push(0.3);
    }
    for (let x = width; x >= 0; x--) {
        // Compute the scaled x value for inner part
        let x0_inner = (width / 2) - a_inner;
        let x1_inner = (width / 2) + a_inner;
        let x_inner = x0_inner + (x / width) * (x1_inner - x0_inner);
        
        let y_inner = Math.sqrt((1 - (Math.pow((x_inner-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
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
    const LINE_WIDTH = 0.15 * height;

    // Circle at top of the svg element
    const CIRCLE_X = 0.5 * width;
    const CIRCLE_Y = 0.5 * width;
    const CIRCLE_OUTER_R = width / 2;

    const DIAGONAL_CIRCLE_ANGLE = -0.8;  // Radians

    // Calculate intersection between curved part and diagonal top
    const DIAGONAL_TOP_END_X = CIRCLE_X + (CIRCLE_OUTER_R - LINE_WIDTH) * Math.cos(DIAGONAL_CIRCLE_ANGLE);
    const DIAGONAL_TOP_END_Y = CIRCLE_Y - (CIRCLE_OUTER_R - LINE_WIDTH) * Math.sin(DIAGONAL_CIRCLE_ANGLE);

    let points = [];
    let distortionExtents = [];

    // Bottom bit
    for (let x = 0; x <= width; x++) {
        points.push([x, height]);
        distortionExtents.push(0.8);
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
    let diagonalBottomX = DIAGONAL_TOP_END_X + LINE_WIDTH * Math.cos(Math.PI / 2 - diagonalAngle);
    let diagonalBottomY = DIAGONAL_TOP_END_Y + LINE_WIDTH * Math.sin(Math.PI / 2 - diagonalAngle);
    for (let x = startX; x <= diagonalBottomX; x++) {
        let xExtent = ((x - startX) / (diagonalBottomX - startX));
        let yInterp = (height - LINE_WIDTH) + xExtent * (diagonalBottomY - (height - LINE_WIDTH));
        points.push([x, yInterp]);
        distortionExtents.push(0.2);
    }

    // Outer circle bit
    // Ideally, we require one point per pixel in the x-axis.
    // However, stepping over theta is a lot easier. Just need to use adequately small step size.
    // let diagonalAngleCircle = Math.atan2(CIRCLE_Y - DIAGONAL_TOP_END_Y, DIAGONAL_TOP_END_X - CIRCLE_X);
    // let radiusOuter = Math.sqrt(Math.pow(CIRCLE_X - diagonalBottomX, 2) + Math.pow(CIRCLE_Y - diagonalBottomY, 2));
    for (let theta = DIAGONAL_CIRCLE_ANGLE; theta <= Math.PI; theta+=0.001) {  // Tune theta increment
        points.push([
            CIRCLE_X + CIRCLE_OUTER_R * Math.cos(theta),
            CIRCLE_Y - CIRCLE_OUTER_R * Math.sin(theta)
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
    let radiusInner = CIRCLE_OUTER_R - LINE_WIDTH;
    for (let theta = Math.PI; theta >= DIAGONAL_CIRCLE_ANGLE; theta-=0.001) {  // Tune theta increment
        points.push([
            CIRCLE_X + radiusInner * Math.cos(theta),
            CIRCLE_Y - radiusInner * Math.sin(theta)
        ]);
        distortionExtents.push(0.6);
    }

    // Diagonal bit (top)
    for (let x = DIAGONAL_TOP_END_X; x >= 0; x--) {
        let xExtent = (x / DIAGONAL_TOP_END_X);
        let yInterp = (height - LINE_WIDTH) + xExtent * (DIAGONAL_TOP_END_Y - (height - LINE_WIDTH));
        points.push([x, yInterp]);
        distortionExtents.push(0.6);
    }

    return [points, distortionExtents];
}

function make3(width, height) {
    // Constants
    const LINE_WIDTH = 0.15 * height;
    const CIRCLE_CENTER_X = width / 2;
    const R_TOP = 0.5 * width;     // Outer radius for top part
    const R_BOTTOM = 0.5 * width;  // Outer radius for bottom part

    // For scaling digit to full container height
    const MAX_Y = 2*R_TOP + 2*R_BOTTOM - LINE_WIDTH;    
    const SCALE = height / MAX_Y;

    // Calculate center of the bottom circle
    BOTTOM_Y = 2*R_TOP + R_BOTTOM - LINE_WIDTH;

    let points = [];
    let distortionExtents = [];

    // Outer top
    for (let theta = Math.PI; theta >= -Math.PI/2; theta-=0.001) {
        let x = CIRCLE_CENTER_X + R_TOP * Math.cos(theta);
        let y = R_TOP - R_TOP * Math.sin(theta);
        points.push([x, y]);
        distortionExtents.push(0.4);
    }

    // Outer bottom
    for (let theta = Math.PI/2; theta >= -Math.PI; theta-=0.001) {
        let x = CIRCLE_CENTER_X + R_BOTTOM * Math.cos(theta);
        let y = BOTTOM_Y - R_BOTTOM * Math.sin(theta);
        points.push([x, y]);
        if (y < BOTTOM_Y) {
            distortionExtents.push(0.4);
        } else {
            distortionExtents.push(1);
        }
    }

    // Bottom joiner
    for (let x = width / 2 - R_BOTTOM; x <= LINE_WIDTH; x++) {
        points.push([x, BOTTOM_Y]);
        distortionExtents.push(0.2);
    }

    // Inner bottom
    for (let theta = -Math.PI; theta <= Math.PI/2; theta+=0.001) {
        let x = CIRCLE_CENTER_X + (R_BOTTOM - LINE_WIDTH) * Math.cos(theta);
        let y = (BOTTOM_Y) - (R_BOTTOM - LINE_WIDTH) * Math.sin(theta);
        points.push([x, y]);
        distortionExtents.push(0.2);
    }

    // Inner top
    for (let theta = -Math.PI/2; theta <= Math.PI; theta+=0.001) {
        let x = CIRCLE_CENTER_X + (R_TOP - LINE_WIDTH) * Math.cos(theta);
        let y = R_TOP - (R_TOP - LINE_WIDTH) * Math.sin(theta);
        points.push([x, y]);
        distortionExtents.push(0.7);
    }

    // Top joiner
    for (let x = LINE_WIDTH; x >= width / 2 - R_TOP; x--) {
        points.push([x, R_TOP]);
        distortionExtents.push(0.4);
    }

    // Now scale all points so that the digit fills the full container height
    for (let i = 0; i < points.length; i++) {
        points[i][1] *= SCALE;
    }

    return [points, distortionExtents];
}

function make4(width, height) {
    // Constants
    const LINE_WIDTH = 0.15 * height;
    const BOTTOM_OFFSET_Y = height * 0.2;
    const LEFT_OFFSET_X = 0.2 * width;

    let points = [];
    let distortionExtents = [];

    // Bottom stub bit
    for (let x = width - LEFT_OFFSET_X - LINE_WIDTH; x <= width - LEFT_OFFSET_X; x++) {
        points.push([x,height]);
        distortionExtents.push(0.7);
    }

    // Bottom left tail bit
    for (let x = width - LEFT_OFFSET_X; x <= width; x++) {
        points.push([x,height - BOTTOM_OFFSET_Y]);
        distortionExtents.push(0.7);
    }

    // Top left tail bit
    for (let x = width; x >= width - LEFT_OFFSET_X; x--) {
        points.push([x,height - BOTTOM_OFFSET_Y - LINE_WIDTH]);
        distortionExtents.push(0.2);
    }

    // Top bit
    for (let x = width - LEFT_OFFSET_X; x >= width - LEFT_OFFSET_X - LINE_WIDTH; x--) {
        points.push([x, 0]);
        distortionExtents.push(0.2);
    }

    // Diagonal top
    for (let x = width - LEFT_OFFSET_X - LINE_WIDTH; x >= 0; x--) {
        let xExtent = x / (width - LEFT_OFFSET_X - LINE_WIDTH); // xExtent=1 => top
        let y = (height - BOTTOM_OFFSET_Y - LINE_WIDTH) + xExtent * (0 - (height - BOTTOM_OFFSET_Y - LINE_WIDTH));
        points.push([x,y]);
        distortionExtents.push(0.3);
    }

    // Bottom bit
    for (let x = 0; x <= width - LEFT_OFFSET_X - LINE_WIDTH; x++) {
        points.push([x, height - BOTTOM_OFFSET_Y]);
        distortionExtents.push(0.6);
    }

    // Inner bottom
    for (let x = width - LEFT_OFFSET_X - LINE_WIDTH; x >= LINE_WIDTH; x--) {
        points.push([x, height - BOTTOM_OFFSET_Y - LINE_WIDTH]);
        distortionExtents.push(0.2);
    }

    // Inner diagonal
    let deltaX = (width - LEFT_OFFSET_X - LINE_WIDTH) - 0;
    let deltaY = (height - BOTTOM_OFFSET_Y - LINE_WIDTH) - 0;
    let diagonalAngle = Math.atan2(deltaY, deltaX);
    let yTop = LINE_WIDTH / Math.tan(Math.PI / 2 - diagonalAngle);
    for (let x = LINE_WIDTH; x <= width - LEFT_OFFSET_X - LINE_WIDTH; x++) {
        let xExtent = (x - LINE_WIDTH) / ((width - LEFT_OFFSET_X - LINE_WIDTH) - LINE_WIDTH);  // xExtent=1 => top
        let y = (height - BOTTOM_OFFSET_Y - LINE_WIDTH) + xExtent * (yTop - (height - BOTTOM_OFFSET_Y - LINE_WIDTH));
        points.push([x,y]);
        distortionExtents.push(0.5);
    }

    // Link back to start
    points.push([width - LEFT_OFFSET_X - LINE_WIDTH, height - BOTTOM_OFFSET_Y - LINE_WIDTH]);
    distortionExtents.push(0.2);

    return [points, distortionExtents];
}

function make5(width, height) {
    // Constants
    const LINE_WIDTH = 0.15 * height;
    const CIRCLE_R = width / 2;  // Outer radius
    const CIRCLE_X = width / 2;
    const CIRCLE_Y = height - CIRCLE_R;

    // Calculate angle to start at for top half of circle
    const START_Y = -Math.sqrt(Math.pow(CIRCLE_R,2)-Math.pow(LINE_WIDTH-CIRCLE_X,2)) + CIRCLE_Y;
    const START_ANGLE_OUTER = Math.atan2(CIRCLE_Y - START_Y, LINE_WIDTH - CIRCLE_X);
    const START_ANGLE_INNER = Math.atan2(CIRCLE_Y - (START_Y + LINE_WIDTH), LINE_WIDTH - CIRCLE_X);
    
    const JOIN_Y_TOP = CIRCLE_Y - (CIRCLE_R - LINE_WIDTH) * Math.sin(START_ANGLE_INNER);

    // Calculate angle to end at for bottom half of circle
    const END_Y = -Math.sqrt(Math.pow(CIRCLE_R-LINE_WIDTH,2)-Math.pow(LINE_WIDTH-CIRCLE_X,2)) + CIRCLE_Y;
    const ANGLE_BOTTOM_INNER = -Math.atan2(CIRCLE_Y - END_Y, LINE_WIDTH - CIRCLE_X);
    const ANGLE_BOTTOM_OUTER = -Math.atan2(CIRCLE_Y - END_Y, 0 - CIRCLE_X);
    
    let points = [];
    let distortionExtents = [];

    // Top bit
    for (let x = 0; x < width; x++) {
        points.push([x,0]);
        distortionExtents.push(0.2);
    }

    // Underside of top bit
    for (let x = width; x >= LINE_WIDTH; x--) {
        points.push([x, LINE_WIDTH]);
        distortionExtents.push(0.3);
    }

    // Outer circle
    for (let theta = START_ANGLE_OUTER; theta >= ANGLE_BOTTOM_OUTER; theta-=0.001) {
        let x = CIRCLE_X + CIRCLE_R * Math.cos(theta);
        let y = CIRCLE_Y - CIRCLE_R * Math.sin(theta);
        points.push([x,y]);
        if (y <= CIRCLE_Y) {
            distortionExtents.push(0.2);
        } else {
            distortionExtents.push(0.7);
        }
    }

    // Join bit bottom
    for (let x = 0; x <= LINE_WIDTH; x++) {
        points.push([x, END_Y]);
        distortionExtents.push(0.2);
    }
    
    // Inner circle
    for (let theta = ANGLE_BOTTOM_INNER; theta <= START_ANGLE_INNER; theta+=0.001) {
        let x = CIRCLE_X + (CIRCLE_R - LINE_WIDTH)  * Math.cos(theta);
        let y = CIRCLE_Y - (CIRCLE_R - LINE_WIDTH) * Math.sin(theta);
        points.push([x,y]);
        if (y > CIRCLE_Y) {
            distortionExtents.push(0.2);
        } else {
            distortionExtents.push(0.3);
        }
    }

    // Join bit top
    for (let x = LINE_WIDTH; x >= 0; x--) {
        points.push([x, JOIN_Y_TOP]);
        distortionExtents.push(0.3);
    }

    return [points, distortionExtents];
}

function make6(width, height) {
    // '6' is constructed using partial ellipses combined with circles for
    // the top bit of the middle 'bridge'.

    // Constants
    const ELLIPSE_STOP_TOP_Y = 0.25 * height;
    const ELLIPSE_STOP_BOTTOM_OUTER_Y = 0.6 * height;
    const ELLIPSE_STOP_BOTTOM_INNER_Y = 0.65 * height;
    const CIRCLE_CENTER_Y = 0.75 * height; // Shared by both circles
    const OUTER_CIRCLE_CENTER_X = 0.53 * width;
    const INNER_CIRCLE_CENTER_X = 0.5 * width;

    let h = width / 2;
    let k = height / 2;
    let a_inner = (width / 2) * 0.4;
    let a_outer = width / 2;
    let b_inner = (height / 2) * 0.7;
    let b_outer = height / 2;

    let points = [];
    let distortionExtents = [];

    // Inner top boundary partial ellipse (-y, +ve y downwards)
    for (let x = 0; x <= width; x++) {
        // Compute the scaled x value for inner part
        let x0_inner = (width / 2) - a_inner;
        let x1_inner = (width / 2) + a_inner;
        let x_inner = x0_inner + (x / width) * (x1_inner - x0_inner);
        
        let y_inner = -Math.sqrt((1 - (Math.pow((x_inner-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        if (!(x_inner > width / 2 && y_inner > ELLIPSE_STOP_TOP_Y)) {
            points.push([x_inner, y_inner]);
            distortionExtents.push(0.2);
        }
    }

    // Outer top boundary partial ellipse
    for (let x = width; x >= 0; x--) {
        let y_outer = -Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        if (!(x > width / 2 && y_outer > ELLIPSE_STOP_TOP_Y)) {
            points.push([x, y_outer]);
            distortionExtents.push(0.1);
        }
    }

    // Outer bottom boundary partial ellipse
    for (let x = 0; x <= width; x++) {
        let y_outer = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_outer,2))) * Math.pow(b_outer, 2)) + k;
        if (!(x > width / 2 && y_outer < ELLIPSE_STOP_BOTTOM_OUTER_Y)) {
            points.push([x, y_outer]);
            distortionExtents.push(0.8);
        }
    }

    // Outer circle 'bridge'
    // x-value of the point where the outer ellipse finishes will be points[-1].x
    // Use this x-value to calculate the circle's radius
    let xIntersectRight = points[points.length - 1][0];
    let rOuter = Math.sqrt(Math.pow(xIntersectRight - OUTER_CIRCLE_CENTER_X, 2) + Math.pow(ELLIPSE_STOP_BOTTOM_OUTER_Y - CIRCLE_CENTER_Y, 2));
    // Calculate intersection of circle with other side of the ellipse (inner ellipse)
    // This is difficult to do analytically, so brute force is used
    let minDistance = 1000; // Distance between y points
    let xIntersectLeft = 0;
    for (let x = 0; x < width / 2; x++) {
        let yEllipse = -Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        let yCircle = -Math.sqrt(Math.pow(rOuter, 2) - Math.pow(x - OUTER_CIRCLE_CENTER_X, 2)) + CIRCLE_CENTER_Y;
        if (Math.abs(yEllipse - yCircle) < minDistance) {
            xIntersectLeft = x;
            minDistance = Math.abs(yEllipse - yCircle);
        }
    }
    // Create points for outer part of the 'bridge'
    for (let x = xIntersectRight; x >= xIntersectLeft - 1; x--) {
        let yBridge = -Math.sqrt(Math.pow(rOuter, 2) - Math.pow(x - OUTER_CIRCLE_CENTER_X, 2)) + CIRCLE_CENTER_Y;
        points.push([x, yBridge]);
        distortionExtents.push(0.2);
    }

    // Inner circle 'bridge'
    // Calculate radius 
    let xInnerEllipseEnd = Math.sqrt(Math.pow(a_inner, 2) - Math.pow(a_inner, 2) * Math.pow(ELLIPSE_STOP_BOTTOM_INNER_Y - k, 2) / Math.pow(b_inner, 2)) + h;
    let rInner = Math.sqrt(Math.pow(xInnerEllipseEnd - INNER_CIRCLE_CENTER_X, 2) + Math.pow(ELLIPSE_STOP_BOTTOM_INNER_Y - CIRCLE_CENTER_Y, 2));
    // Get intersection between inner ellipse via brute force
    minDistance = 100;
    let xInnerEllipseStart = 0;
    for (let x = 0; x < width / 2; x++) {
        let yEllipse = -Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        let yCircle = -Math.sqrt(Math.pow(rInner, 2) - Math.pow(x - INNER_CIRCLE_CENTER_X, 2)) + CIRCLE_CENTER_Y;
        if (Math.abs(yEllipse - yCircle) < minDistance) {
            xInnerEllipseStart = x;
            minDistance = Math.abs(yEllipse - yCircle);
        }
    }
    // Draw inner circle 'bridge'
    for (let x = xInnerEllipseStart; x <= xInnerEllipseEnd; x++) {
        let yBridge = -Math.sqrt(Math.pow(rInner, 2) - Math.pow(x - INNER_CIRCLE_CENTER_X, 2)) + CIRCLE_CENTER_Y;
        points.push([x, yBridge]);
        distortionExtents.push(0.3);
    }

    // Inner ellipse bottom
    for (let x = xInnerEllipseEnd; x >= xInnerEllipseStart; x--) {
        let y_inner = Math.sqrt((1 - (Math.pow((x-h),2)/Math.pow(a_inner,2))) * Math.pow(b_inner, 2)) + k;
        points.push([x, y_inner]);
        distortionExtents.push(0.2);
    }

    return [points, distortionExtents];
}

function make7(width, height) {
    // Constants
    const LINE_WIDTH = 0.15 * height;
    const BOTTOM_OFFSET_RIGHT = 0.8 * width;

    let points = [];
    let distortionExtents = [];

    // Bottom
    let startX = Math.floor(width - BOTTOM_OFFSET_RIGHT - LINE_WIDTH);
    for (let x = startX; x < startX + LINE_WIDTH; x++) {
        points.push([x, height]);
        distortionExtents.push(1);
    }

    // Underside of diagonal part
    // Note: the width of the diagonal part is not calculated correctly
    for (let x = startX + LINE_WIDTH; x <= width; x++) {
        let extent = (x - (startX + LINE_WIDTH)) / (width - (startX + LINE_WIDTH));
        let y = height + extent * (LINE_WIDTH - height)
        points.push([x, y]);
        distortionExtents.push(0.6);
    }

    // Top
    for (let x = width; x >= 0; x--) {
        points.push([x, 0]);
        distortionExtents.push(0.2);
    }

    // Underside of top horizontal bit
    for (let x = 0; x <= width - LINE_WIDTH; x++) {
        points.push([x, LINE_WIDTH]);
        distortionExtents.push(0.4);
    }    

    // Topside of diagonal part
    for (let x = width - LINE_WIDTH; x >= startX; x--) {
        // Extent is 0 at top and 1 at bottom
        let extent = (x - (width - LINE_WIDTH)) / (startX - (width - LINE_WIDTH));
        let y = LINE_WIDTH + extent * (height - LINE_WIDTH);
        points.push([x, y]);
        distortionExtents.push(0.2);
    }

    return [points, distortionExtents];
}

function make8(width, height) {
    // Constants
    const LINE_WIDTH = 0.15 * height;
    const CIRCLE_CENTER_X = width / 2;
    const R_TOP = 0.45 * width;     // Outer radius for top part
    const R_BOTTOM = 0.5 * width;  // Outer radius for bottom part

    // For scaling digit to full container height
    const MAX_Y = 2*R_TOP + 2*R_BOTTOM - LINE_WIDTH;    
    const SCALE = height / MAX_Y;

    // Calculate center of the bottom circle
    BOTTOM_Y = 2*R_TOP + R_BOTTOM - LINE_WIDTH;
    
    let points = [];
    let distortionExtents = [];

    // Outer top circle
    for (let theta = 3 * Math.PI / 2; theta >= - Math.PI / 2; theta-=0.001) {
        let x = CIRCLE_CENTER_X + R_TOP * Math.cos(theta);
        let y = R_TOP + R_TOP * Math.sin(theta);
        points.push([x,y]);
        if (theta <= Math.PI && theta >= 0) {
            distortionExtents.push(0.7);
        } else {
            distortionExtents.push(0.2);
        }
    }

    // Inner top circle
    for (let theta = -Math.PI / 2; theta <= 3 * Math.PI / 2; theta+=0.001) {
        let x = CIRCLE_CENTER_X + (R_TOP - LINE_WIDTH) * Math.cos(theta);
        let y = R_TOP + (R_TOP - LINE_WIDTH) * Math.sin(theta);
        points.push([x,y]);
        if (theta <= Math.PI && theta >= 0) {
            distortionExtents.push(0.4);
        } else {
            distortionExtents.push(0.1);
        }
    }

    // Outer bottom circle
    for (let theta = 3 * Math.PI / 2; theta >= - Math.PI / 2; theta-=0.001) {
        let x = CIRCLE_CENTER_X + R_BOTTOM * Math.cos(theta);
        let y = BOTTOM_Y + R_BOTTOM * Math.sin(theta);
        points.push([x,y]);
        if (theta <= Math.PI && theta >= 0) {
            distortionExtents.push(0.7);
        } else {
            distortionExtents.push(0.2);
        }
    }

    // Inner bottom circle
    for (let theta = -Math.PI / 2; theta <= 3 * Math.PI / 2; theta+=0.001) {
        let x = CIRCLE_CENTER_X + (R_BOTTOM - LINE_WIDTH) * Math.cos(theta);
        let y = BOTTOM_Y + (R_BOTTOM - LINE_WIDTH) * Math.sin(theta);
        points.push([x,y]);
        if (theta <= Math.PI && theta >= 0) {
            distortionExtents.push(0.4);
        } else {
            distortionExtents.push(0.1);
        }
    }

    // Now scale all points so that the digit fills the full container height
    for (let i = 0; i < points.length; i++) {
        points[i][1] *= SCALE;
    }

    return [points, distortionExtents];
}

function make9(width, height) {
    // Constants
    const LINE_WIDTH = 0.15 * height;
    const CIRCLE_CENTER_X = width / 2;
    const R_TOP = 0.5*width;

    let points = [];
    let distortionExtents = [];

    // Top outer circle
    for (let theta = -Math.PI; theta <= Math.PI; theta+=0.001) {
        let x = CIRCLE_CENTER_X + R_TOP * Math.cos(theta);
        let y = R_TOP + R_TOP * Math.sin(theta);
        points.push([x,y]);
        if (theta >= -Math.PI && theta <= 0) {
            distortionExtents.push(0.7);
        } else {
            distortionExtents.push(0.2);
        }
    }

    // Top inner circle
    for (let theta = -Math.PI; theta <= Math.PI; theta+=0.001) {
        let x = CIRCLE_CENTER_X + (R_TOP - LINE_WIDTH) * Math.cos(theta);
        let y = R_TOP + (R_TOP - LINE_WIDTH) * Math.sin(theta);
        points.push([x,y]);
        if (theta >= -Math.PI && theta <= 0) {
            distortionExtents.push(0.4);
        } else {
            distortionExtents.push(0.1);
        }
    }

    // Bottom stem right - top point is implicit

    // Bottom
    for (let x = LINE_WIDTH; x >= 0; x--) {
        points.push([x, height]);
        distortionExtents.push(0.7);
    }

    // Link back to top
    points.push([0, R_TOP]);
    distortionExtents.push(0.7);

    return [points, distortionExtents];
}

function translatePoints(points) {
    pointsString = "";
    for (let i = 0; i < points.length; i++) {
        pointsString = pointsString + points[i][0] + "," + points[i][1] + " ";
    }

    return pointsString;
}