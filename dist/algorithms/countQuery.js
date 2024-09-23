"use strict";
function countQuery(input, query) {
    const hashMap = new Map();
    for (const inputWord of input) {
        hashMap.has(inputWord)
            ? hashMap.set(inputWord, hashMap.get(inputWord) + 1)
            : hashMap.set(inputWord, 1);
    }
    let count = [];
    for (let i = 0; i < query.length; i++) {
        count[i] = hashMap.get(query[i]) || 0;
    }
    return count;
}
