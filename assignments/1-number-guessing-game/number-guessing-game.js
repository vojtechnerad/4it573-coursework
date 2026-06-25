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

const guesses = [];
const numberToGuess = getNumberToGuess();

while (guesses.length + 1 <= maxNumberOfGuesses) {
  const guess = prompt(
    `Guess a number between ${minNumber} and ${maxNumber}
    \nAttempt ${guesses.length + 1} of ${maxNumberOfGuesses}
    \nPrevious guesses: ${guesses.join(', ')}`,
  );

  if (guess === null) {
    console.log('Game cancelled.');
    break;
  }

  const guessAsNumber = Number(guess);

  if (isNaN(guessAsNumber)) {
    alert('Invalid input. Please enter a number.');
    continue;
  }

  guesses.push(guessAsNumber);

  const isLastGuess = guesses.length === maxNumberOfGuesses;
  const isGuessCorrect = guessAsNumber === numberToGuess;

  if (isLastGuess && !isGuessCorrect) {
    alert(
      `Game over! You've used all ${maxNumberOfGuesses} guesses. The correct number was ${numberToGuess}.`,
    );
    break;
  } else if (isGuessCorrect) {
    alert(
      `Congratulations! You guessed the number ${numberToGuess} in ${guesses.length} guesses.`,
    );
    break;
  } else if (guessAsNumber < numberToGuess) {
    alert('Too low! Try again.');
  } else {
    alert('Too high! Try again.');
  }
}
