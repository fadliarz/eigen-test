"use strict";
function diffMatrixDiagonal(matrix) {
    if (matrix.length === 0 || (matrix.length == 1 && matrix[0].length == 0))
        return 0;
    if (matrix.length !== matrix[0].length) {
        throw new Error("input is NxN matrix!");
    }
    let firstDiagonal = 0;
    let secondDiagonal = 0;
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        firstDiagonal += matrix[i][i];
        secondDiagonal += matrix[i][n - 1 - i];
    }
    return firstDiagonal - secondDiagonal;
}
