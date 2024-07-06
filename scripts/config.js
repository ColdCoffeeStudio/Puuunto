// Define the max size of the board. A limit of 6x6 will be calculated later in script.js according to the game rules.
const ROW_LENGTH = 11;
const COLUMN_LENGTH = 11;

let decks = [];
let players = [];

function initBoard() {
    // Create the HTML board with ROW_LENGTH rows and COLUMN_LENGTH columns. Each cell is 64px x 64px.
    let boardDiv = document.getElementById("board");

    let boardTable = document.createElement("table");
    // Create rows
    for (let rowId = 0; rowId < ROW_LENGTH; rowId++){
        let tmpBoardRow = document.createElement("tr");
        // Create columns
        for (let columnId = 0; columnId < COLUMN_LENGTH; columnId++){
            let tmpBoardCell = document.createElement("td");
            tmpBoardCell.style.height = "64px";
            tmpBoardCell.style.width = "64px";
            tmpBoardCell.style.textAlign = "center";
            if(rowId === 5 && columnId === 5){
                tmpBoardCell.style.border = "2px solid red";
            }else{
                tmpBoardCell.style.border = "1px solid black";
            }
            tmpBoardRow.appendChild(tmpBoardCell);

        }
        boardTable.appendChild(tmpBoardRow);
    }
    boardDiv.appendChild(boardTable);
}

function initCards(){
    let colors = ["blue","red","yellow","green"];
    let dots = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for(let colorIndex = 0; colorIndex < colors.length; colorIndex++){
        let colorValue = colors[colorIndex];
        let deck = [];
        for (let dotsIndex = 0; dotsIndex < dots.length; dotsIndex++) {
            let dotsValue = dots[dotsIndex];
            deck.push({dots: dotsValue, color: colorValue});
            deck.push({dots: dotsValue, color: colorValue});
        }
        decks.push({cards: deck, color:colorValue});
    }
}

function shuffleDeck(deck) {
    let deckColor = deck.color;
    let deckCards = deck.cards;
    
    for (let cardIndex = deckCards.length - 1; cardIndex > 0; cardIndex--) {
        let otherCardIndex = Math.floor(Math.random() * (cardIndex + 1));
        let temp = deckCards[cardIndex];
        deckCards[cardIndex] = deckCards[otherCardIndex];
        deckCards[otherCardIndex] = temp;
    }
    
    return {cards: deckCards, color:deckColor};
}

function initPlayers() {
    let playerNames = ["Erwan", "William", "Stévan", "Tanguy"];
    let playerBirthdates = ["2002-07-18", "2003-02-18", "2002-01-29", "2002-10-10"];

    for (let playerIndex = 0; playerIndex < playerNames.length; playerIndex++) {
        let playerName = playerNames[playerIndex];
        let playerBirthdate = playerBirthdates[playerIndex];
        let playerDeck = shuffleDeck(decks.pop());

        players.push({name: playerName, birthdate: playerBirthdate, deck: playerDeck, nbWonRounds: 0, nbWonGames: 0});
    }

    console.log(players);
}

function initBoardAndCards(){
    initBoard();
    initCards();
    initPlayers();
}
