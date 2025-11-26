const cardsArray = [
    { name: 'card1', img: 'images/card1.svg' },
    { name: 'card2', img: 'images/card2.svg' },
    { name: 'card3', img: 'images/card3.svg' },
    { name: 'card4', img: 'images/card4.svg' },
    { name: 'card5', img: 'images/card5.svg' },
    { name: 'card6', img: 'images/card6.svg' },
    { name: 'card7', img: 'images/card7.svg' },
    { name: 'card8', img: 'images/card8.svg' },
    { name: 'card9', img: 'images/card9.svg' },
    { name: 'card10', img: 'images/card10.svg' },
    { name: 'card11', img: 'images/card11.svg' },
    { name: 'card12', img: 'images/card12.svg' }
];

const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");
const scoreTag = document.querySelector(".current-score b");
const highScoreTag = document.querySelector(".best-score b");
const refreshBtn = document.querySelector(".stat-bar button");
const refreshBtnWin = document.querySelector(".win-box button");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let time = 0;
let play = false;
let timer = null;
let flips = 0;
let match = 0;

function initTimer() {
    time++;
    timeTag.innerText = time;
}

function createBoard() {
    clearInterval(timer);  
    resetBoard();
    play = false;
    time = 0;
    flips = 0;
    match = 0;
    timeTag.innerText = time;
    flipsTag.innerText = flips;
    document.querySelector('.game-board').replaceChildren();

    const gameBoard = document.querySelector('.game-board');
    const shuffledCards = [...cardsArray, ...cardsArray].sort(() => 0.5 - Math.random());

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        const cardImage = document.createElement('img');
        cardImage.src = card.img;
        cardElement.appendChild(cardImage);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if(!play) {
        play = true;
        timer = setInterval(initTimer, 1000);
    }
    if (lockBoard) return;
    if (this === firstCard) return;

    flips++;
    flipsTag.innerText = flips;
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        match++;
        if (match == cardsArray.length) {
            clearInterval(timer);
            showWinScreen();
            return;
        }
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() { 
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.add('shake');
        secondCard.classList.add('shake');
    }, 400);

    setTimeout(() => {
        firstCard.classList.remove('shake', 'flipped');
        secondCard.classList.remove('shake', 'flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function calculateScore() {
    const speed = Math.max(0, 200 - time);
    const efficiency = Math.max(0, 200 - flips);

    return speed * 2 + efficiency * 3;
}

function saveHighscore(score) {
    let best = localStorage.getItem("highscore") || 0;

    if (score > best) {
        localStorage.setItem("highscore", score);
        return score;
    }
    return best;
}

function showWinScreen() {
    const score = calculateScore();
    const highScore = saveHighscore(score);

    scoreTag.innerText = score;
    highScoreTag.innerText = highScore;
    document.querySelector(".current-score b").textContent = score;
    document.querySelector(".best-score b").textContent = highScore;

    document.querySelector(".win-screen").classList.remove("hidden");
}

refreshBtn.addEventListener("click", createBoard);
refreshBtnWin.addEventListener('click', () => {
    document.querySelector('.win-screen').classList.add('hidden');
    createBoard();
});

document.addEventListener('DOMContentLoaded', createBoard);