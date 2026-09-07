/**
 * @author TIm Cox <tcox6@utas.edu.au>
 * 
 * Implementation for a 3D mesh renderer.
 * 
 * Uses a left-hand coordinate system.
 * +ve in x-axis is right, +ve in y-axis is up, and +ve in z-axis is into the screen.
 */

// Orthographic projection matrix
const VIEWPORT_SCALE = 4; // Scale between viewport pixels and mesh units
const projectionMatrix = [
    [VIEWPORT_SCALE,0,0,0],
    [0,VIEWPORT_SCALE,0,0],
    [0,0,1,0], // Retain depth
    [0,0,0,1]
];

// Number of pixels per unit of screen space
// Can be used to give a pixelated effect (or TODO: dot matrix effect)
const PIXEL_SIZE = 1;

// ================================
// UTILITY FUNCTIONS
// ================================

function drawHorizontalLine(viewportBuffer, x1, x2, y, c, d1, d2) {
    /**
     * Draws a horizontal line to the graphics buffer.
     * 
     * Interpolates between d1 and d2.
     * 
     * @param x1 First x-value (in buffer space)
     * @param x2 Second x-value (in buffer space)
     * @param y y-value of line
     * @param c Fill colour (0~255)
     * @param d1 Depth at (x1, y)
     * @param d2 Depth at (x2, y)
     */
    // Ensure that x1 <= x2
    if (x1 > x2) {
        // Swap x1 and x2
        let temp = x1;
        x1 = x2;
        x2 = temp;
    }
    for (let x = x1; x <= x2; x++) {
        if (x >= 0 && x < viewportBuffer[0].length && y >= 0 && y < viewportBuffer.length) {
            // Interpolate depth
            let d = d1 + (x-x1) * ((d2 - d1) / (x2 - x1 + 1));
            // Set colour and depth in graphics buffer
            // But only if a closer point is not already written
            if (d > viewportBuffer[y][x][1]) {
                viewportBuffer[y][x] = [c, d];
            }
        }
    }
}

