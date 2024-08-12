// Define the max size of the board. A limit of 6x6 will be calculated later in script.js according to the game rules.
const ROW_LENGTH = 11;
const COLUMN_LENGTH = 11;
const COLORS = ["blue","red","yellow","green"];
const DOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let decks = [];
let players = [];
let streakLengthGoal = 0;

/**
 * This method initializes a ROW_LENGTH by COLUMN_LENGTH board.
 * Listeners are handled in script.js.
 */
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


/**
 * This function initialize the decks with 18 cards for each color.
 * Decks are separated depending on their colours to be distributed later.
 */
function initCards(){

    for(let colorIndex = 0; colorIndex < COLORS.length; colorIndex++){
        let colorValue = COLORS[colorIndex];
        let deck = [];
        for (let dotsIndex = 0; dotsIndex < DOTS.length; dotsIndex++) {
            let dotsValue = DOTS[dotsIndex];
            deck.push({dots: dotsValue, color: colorValue});
            deck.push({dots: dotsValue, color: colorValue});
        }
        decks.push(deck);
    }
}

/**
 * This method shuffle the given deck using the Durstenfeld shuffle algorithm.
 * @param deck The deck to shuffle.
 * @returns deckCards
 */
function shuffleDeck(deck) {
    let deckCards = deck;

    // Shuffle the deck using Durstenfeld shuffle algorithm.
    for (let cardIndex = deckCards.length - 1; cardIndex > 0; cardIndex--) {
        let otherCardIndex = Math.floor(Math.random() * (cardIndex + 1));
        let temp = deckCards[cardIndex];
        deckCards[cardIndex] = deckCards[otherCardIndex];
        deckCards[otherCardIndex] = temp;
    }
    
    return deckCards;
}

/**
 * This method initializes the players. Each player is defined by a name, a birthdate and a set of cards.
 * Cards are shuffled before they are given to the player.
 * For 4 players, each player gets a deck of a colour.
 */
function initPlayers() {
    // Place-holders for now.
    let playerNames = ["Erwan", "William", "Stévan", "Tanguy"];
    let playerBirthdates = ["2002-07-18", "2003-02-18", "2002-01-29", "2002-10-10"];

    // Distribution for 4 players.
    for (let playerIndex = 0; playerIndex < playerNames.length; playerIndex++) {
        let playerName = playerNames[playerIndex];
        let playerBirthdate = playerBirthdates[playerIndex];
        let playerDeck = shuffleDeck(decks.pop());

        players.push({name: playerName, birthdate: playerBirthdate, deck: playerDeck, nbWonRounds: 0, nbWonGames: 0});
    }

    // Set the goal if there are only two players.
    if(players.length === 2){
        streakLengthGoal = 5;
    }else{
        streakLengthGoal = 4;
    }

}

/**
 * This method initializes the board, cards and players.
 * Each player gets their cards in this section, so the game can start in another script.
 */
function initGame(){
    initBoard();
    initCards();
    initPlayers();
}
