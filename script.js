//Matice obrázků karet
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

//Vyhlašování prvků  pro rychlý přístup
const timeTag = document.querySelector(".time b");                                              //Prvek pro zobrazení času
const flipsTag = document.querySelector(".flips b");                                            //Prvek pro zobrazení převrácení
const scoreTag = document.querySelector(".current-score b");                                    //Prvek pro zobrazení bodů za hru
const highScoreTag = document.querySelector(".best-score b");                                   //Prvek pro zobrazení maximálního počtu bodů
const refreshBtn = document.querySelector(".new-game-btn");                                     //Prvek tlačítka pro zahájení nové hry
const helpBtn = document.querySelector(".help-btn");                                            //Prvek tlačítka nápovědy ke hře
const refreshBtnWin = document.querySelector(".win-box button");                                //Prvek tlačítka pro zahájení nové hry z okna vítězství

//Vyhlašování proměnných
let firstCard = null;                                                                           //Proměnná první otočené karty
let secondCard = null;                                                                          //Proměnná druhé otočené karty
let lockBoard = false;                                                                          //Proměnná blokování otočení karet
let time = 0;                                                                                   //Proměnná času
let play = false;                                                                               //Proměnná stavu hry
let timer = null;                                                                               //Proměnná časovače
let flips = 0;                                                                                  //Proměnná počtu otočení
let match = 0;                                                                                  //Proměnná počtu shodných karet
let difficulty = "medium";                                                                      //Proměnná obtížnosti, výchozí nastavení je střední
let pairsCount = 8;                                                                             //Proměnná počtu párů ve hře, výchozí nastavení je 8

//Funkce časovače hry
function initTimer() {
    time++;                                                                                     //Zvýšení časovače o sekundu
    timeTag.innerText = time;                                                                   //Zobrazení času na obrazovce
}

//Funkce vytvoření hracího pole
function createBoard() {
    clearInterval(timer);                                                                       //Zastavení časovače
    resetBoard();                                                                               //Návrat do původního stavu před výběrem karet
    play = false;                                                                               //Hra se nespustí
    time = 0;                                                                                   //Čas na 0 sekund
    flips = 0;                                                                                  //Převrácení na 0
    match = 0;                                                                                  //Shody na 0
    timeTag.innerText = time;                                                                   //Zobrazit čas
    flipsTag.innerText = flips;                                                                 //Zobrazit počet převrácení

    document.querySelector('.game-board').replaceChildren();                                    //Odstranit staré karty, které zbyly z předchozí hry

    const gameBoard = document.querySelector('.game-board');                                    //Vybrat prvek "game-board"
    const shuffledArrayCards = cardsArray.sort(() => 0.5 - Math.random());                      //Promíchání matici obrázků
    const slicedCards = shuffledArrayCards.slice(0, pairsCount);                                //Počet párů se vybírá na základě složitosti hry z maticí obrázků
    const shuffledCards = [...slicedCards, ...slicedCards].sort(() => 0.5 - Math.random());     //Vytvoří se matice karet v párech a náhodně se seřadí

    shuffledCards.forEach(card => {                                                             //Pro každou vytvořenou kartu provést kód
        const cardElement = document.createElement('div');                                      //Vytvořit prvek "div"
        cardElement.classList.add('card');                                                      //Přidat mu třídu "card"
        cardElement.dataset.name = card.name;                                                   //Přidat mu jméno podle názvu obrázku

        const cardImage = document.createElement('img');                                        //Vytvořit prvek "img"
        cardImage.src = card.img;                                                               //Přidat mu zdroj obrázku z matice obrázků
        cardElement.appendChild(cardImage);                                                     //Vytvořit podřízený prvek "img"

        cardElement.addEventListener('click', flipCard);                                        //Přidat podmínku kliknutí pro prvek karty a její provedení
        gameBoard.appendChild(cardElement);                                                     //Vytvořit podřízený prvek "div"
    });
}

//Funkce převrácení karty
function flipCard() {
    if(!play) {                                                                                 //Zkontrolujte, zda hra není spuštěna
        play = true;                                                                            //Pokud není spuštěno, nastavit status jako spuštěno.
        timer = setInterval(initTimer, 1000);                                                   //Spustit časovač s intervalem 1 sekunda
    }
    if (lockBoard) return;                                                                      //Pokud je herní pole blokováno, vrátí se výsledek a funkce se ukončí
    if (this === firstCard) return;                                                             //Přísné porovnání opakovaného stisknutí první vybrané karty, pokud byla stisknuta znovu, funkce se ukončí

    flips++;                                                                                    //Zvýšení převratu o 1
    flipsTag.innerText = flips;                                                                 //Závěr o novém významu převratů
    this.classList.add('flipped');                                                              //Přidání třídy "flipped"

    if (!firstCard) {                                                                           //Pokud je proměnná první karty prázdná
        firstCard = this;                                                                       //Zapsat danou kartu do proměnné první karty
        return;                                                                                 //Vrátit výsledek funkce, čímž se z ní ukončí
    }

    secondCard = this;                                                                          //Zapsat danou kartu do proměnné druhé karty
    checkForMatch();                                                                            //Vyvolat funkci kontroly shody
}

