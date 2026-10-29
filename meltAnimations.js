// Constant params
BACKGROUND_GP_LENGTHSCALE = 10;
FOREGROUND_GP_LENGTHSCALE = 5;

BACKGROUND_CONDITION_OFFSET = 5;  // px
CONDITION_EXTENT = 40;            // px

// List of digits; each element is a length-2 list for the digit's background and foreground, respectively.
let digits = [];
let svgs = [];
for (let i = 0; i < 3; i++) {
    let currentDigit = [];
    // Check if digit exists and add its background and foreground to collection if so
    if (document.getElementById(`digit${i}Background`)) {
        currentDigit.push(document.getElementById(`digit${i}Background`));
        currentDigit.push(document.getElementById(`digit${i}Foreground`));
        digits.push(currentDigit);
    }
    svgs.push(document.getElementById(`svg${i}`));
}

// Make points for each digit
let digString = [3,1,4];  // TODO: remove hardcoded values
let digitPolyPoints = [];
let distortionExtents = [];
for (let i = 0; i < digits.length; i++) {
    digitPolyPoints.push([
        // Background and foreground
        makex(digString[i], TEXT_WIDTH[digString[i]], 100)[0],  // TODO: remove hard-coded values
        makex(digString[i], TEXT_WIDTH[digString[i]], 100)[0]
    ]);
    distortionExtents.push([
        // Background and foreground
        makex(digString[i], TEXT_WIDTH[digString[i]], 100)[1],  // TODO: remove hard-coded values
        makex(digString[i], TEXT_WIDTH[digString[i]], 100)[1]
    ]);

    svgs[i].setAttribute("width", TEXT_WIDTH[digString[i]] + 10);
}

// Create GPs
let gps = [];
for (let i = 0; i < digits.length; i++) {
    let backgroundGP = new GP(BACKGROUND_GP_LENGTHSCALE);
    let foregroundGP = new GP(FOREGROUND_GP_LENGTHSCALE);
    
    // Condition
    let xVals = [];
    let yValsBackground = [];
    let yValsForeground = [];
    for (let x = 0; x <= 50; x+=10) {
        xVals.push(x);
        let r = Math.random();
        yValsBackground.push(r * CONDITION_EXTENT + BACKGROUND_CONDITION_OFFSET);
        yValsForeground.push(r * CONDITION_EXTENT);
    }
    backgroundGP.condition(xVals.slice(), yValsBackground);
    foregroundGP.condition(xVals.slice(), yValsForeground);

    gps.push([
        backgroundGP,
        foregroundGP
    ])
}


// Calculate offsets
let offsets = [];
for (let i = 0; i < gps.length; i++) {
    offsets[i] = [];
    for (let j = 0; j < gps[i].length; j++) {
        let xQ = [];
        for (let x = 0; x <= TEXT_WIDTH[digString[i]]; x++) { xQ.push(x); }
        offsets[i][j] = gps[i][j].predict(xQ);
    }
}

setInterval(() => {
    for (let i = 0; i < digitPolyPoints.length; i++) {
        for (let j = 0; j < digitPolyPoints[i].length; j++) {
            for (let k = 0; k < digitPolyPoints[i][j].length; k++) {
                let xpxVal = Math.round(digitPolyPoints[i][j][k][0]);
                xpxVal = Math.min(xpxVal, TEXT_WIDTH[digString[i]]);
                xpxVal = Math.max(xpxVal, 0);


                let currentOffset = offsets[i][j][xpxVal][0];
                digitPolyPoints[i][j][k][1] += currentOffset * distortionExtents[i][j][k] * 0.01;
            }
            digits[i][j].setAttribute("points", translatePoints(digitPolyPoints[i][j]));
        }
    }
}, 1000/30);

// TODO: set a good random seed