function drawTriangle(viewportBuffer, p1, p2, p3, c) {
    /**
     * @author Tim Cox <tcox6@utas.edu.au>
     * Draws a triangle to the viewport grid buffer.
     * Note that this function has been adapted from my KIT307 portfolio (originally written in C# for Unity).
     * All work is my own: the algorithm was originally developed in Semester 2 2025, and was adapted
     *   into JS for this assignment.
     * 
     * @param p1 Array representing (x,y) position of first point within graphics buffer, where p1[0]=x and p1[1]=y (and p1[2] is depth)
     * @param p2 Array representing (x,y) position of second point within graphics buffer, where p2[0]=x and p2[1]=y (and p2[2] is depth))
     * @param p3 Array representing (x,y) position of third point within graphics buffer, where p3[0]=x and p3[1]=y (and p3[2] is depth)
     * @param c Fill colour (0~255)
     */
    // Extract x1, y1, x2, y2, x3, y3, and depth for all points
    let x1 = p1[0];
    let y1 = p1[1];
    let x2 = p2[0];
    let y2 = p2[1];
    let x3 = p3[0];
    let y3 = p3[1];
    let d1 = p1[2];
    let d2 = p2[2];
    let d3 = p3[2];

    // Need to ensure that !(y1 == y2 == y3)
    if (y1 == y2 && y1 == y3)
    {
        // Get min x
        let minX = x1;
        let minD = d1;
        if (x2 < x1 && x2 < x3) {
            minX = x2;
            minD = d2;
        }
        if (x3 < x1 && x3 < x2) {
            minX = x3;
            minD = d3;
        }
        // Get max x
        let maxX = x1;
        let maxD = d1;
        if (x2 > x1 && x2 > x3) {
            maxX = x2;
            maxD = d2;
        }
        if (x3 > x1 && x3 > x2) {
            maxX = x3;
            maxD = d3;
        }
        drawHorizontalLine(viewportBuffer, minX, maxX, y1, c, minD, maxD);
    }
    else
    {
        // Find center point to split triangle with (and let (x1, y1) be this middle point with depth d1)
        let temp;
        if (y2 >= Math.min(y1, y3) && y2 <= Math.max(y1, y3))
        {
            temp = x1;
            x1 = x2;
            x2 = temp;

            temp = y1;
            y1 = y2;
            y2 = temp;

            temp = d1;
            d1 = d2;
            d2 = temp;
        }
        else if (y3 >= Math.min(y1, y2) && y3 <= Math.max(y1, y2))
        {
            temp = x1;
            x1 = x3;
            x3 = temp;

            temp = y1;
            y1 = y3;
            y3 = temp;

            temp = d1;
            d1 = d3;
            d3 = temp;
        }

        // Ensure that y2 is minimum and y3 is max
        if (y3 < y2)
        {
            temp = x2;
            x2 = x3;
            x3 = temp;

            temp = y2;
            y2 = y3;
            y3 = temp;

            temp = d2;
            d2 = d3;
            d3 = temp;
        }

        // Loop through y-values (incrementing)
        let slope_line1 = (x3 - x1) / (y3 - y1);
        let slope_line2 = (x2 - x3) / (y2 - y3);
        let x_line1 = x1;
        let x_line2 = x2 + ((y1 - y2) * slope_line2);
        let d_line1, d_line2;
        for (let y = y1; y <= y3; y++) {
            // Interpolate depth
            d_line1 = d1 + (y-y1) * ((d3 - d1) / (y3 - y1));
            d_line2 = d2 + (y-y2) * ((d3 - d2) / (y3 - y2));

            drawHorizontalLine(viewportBuffer, Math.round(x_line1), Math.round(x_line2), y, c, -d_line1, -d_line2);
            x_line1 += slope_line1;
            x_line2 += slope_line2;
        }

        // Loop through y-values (decrementing)
        slope_line1 = (x2 - x1) / (y2 - y1);
        slope_line2 = (x2 - x3) / (y2 - y3);
        x_line1 = x1;
        x_line2 = x2 + ((y1 - y2) * slope_line2);
        for (let y = y1; y >= y2; y--) {
            // Interpolate depth
            d_line1 = d1 + (y1-y) * ((d2 - d1) / (y1 - y2));
            d_line2 = d2 + (y-y2) * ((d3 - d2) / (y3 - y2));
            // console.log([d1,d2,d3]);
            // console.log([d_line1, d_line2]);

            drawHorizontalLine(viewportBuffer, Math.round(x_line1), Math.round(x_line2), y, c, -d_line1, -d_line2);
            x_line1 -= slope_line1;
            x_line2 -= slope_line2;
        }
    }
}

function mult(m1, m2) {
    /**
     * Function to multiply two matrices.
     * Throws error if matrices cannot be multiplied.
     * Note that there are more efficient algorithms for matrix multiplication.
     * 
     * @param m1 Matrix A
     * @param m2 Matrix B
     */
    // Assert that matrices are the correct size
    if (m1[0].length == m2.length) {
        // Perform multiplication
        let product = [];
        for (let i = 0; i < m1.length; i++) {
            product[i] = [];
            for (let j = 0; j < m2[0].length; j++) {
                let c = 0;
                for (let k = 0; k < m1[0].length; k++) {
                    // Definition of matrix multiplication
                    c += m1[i][k] * m2[k][j];
                }
                product[i][j] = c;
            }
        }

        return product;
    } else {
        throw new Error(`Matrices cannot be multiplied: incorrect size.\n 
            Matrix 1 has size ${m1.length}x${m1[0].length} and Matrix 2 has size ${m2.length}x${m2[0].length}.`);
    }
}

function multMany(arr) {
    /**
     * Multiplies an array of matrices together
     * 
     * @param arr Array of matrices to multiply
     * @returns Resulting matrix
     */
    let current = mult(arr[0], arr[1]);
    for (let i = 2; i < arr.length; i++) {
        current = mult(current, arr[i]);
    }

    return current;
}

