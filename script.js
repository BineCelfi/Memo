const cardsArray = [                                                                            //Řada obrázků karet
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

//Vyhlašování prvků  pro rychlý přístup
const timeTag = document.querySelector(".time b");                                              //
const flipsTag = document.querySelector(".flips b");                                            //
const scoreTag = document.querySelector(".current-score b");                                    //
const highScoreTag = document.querySelector(".best-score b");                                   //
const refreshBtn = document.querySelector(".stat-bar button");                                  //
const refreshBtnWin = document.querySelector(".win-box button");                                //

//Vyhlašování proměnných
let firstCard = null;                                                                           //
let secondCard = null;                                                                          //
let lockBoard = false;                                                                          //
let time = 0;                                                                                   //
let play = false;                                                                               //
let timer = null;                                                                               //
let flips = 0;                                                                                  //
let match = 0;                                                                                  //
let difficulty = "medium";                                                                      //
let pairsCount = 8;                                                                             //

//Funkce časovače hry
function initTimer() {
    time++;                                                                                     //Zvýšení časovače o sekundu
    timeTag.innerText = time;                                                                   //Zobrazení času na obrazovce
}

//Funkce vytvoření hracího pole
function createBoard() {
    clearInterval(timer);                                                                       //
    resetBoard();                                                                               //
    play = false;                                                                               //
    time = 0;                                                                                   //
    flips = 0;                                                                                  //
    match = 0;                                                                                  //
    timeTag.innerText = time;                                                                   //
    flipsTag.innerText = flips;                                                                 //

    document.querySelector('.game-board').replaceChildren();                                    //

    const gameBoard = document.querySelector('.game-board');                                    //
    const shuffledArrayCards = cardsArray.sort(() => 0.5 - Math.random());                      //
    const slicedCards = shuffledArrayCards.slice(0, pairsCount);                                //
    const shuffledCards = [...slicedCards, ...slicedCards].sort(() => 0.5 - Math.random());     //

    shuffledCards.forEach(card => {                                                             //
        const cardElement = document.createElement('div');                                      //
        cardElement.classList.add('card');                                                      //
        cardElement.dataset.name = card.name;                                                   //

        const cardImage = document.createElement('img');                                        //
        cardImage.src = card.img;                                                               //
        cardElement.appendChild(cardImage);                                                     //

        cardElement.addEventListener('click', flipCard);                                        //
        gameBoard.appendChild(cardElement);                                                     //
    });
}

//Funkce převrácení karty
function flipCard() {
    if(!play) {                                                                                 //
        play = true;                                                                            //
        timer = setInterval(initTimer, 1000);                                                   //
    }
    if (lockBoard) return;                                                                      //
    if (this === firstCard) return;                                                             //

    flips++;                                                                                    //
    flipsTag.innerText = flips;                                                                 //
    this.classList.add('flipped');                                                              //

    if (!firstCard) {                                                                           //
        firstCard = this;                                                                       //
        return;                                                                                 //
    }

    secondCard = this;                                                                          //
    checkForMatch();                                                                            //
}

//Funkce kontroly shody karet
function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {                                   //
        match++;                                                                                //
        if (match == pairsCount) {                                                              //
            clearInterval(timer);                                                               //
            showWinScreen();                                                                    //
            return;                                                                             //
        }
        disableCards();                                                                         //
    } else {                                                                                    //
        unflipCards();                                                                          //
    }
}

//Funkce deaktivace karet při shodě
function disableCards() {
    firstCard.removeEventListener('click', flipCard);                                           //Odstranit atribut click u první kliknuté karty
    secondCard.removeEventListener('click', flipCard);                                          //Odstranit atribut click u druhé kliknuté karty
    resetBoard();                                                                               //Návrat do původního stavu před výběrem karet
}

//Funkce převrácení karet zpět při neshodě
function unflipCards() { 
    lockBoard = true;                                                                           //

    setTimeout(() => {                                                                          //
        firstCard.classList.add('shake');                                                       //
        secondCard.classList.add('shake');                                                      //
    }, 400);                                                                                    //

    setTimeout(() => {                                                                          //
        firstCard.classList.remove('shake', 'flipped');                                         //
        secondCard.classList.remove('shake', 'flipped');                                        //
        resetBoard();                                                                           //
    }, 1000);                                                                                   //
}

