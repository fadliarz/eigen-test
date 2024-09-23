function countQuery(input: string[], query: string[]): number[] {
  const hashMap = new Map<string, number>();

  for (const inputWord of input) {
    hashMap.has(inputWord)
      ? hashMap.set(inputWord, hashMap.get(inputWord)! + 1)
      : hashMap.set(inputWord, 1);
  }

  let count: number[] = [];

  for (let i = 0; i < query.length; i++) {
    count[i] = hashMap.get(query[i]) || 0;
  }

  return count;
}