// Note that it would be better to use Quaternions
// However, this is complicated and is therefore a stretch goal
function getXRotationMatrix(theta) {
    /**
     * Gets rotation matrix for rotation about X-axis.
     * Assumes homogeneous coordinates.
     * 
     * @param theta Rotation about X-axis in radians.
     */
    return [
        [1, 0, 0, 0],
        [0, Math.cos(theta), -1 * Math.sin(theta), 0],
        [0, Math.sin(theta), Math.cos(theta), 0],
        [0,0,0,1]
    ];
}
function getYRotationMatrix(theta) {
    /**
     * Gets rotation matrix for rotation about Y-axis.
     * Assumes homogeneous coordinates.
     * 
     * @param theta Rotation about Y-axis in radians.
     */
    return [
        [Math.cos(theta), 0, Math.sin(theta), 0],
        [0, 1, 0, 0],
        [-1 * Math.sin(theta), 0, Math.cos(theta), 0],
        [0,0,0,1]
    ];
}
function getZRotationMatrix(theta) {
    /**
     * Gets rotation matrix for rotation about Z-axis.
     * Assumes homogeneous coordinates.
     * 
     * @param theta Rotation about Z-axis in radians.
     */
    return [
        [Math.cos(theta), -1 * Math.sin(theta), 0, 0],
        [Math.sin(theta), Math.cos(theta), 0, 0],
        [0,0,1,0],
        [0,0,0,1]
    ];
}

function getTranslationMatrix(x, y, z) {
    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [x,y,z,1]
    ];
}

function calculateNormal(p1, p2, p3) {
    /**
     * Calculates the normal vector to the plane defined by three given points.
     * Normal between two vectors a and b is given by a cross b.
     * 
     * @param p1 Array representing (x,y,z) position of first point, where p1[0]=x, p1[1]=y, and p1[2]=z
     * @param p2 Array representing (x,y,z) position of second point, where p2[0]=x, p2[1]=y, and p2[2]=z
     * @param p3 Array representing (x,y,z) position of third point, where p3[0]=x, p3[1]=y, and p3[2]=z
     * 
     * @returns Normalised normal vector as an array
     */
    // Get two vectors in the plane defined by {p1, p2, p3}
    let v1 = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
    let v2 = [p1[0] - p3[0], p1[1] - p3[1], p1[2] - p3[2]];

    // Normal vector is given by the cross product between v1 and v2, as follows:
    // n = |i    j    k   |
    //     |v1_x v1_y v1_z|
    //     |v2_x v2_y v2_z|
    // where i, j, k are the basis vectors for the x, y, and z-axes, respectively
    // and |A| is the determinant of matrix A
    //   = i|v1_y v1_z| - j|v1_x v1_z| + k|v1_x v1_y|
    //      |v2_y v2_z|    |v2_x v2_z|    |v2_x  2_y|
    //   = i(v1_y * v2_z - v1_z * v2_y) - j(v1_x * v2_z - v1_z * v2_x) + k(v1_x * v2_y - v1_y * v2_x)
    //   = <v1_y * v2_z - v1_z * v2_y, v1_z * v2_x - v1_x * v2_z, v1_x * v2_y - v1_y * v2_x>
    // It probably wasn't necessary to show all of this as it is trivial, but anyway...
    let n_x = v1[1] * v2[2] - v1[2] * v2[1];
    let n_y = v1[2] * v2[0] - v1[0] * v2[2];
    let n_z = v1[0] * v2[1] - v1[1] * v2[0];

    // Need to normalise n
    let norm = Math.sqrt(n_x * n_x + n_y * n_y + n_z * n_z);
    n_x = n_x / norm;
    n_y = n_y / norm;
    n_z = n_z / norm;

    let n = [n_x, n_y, n_z];

    return n
}

function cosineSimilarity(v1, v2) {
    /**
     * Computes the cosine similarity between two vectors.
     * Cosine similarity is always in [-1, 1].
     * Closer to 1 implies greater similarity.
     * 
     * @param v1 A three-dimensional vector
     * @param v2 A three-dimensional vector
     */
    // Cosine similarity:
    // (v1 dot v2) / ||v1|| * ||v2||
    let dotProduct = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    let v1norm = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);
    let v2norm = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);

    let cosineSim = dotProduct / (v1norm * v2norm);

    return cosineSim;
}

