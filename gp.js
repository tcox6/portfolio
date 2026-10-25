// `lo` is the namespace for Loshu.js

function rbf(X,Y,lengthscale) {
    /*
    Only works for 1D data (i.e., X and Y should be vectors of scalars).
    Expects X and Y to be 1xn vectors.
    */
    let n = X.length;
    let m = Y.length;

    // Broadcast X into nxm matrix, where m is Y.shape[0]
    // Conceptually, add a new axis at dimension 1.
    for (let i = 0; i < n; i++) {
        let v = X[i];
        X[i] = [];
        for (let j = 0; j < m; j++) {
            X[i][j] = v;
        }
    }
    // Broadcast Y into nxm matrix, where m is X.shape[0]
    // Conceptually, add a new axis at dimension 0.
    let Ynew = [];
    for (let i = 0; i < n; i++) {
        Ynew[i] = [];
        for (let j = 0; j < m; j++) {
            Ynew[i][j] = Y[j];
        }
    }
    Y = Ynew;

    return lo.exp(
        lo.scale(
            lo.scale(
                lo.pow(lo.sub(X,Y), 2),
                1 / (2*Math.pow(lengthscale,2))
            ),
            -1.0
        )
    );
}

class GP {
    constructor(lengthscale, priorMean) {
        this.lengthscale = lengthscale;
        this.priorMean = priorMean;
    }

    condition(x, y) {
        this.x = x;
        this.y = y;
    }

    predict(Xq) {
        //TODO
    }
}

console.log(rbf([1,2,3], [1,2,3], 1));