//Funkce návratu do původního stavu před výběrem karet
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];                                   //Proměnné jsou nastaveny do počátečního stavu
}

//Funkce počítání bodů
function calculateScore() {
    const speed = Math.max(0, 200 - time);                                                      //Počítání bodů za rychlost
    const efficiency = Math.max(0, 200 - flips);                                                //Počítání bodů za efektivitu

    return speed * 2 + efficiency * 3;                                                          //Vrácení bodů podle vzorce
}

//Funkce ukládání nejvyšších bodů
function saveHighscore(score) {
    let best;                                                                                   //
    switch (difficulty) {                                                                       //
        case "easy":                                                                            //
            best = localStorage.getItem("highscoreEasy") || 0;                                  //
            break;                                                                              //
        case "medium":                                                                          //
            best = localStorage.getItem("highscoreMedium") || 0;                                //
            break;                                                                              //
        case "hard":                                                                            //
            best = localStorage.getItem("highscoreHard") || 0;                                  //
            break;                                                                              //
    }

    if (score > best) {                                                                         //
        switch (difficulty) {                                                                   //
            case "easy":                                                                        //
                localStorage.setItem("highscoreEasy", score);                                   //
                break;                                                                          //
            case "medium":                                                                      //
                localStorage.setItem("highscoreMedium", score);                                 //
                break;                                                                          //
            case "hard":                                                                        //
                localStorage.setItem("highscoreHard", score);                                   //
                break;                                                                          //
        }  
        return score;                                                                           //
    }
    return best;                                                                                //
}

//Funkce zobrazení okna při výhře
function showWinScreen() {
    const score = calculateScore();                                                             //Sčítání bodů
    const highScore = saveHighscore(score);                                                     //Získání maximálního počtu bodů

    scoreTag.innerText = score;                                                                 //Zobrazení počtu bodů na obrazovce
    highScoreTag.innerText = highScore;                                                         //Zobrazení maximálního počtu bodů na obrazovce

    document.querySelector(".win-screen").classList.remove("hidden");                           //Odstranit atribut hidden a zobrazí se okno vítězství
}

refreshBtn.addEventListener("click", createBoard);                                              //Sledování stisknutí tlačítka nové hry

refreshBtnWin.addEventListener('click', () => {                                                 //Sledování stisknutí tlačítka nové hry v okně při výhře a kód provedení po stisknutí
    document.querySelector('.win-screen').classList.add('hidden');                              //Skrýt vítězné okno
    createBoard();                                                                              //Vytvořit hrací pole
});

document.querySelectorAll(".difficulty-bar button").forEach(btn => {                            //Výběr obtížnosti hry
    btn.addEventListener("click", () => {                                                       //Sledování stisknutí tlačítka obtížnosti hry a kód provedení po stisknutí
        document.querySelectorAll(".difficulty-bar button")                                     //Odstranění atributu active u všech tlačítek složitosti
            .forEach(b => b.classList.remove("active"));                                        

        btn.classList.add("active");                                                            //Přidání atributu active k stisknutému tlačítku složitosti
        difficulty = btn.dataset.level;                                                         //Zápis úrovně obtížnosti do globální proměnné

        switch (difficulty) {                                                                   //Porovnání úrovně obtížnosti
            case "easy":                                                                        //Pokud je lehká
                pairsCount = 4;                                                                 //4 páry karet ve hře
                break;                                                                          //Opustit porovnání
            case "medium":                                                                      //Pokud je střední
                pairsCount = 8;                                                                 //8 párů karet ve hře
                break;                                                                          //Opustit porovnání
            case "hard":                                                                        //Pokud je těžká
                pairsCount = 12;                                                                //12 párů karet ve hře
                break;                                                                          //Opustit porovnání
        }

        createBoard();                                                                          //Vytvořit hrací pole
    });
});

document.addEventListener('DOMContentLoaded', createBoard);                                     //Po načtení celého dokumentu se spustí vytváření hracího pole