function getInitialTransformations(meshPath) {
    /**
     * Computes the initial transformations for a given mesh.
     * 
     * @param meshPath The path to the mesh JSON file.
     * @returns Transformation matrix (homogeneous coordinates)
     */
    if (meshPath.includes("eiffelTowerCompressed")) {
        let Rx = getXRotationMatrix(90 * (Math.PI / 180));
        let Ry = getYRotationMatrix(30 * (Math.PI / 180));
        let Rz = getZRotationMatrix(0 * (Math.PI / 180));
        let T = getTranslationMatrix(-50, -90, 0);

        return multMany([Rx, Ry, Rz, T]);
    } else if (meshPath.includes("colosseum")) {
        let Rx = getXRotationMatrix(45 * (Math.PI / 180));
        let Ry = getYRotationMatrix(0 * (Math.PI / 180));
        let Rz = getZRotationMatrix(0 * (Math.PI / 180));
        let T = getTranslationMatrix(-80, -70, 0);

        return multMany([Rx, Ry, Rz, T]);
    }

    // Default value - identity matrix
    return [
                [1,0,0,0],
                [0,1,0,0],
                [0,0,1,0],
                [0,0,0,1]
            ];
}

function clearBuffer(canvas, viewportBuffer, canvasContext) {
    /**
     * Clears a given buffer and canvas.
     * 
     * @param canvas A canvas element
     * @param viewPortBuffer Pixel buffer to draw to/from
     * @param canvasContext Context for a canvas (e.g., canvas.getContext("2d"))
     */
    // Clear the screen and graphics buffer
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < viewportBuffer.length; y++) {
        for (let x = 0; x < viewportBuffer[0].length; x++) {
            viewportBuffer[y][x] = [0, -100];
        }
    }
}

function updateBuffer(canvas, viewportBuffer, vertices, tris) {
    /**
     * Updates the graphics buffer by drawing triangles representing the projection of the mesh.
     * 
     * @param canvas A canvas element
     * @param viewPortBuffer Pixel buffer to draw to/from
     * @param vertices Vertices array for mesh
     * @param tris Indices array for mesh
     */
    for (let i = 0; i <= tris.length - 3; i+=3) {
        // Calculate projections for the current triangles
        let p1 = mult(vertices[tris[i]], projectionMatrix);
        let p2 = mult(vertices[tris[i+1]], projectionMatrix);
        let p3 = mult(vertices[tris[i+2]], projectionMatrix);

        // Convert to cartesian coordinates, keeping depth data
        p1 = [p1[0][0], p1[0][1], p1[0][2]];
        p2 = [p2[0][0], p2[0][1], p2[0][2]];
        p3 = [p3[0][0], p3[0][1], p3[0][2]];

        // Determine surface normal to calculate shading
        // Note that the shading model used is just a dummy model
        //  where the shade of a surface is proportional to the similarity
        //  between the surface normal and the vector representing
        //  the direction towards the light source, <0, 0, -1>.
        // Similarity between two vectors is computed using cosine similarity.
        let normal = calculateNormal(vertices[tris[i]][0], vertices[tris[i+1]][0], vertices[tris[i+2]][0]);
        let lightSource = [0, 0.2, -1]; // Relative to camera (origin, pointed in positive z-axis)
        let sim = cosineSimilarity(normal, lightSource);
        sim = (sim + 1) / 2; // Restrict to [0, 1]

        // Draw triangle on buffer
        // But only if vertices are in clockwise order
        // The normal to the plane can be used to determine whether in clockwise order
        if (calculateNormal([p1[0], p1[1], 0], [p2[0], p2[1], 0], [p3[0], p3[1], 0])[2] < 0) {
            // Convert p1, p2, p3 to buffer space
            p1[0] = Math.round((p1[0] + canvas.width / 2) / PIXEL_SIZE);
            p1[1] = Math.round((canvas.height - (p1[1] + canvas.height / 2)) / PIXEL_SIZE);
            p2[0] = Math.round((p2[0] + canvas.width / 2) / PIXEL_SIZE);
            p2[1] = Math.round((canvas.height - (p2[1] + canvas.height / 2)) / PIXEL_SIZE);
            p3[0] = Math.round((p3[0] + canvas.width / 2) / PIXEL_SIZE);
            p3[1] = Math.round((canvas.height - (p3[1] + canvas.height / 2)) / PIXEL_SIZE);
            
            // Note that this is somewhat redundant since canvas API likely has a function for drawing triangles.
            // However, advantage of using a custom drawing function is that it allows the resolution to be adjusted.
            drawTriangle(viewportBuffer, p1, p2, p3, sim); // Pass similarity as the colour

            // Alternative approach (probably less efficient):
            // Could iterate over all points in viewportBuffer and check whether each point falls within the triangle.
            // However, this is grossly inefficient. Instead, iterate over the points contained by the smallest 
            //  axis-aligned square that also encloses the triangles. Then check whether each point in this square
            //  is also contained by the triangle, and if so, set its respective element in viewportBuffer to 1.
        }
    }
}

