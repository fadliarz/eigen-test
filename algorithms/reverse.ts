function reverse(input: string): string {
  const letters = input.match(/[a-zA-Z]/g)?.join("") || "";
  const numbers = input.match(/[0-9]/g)?.join("") || "";

  return letters.split("").reverse().join("").concat(numbers);
}
