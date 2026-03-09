// Game settings
const maxNumberOfGuesses = 5;
const minNumber = 0;
const maxNumber = 10;

// Implementation taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getNumberToGuess() {
  const minCeiled = Math.ceil(minNumber); // Minimum is inclusive
  const maxFloored = Math.floor(maxNumber + 1); // Maximum is exclusive
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

let currentGuess = 1;
while (currentGuess <= maxNumberOfGuesses) {
  const answer = prompt(`Guess a number between ${minNumber} and ${maxNumber}`);

  currentGuess++;
}
