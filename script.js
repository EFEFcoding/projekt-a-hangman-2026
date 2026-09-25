"use strict";

const words = [
  { word: "VARIABEL", hint: "Et navn, der gemmer en værdi i et program." },
  { word: "FUNKTION", hint: "En blok kode, som kan bruges flere gange." },
  { word: "OBJEKT", hint: "En værdi med navngivne egenskaber." },
  { word: "ARRAY", hint: "En liste af værdier." },
  { word: "LØKKE", hint: "Kode, der gentages." },
  { word: "METODE", hint: "En funktion, der hører til et objekt." },
  { word: "EVENT", hint: "Noget der sker, for eksempel et klik." },
  { word: "BROWSER", hint: "Programmet, der viser en hjemmeside." },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ";
const maxMistakes = 6;
const buttons = [];
let currentWord;
let guessedLetters;
let wrongLetters;
let gameOver;
let previousWordIndex = -1;

const wordDisplay = document.querySelector("#word");
const message = document.querySelector("#message");
const keyboard = document.querySelector("#keyboard");
const figureParts = document.querySelectorAll(".figure-part");

// Lav en knap for hvert bogstav.
for (let i = 0; i < alphabet.length; i++) {
  const letter = alphabet[i];
  const button = document.createElement("button");
  button.type = "button";
  button.className = "key";
  button.textContent = letter;
  button.addEventListener("click", function () {
    guess(letter);
  });
  keyboard.appendChild(button);
  buttons.push(button);
}

function showGame() {
  wordDisplay.textContent = "";

  for (let i = 0; i < currentWord.word.length; i++) {
    const letter = currentWord.word[i];
    const slot = document.createElement("span");
    slot.className = "letter-slot";
    slot.textContent = guessedLetters.includes(letter) || (gameOver && wrongLetters.length === maxMistakes)
      ? letter
      : "\u00a0";
    wordDisplay.appendChild(slot);
  }

  for (let i = 0; i < buttons.length; i++) {
    const letter = alphabet[i];
    buttons[i].disabled = gameOver || guessedLetters.includes(letter);
    buttons[i].classList.toggle("is-correct", guessedLetters.includes(letter) && currentWord.word.includes(letter));
    buttons[i].classList.toggle("is-wrong", wrongLetters.includes(letter));
  }

  document.querySelector("#mistakes").textContent = wrongLetters.length;
  document.querySelector("#tries-label").textContent = (maxMistakes - wrongLetters.length) + " forsøg tilbage";
  document.querySelector("#wrong-letters").textContent = wrongLetters.length ? wrongLetters.join(" · ") : "Ingen endnu";
  document.querySelector("#progress-bar").style.width = (wrongLetters.length / maxMistakes * 100) + "%";

  for (let i = 0; i < figureParts.length; i++) {
    figureParts[i].classList.toggle("is-visible", i < wrongLetters.length);
  }
}

function guess(letter) {
  if (gameOver || guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);

  if (currentWord.word.includes(letter)) {
    // Tjek om alle bogstaver i ordet er gættet.
    let allFound = true;
    for (let i = 0; i < currentWord.word.length; i++) {
      if (!guessedLetters.includes(currentWord.word[i])) allFound = false;
    }

    if (allFound) {
      gameOver = true;
      message.textContent = "Flot! Du gættede " + currentWord.word + ". Tryk på Nyt ord for at spille igen.";
      message.dataset.state = "win";
    } else {
      message.textContent = letter + " er med i ordet.";
    }
  } else {
    wrongLetters.push(letter);
    if (wrongLetters.length === maxMistakes) {
      gameOver = true;
      message.textContent = "Spillet er slut. Ordet var " + currentWord.word + ". Prøv et nyt ord!";
      message.dataset.state = "lose";
    } else {
      message.textContent = letter + " er ikke med i ordet.";
    }
  }

  showGame();
}

function startNewGame() {
  let index = Math.floor(Math.random() * words.length);
  if (index === previousWordIndex) index = (index + 1) % words.length;
  previousWordIndex = index;

  currentWord = words[index];
  guessedLetters = [];
  wrongLetters = [];
  gameOver = false;

  document.querySelector("#hint").textContent = currentWord.hint;
  document.querySelector("#word-length").textContent = currentWord.word.length + " bogstaver";
  wordDisplay.setAttribute("aria-label", "Ordet har " + currentWord.word.length + " bogstaver");
  message.textContent = "Vælg et bogstav for at begynde.";
  message.dataset.state = "playing";
  showGame();
}

document.querySelector("#new-game").addEventListener("click", startNewGame);
startNewGame();
