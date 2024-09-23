"use strict";
function reverse(input) {
    var _a, _b;
    const letters = ((_a = input.match(/[a-zA-Z]/g)) === null || _a === void 0 ? void 0 : _a.join("")) || "";
    const numbers = ((_b = input.match(/[0-9]/g)) === null || _b === void 0 ? void 0 : _b.join("")) || "";
    return letters.split("").reverse().join("").concat(numbers);
}