//Funkce kontroly shody karet
function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {                                   //Porovnání názvu první karty a druhé karty
        disableCards();                                                                         //Vyvolání funkce deaktivace karet při shodě
        match++;                                                                                //Přidání 1 ke shodám
        if (match == pairsCount) {                                                              //Porovnání počtu shod s počtem párů
            clearInterval(timer);                                                               //Zastavit časovač
            showWinScreen();                                                                    //Volání funkce zobrazení vítězného okna
            return;                                                                             //Ukončení funkce
        }
    } else {                                                                                    //Jinak
        unflipCards();                                                                          //Vyvolání funkce převrácení karet zpět v případě neshody
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
    lockBoard = true;                                                                           //Zablokovat karty na dobu převratu

    setTimeout(() => {                                                                          //Nastavit časovač pro přidání atributu "shake"
        firstCard.classList.add('shake');                                                       //Přiřazení třídy „shake“ první kartě
        secondCard.classList.add('shake');                                                      //Přiřazení třídy „shake“ druhé kartě
    }, 400);                                                                                    //Časovač na 400 milisekund

    setTimeout(() => {                                                                          //Nastavit časovač pro odstranění atributů
        firstCard.classList.remove('shake', 'flipped');                                         //Odstranit třídy „shake“ a „flipped“ u první karty
        secondCard.classList.remove('shake', 'flipped');                                        //Odstranit třídy „shake“ a „flipped“ u druhé karty
        resetBoard();                                                                           //Návrat do původního stavu před výběrem karet
    }, 1000);                                                                                   //Časovač na 1 sekundu
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
    let best;                                                                                   //Deklarace proměnné s nejlepším skóre
    switch (difficulty) {                                                                       //Porovnání podle složitosti
        case "easy":                                                                            //Pokud je lehká složitost
            best = localStorage.getItem("highscoreEasy") || 0;                                  //Získat minulou hodnotu nejvyššího skóre pro danou složitost nebo 0 v případě neexistence
            break;                                                                              //Ukončit srovnání
        case "medium":                                                                          //Pokud je střední složitost
            best = localStorage.getItem("highscoreMedium") || 0;                                //Získat minulou hodnotu nejvyššího skóre pro danou složitost nebo 0 v případě neexistence
            break;                                                                              //Ukončit srovnání
        case "hard":                                                                            //Pokud je těžká obtížnost
            best = localStorage.getItem("highscoreHard") || 0;                                  //Získat minulou hodnotu nejvyššího skóre pro danou složitost nebo 0 v případě neexistence
            break;                                                                              //Ukončit srovnání
    }

    if (score > best) {                                                                         //Srovnání skóre za hru s nejvyšším skóre
        switch (difficulty) {                                                                   //Porovnání podle složitosti
            case "easy":                                                                        //Pokud je lehká složitost
                localStorage.setItem("highscoreEasy", score);                                   //Zaznamenat počet skóre za hru jako nejvyšší skóre v dané složitosti
                break;                                                                          //Ukončit srovnání
            case "medium":                                                                      //Pokud je střední obtížnost
                localStorage.setItem("highscoreMedium", score);                                 //Zaznamenat počet skóre za hru jako nejvyšší skóre v dané složitosti
                break;                                                                          //Ukončit srovnání
            case "hard":                                                                        //Pokud je těžká obtížnost
                localStorage.setItem("highscoreHard", score);                                   //Zaznamenat počet skóre za hru jako nejvyšší skóre v dané složitosti
                break;                                                                          //Ukončit srovnání
        }  
        return score;                                                                           //Vrátit hodnotu skóre za hru
    }
    return best;                                                                                //Vrátit maximální počet skóre
}

//Funkce zobrazení okna při výhře
function showWinScreen() {
    const score = calculateScore();                                                             //Sčítání bodů
    const highScore = saveHighscore(score);                                                     //Získání maximálního počtu bodů

    scoreTag.innerText = score;                                                                 //Zobrazení počtu bodů na obrazovce
    highScoreTag.innerText = highScore;                                                         //Zobrazení maximálního počtu bodů na obrazovce

    document.querySelector(".win-screen").classList.remove("hidden");                           //Odstranit třídu "hidden" a zobrazí se okno vítězství
}

refreshBtn.addEventListener("click", createBoard);                                              //Sledování stisknutí tlačítka nové hry

refreshBtnWin.addEventListener('click', () => {                                                 //Sledování stisknutí tlačítka nové hry v okně při výhře a kód provedení po stisknutí
    document.querySelector('.win-screen').classList.add('hidden');                              //Skrýt vítězné okno
    createBoard();                                                                              //Vytvořit hrací pole
});

document.querySelectorAll(".difficulty-bar button").forEach(btn => {                            //Výběr obtížnosti hry, udělat pro každé tlačítko
    btn.addEventListener("click", () => {                                                       //Sledování stisknutí tlačítka obtížnosti hry a kód provedení po stisknutí
        document.querySelectorAll(".difficulty-bar button")                                     //Odstranění třídy "active" u všech tlačítek složitosti
            .forEach(b => b.classList.remove("active"));                                        

        btn.classList.add("active");                                                            //Přidání třídy "active" k stisknutému tlačítku složitosti
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

helpBtn.addEventListener("click", () => {                                                       //Sledování stisknutí tlačítka nápovědy
    alert("Memo je hra na paměť. V této hře je třeba najít páry karet. " + 
        "Čím rychleji a čím méně karet převrátíte, tím lepší bude váš výsledek.");              //Zobrazení nápovědy ke hře v okně oznámení
});

document.addEventListener('DOMContentLoaded', createBoard);                                     //Po načtení celého dokumentu se spustí vytváření hracího pole