function drawBuffer(viewportBuffer, canvasContext) {
    /**
     * Draws everything in buffer onto the screen
     * 
     * @param viewPortBuffer Pixel buffer to draw to/from
     * @param canvasContext Context for a canvas (e.g., canvas.getContext("2d"))
     */
    // Draw everything in the buffer
    for (let y = 0; y < viewportBuffer.length; y++) {
        for (let x = 0; x < viewportBuffer[0].length; x++) {
            if (viewportBuffer[y][x][0] > 0) {
                canvasContext.fillStyle = `hsl(60, 30%, ${Math.round(viewportBuffer[y][x][0] * 100)}%)`;

                canvasContext.fillRect(PIXEL_SIZE * x, PIXEL_SIZE * y, PIXEL_SIZE, PIXEL_SIZE);
            } 
        }
    }
}

// ================================

function renderMeshAnimation(canvas, canvasContext, meshPath, rotations) {
    /**
     * Used to render a given mesh on a canvas
     * 
     * @param canvasID ID of canvas to render to
     * @param meshPath path of mesh to render
     */
    // Create the pixel grid
    // Note that the pixel grid is defined in terms of the canvas coordinate space
    let viewportBuffer = []; // Array to render to
    for (let y = 0; y < canvas.height / PIXEL_SIZE; y++) {
        viewportBuffer[y] = [];
        for (let x = 0; x < canvas.width / PIXEL_SIZE; x++) {
            viewportBuffer[y][x] = [0, -100]; // Grayscale, -100 is depth (should be overridden)
        }
    }

    // Load mesh data
    // Should be cached automatically
    fetch(meshPath)
    .then(response => {
        return response.json();
    })
    .then(data => {
        let vertices = data.vertices;
        let tris = data.tris;

        // Apply initial transformation to mesh
        let tm = getInitialTransformations(meshPath);
        let rm = multMany([getXRotationMatrix(rotations[0]), getYRotationMatrix(rotations[1]), getZRotationMatrix(rotations[2])]);
        let t = mult(tm, rm);
        for (let i = 0; i < vertices.length; i++) {
            vertices[i] = mult(vertices[i], t);
        }

        clearBuffer(canvas, viewportBuffer, canvasContext);

        updateBuffer(canvas, viewportBuffer, vertices, tris);

        drawBuffer(viewportBuffer, canvasContext);
    })
}

function renderMesh() {
    const canvas = document.getElementById("meshCanvas");
    const canvasCtx = canvas.getContext("2d");
    const background = document.getElementById("background");

    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
    // Resize canvas sto be the right size
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    const sizeX = background.offsetWidth - 12;
    const sizeY = sizeX / 3;

    canvas.width = sizeX * dpr;
    canvas.height = sizeY * dpr;

    ctx.scale(dpr, dpr);

    canvas.style.width = `${sizeX}px`;
    canvas.style.height = `${sizeY}px`;

    // Animation for canvas
    let startTime = Date.now();
    setInterval(() => {
        renderMeshAnimation(canvas, canvasCtx, "./assets/Utah_teapot_(solid).json", [0, (Date.now() - startTime) * 0.001, 0]);
    }, 1000/30);
}

window.addEventListener("resize", (e) => {
    renderMesh();
});

renderMesh();