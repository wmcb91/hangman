
const app = {
  words: words,
  alpha: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
  'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  wordsUsed: [],
  p1Name: '',
  p2Name: '',
  activePlayer: 1,
  history: {
    p1Wins: 0,
    p2Wins: 0
  },
  game: {
    guessLimit: 10,
    word: '',
    lettersGuessed: [],
    incorrectGuesses: []
  }
}

const buildGameArea = () => {
  $('#hangman').find('span').addClass('hidden');
  $('#win-msg, #loss-msg, #play-again').addClass('hidden');
  $('#word-area, #incorrect-guesses').html('');
  $('#remaining-guesses').text(`
    ${app.game.guessLimit - app.game.incorrectGuesses.length} guesses remaining
  `);
  $('#remaining-guesses, #guess-area').removeClass('hidden');
  for (let i = 0; i < app.game.word.length; i++) {
    $('#word-area').append('<span class="letter"></span>');
  }
}

const startGame = (word) => {
  app.game.word = word;
  app.game.lettersGuessed = [];
  app.game.incorrectGuesses = [];
  buildGameArea();

  $('#pre-game-area').addClass('hidden');
  $('#game-area').removeClass('hidden');
  $('#word-choice').val('');
}

const endGame = (win) => {
  // Display win or lose
  // Add result
  // Change player
  $('#remaining-guesses, #guess-area').addClass('hidden');
  $('#play-again').removeClass('hidden');
  if (win) {
    $('#win-msg').removeClass('hidden');
  } else {
    $('#loss-msg').removeClass('hidden');
    $('.letter').each((i, l) => {
      // Fill in missed letters
      if (!$(l).text()) {
        $(l).text(app.game.word[i]).addClass('missed');
      }
    });
  }
}

const onPlayAgainClick = () => {
  $('#game-area, #pre-game-area').toggleClass('hidden');
}

const selectRandom = () => {
  let idx = Math.floor(Math.random() * app.words.length);
  let word = app.words[idx];
  $('#word-choice').val(word);
}

const onCorrectGuess = (letter) => {
  // Reveal letters
  let guessedWord = '';
  $('.letter').each((i, l) => {
    if (app.game.word[i] === letter) {
      $(l).text(letter);
    }

    if ($(l).text()) {
      guessedWord += $(l).text();
    }
  });

  if (guessedWord === app.game.word) {
    endGame(true);
  }
}

const onIncorrectGuess = (letter) => {
  app.game.incorrectGuesses.push(letter);
  let incorrectGuessCount = app.game.incorrectGuesses.length;
  let guessesRemaining = app.game.guessLimit - app.game.incorrectGuesses.length;
  let badGuessArea = $('#incorrect-guesses');

  // Reveal part of hangman
  $('#hm-' + incorrectGuessCount).removeClass('hidden');

  if (guessesRemaining === 0) {
    // If len incorrectGuesses > limit => endgame
    endGame(false);
  } else {
    if (guessesRemaining === 1) {
      $('#remaining-guesses').text('1 guess remaining');
    } else {
      $('#remaining-guesses').text(`${guessesRemaining} guesses remaining`);
    }

    if (app.game.incorrectGuesses.length === 1) {
      badGuessArea.append('<h3>Incorrect Guesses:</h3>');
      badGuessArea.append(`<span>${letter}</span>`)
    } else {
      badGuessArea.append(`<span>, ${letter}</span>`)
    }
  }
};

const onConfirmGuess = () => {
  let letter = $('#guess-letter').val().toLowerCase();
  if (!letter.length || letter.length > 1 || !app.alpha.includes(letter)) {
    return;
  }

  if (app.game.lettersGuessed.includes(letter)) {
    // If already guessed, that is not allowed
    $('#guess-letter').val('');
    alert('Already guessed this letter');
    return;
  }

  // Add letter to guessed  
  app.game.lettersGuessed.push(letter);
  // Check if letter is in word
  if (app.game.word.includes(letter)) {
    // If in word, show letter location
    onCorrectGuess(letter);
  } else {
    // If not in word, add to incorrectGuesses
    onIncorrectGuess(letter);
  }

  // Clear guess input  
  $('#guess-letter').val('');
}

const onConfirmWordClick = () => {
  let wordChoice = $('#word-choice').val().toLowerCase();
  startGame(wordChoice);
}

const onWordKeyUp = (event) => {
  if (event.keyCode === 13) {
    onConfirmWordClick();
  }
}

const onGuessLetterInput = (event) => {
  let key = event.key;
  let keycode = event.keyCode;
  if (keycode === 13) {
    onConfirmGuess();
  } else {
    if ((keycode < 65 || keycode > 90 || app.game.lettersGuessed.includes(key)) && keycode !== 8) {
      event.preventDefault();
    }
  }
}

const onPlayRandomWordClick = () => {
  debugger;
  $('#word-choice').hide();
  selectRandom();
  onConfirmWordClick();
  $('#word-choice').show();
}

$('#play-random-word').on('click', onPlayRandomWordClick);
$('#random-word').on('click', selectRandom);
$('#confirm-word').on('click', onConfirmWordClick);
$('#word-choice').on('keydown', (event) => {
  let keycode = event.keyCode;
  if ((keycode < 65 || keycode > 90) && keycode !== 8) {
    event.preventDefault();
  }
});
$('#word-choice').on('keyup', onWordKeyUp);
$('#confirm-guess').on('click', onConfirmGuess);
$('#play-again').on('click', onPlayAgainClick);
$('#guess-letter').on('keydown', onGuessLetterInput);
$('#toggle-show-words').on('click', () => {
  let btn = $('#toggle-show-words');
  let showList = $('#word-choice').attr('list') === 'false';
  if (showList) {
    $('#word-choice').attr('list', 'wordlist');
    btn.text('Hide Word List');
  } else {
    $('#word-choice').attr('list', false);
    btn.text('Show Word List');
  }
});

const arrSort = (arr) => {
  return arr.concat().sort();
}

arrSort(app.words).forEach(word => {
  $('#wordlist').append(`<option value="${word}">`);
});