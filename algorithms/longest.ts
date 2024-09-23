function longest(sentence: string): string {
  let longestWord = "";

  for (const word of sentence.split(" ")) {
    if (word.length > longestWord.length) {
      longestWord = word;
    }
  }

  return longestWord;
}
