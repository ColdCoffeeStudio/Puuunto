let board = document.getElementById("board");
let currentPlayer;
let boardTracker = [];

function initBoardTracker() {
    for (let rowId = 0; rowId < ROW_LENGTH; rowId++) {
        let row = []
        for (let columnId = 0; columnId < COLUMN_LENGTH; columnId++) {
            row.push({});
        }
        boardTracker.push(row);
    }
}

/**
 * This function add an event listener to each cell of the board that calls for the method 'clickedCell'.
 */
function addListeners(){
    let rows = board.getElementsByTagName("tr");
    for (let rowId = 0; rowId < ROW_LENGTH; rowId++){
        let row = rows[rowId];
        let columns = row.getElementsByTagName("td");
        for (let columnId = 0; columnId < COLUMN_LENGTH; columnId++){
            let column = columns[columnId];
            column.addEventListener("click", function () {
                clickedCell(this);
            })
        }
    }
}

/**
 * This function is called when a cell of the table is clicked;
 * For now, it prints the coordinates of the clicked cell.
 * @param cell The clicked cell.
 */
function clickedCell(cell){
    let currentPlayerDeck = currentPlayer.deck;
    let currentPlayerCards = currentPlayerDeck.cards;

    if(currentPlayerCards.length > 0){
        let drawnCard = currentPlayerCards.pop()
        let cellCoordinates = cell.cellIndex + ';' + cell.parentNode.rowIndex;
        if(askToPlaceCard(cellCoordinates,drawnCard)){
            placeCard(cell,drawnCard);
        }
    }else{
        console.log("No card left...");
    }
}

function askToPlaceCard(cellCoordinates, card) {
    try{
        let coordinatesString = cell.cellIndex + cell.pare
        let canPlace = false;
        //let availablePlacements = getAvailablePlacements();
        let availablePlacements = [];

        checkCardData(card);
        if(cellCoordinates in availablePlacements){
            canPlace = true;
        }

        return canPlace;
    }catch (error) {
        console.error(error);
    }
}

/**
 * This function allows to place the given card if the card is considered as correct.
 * @param cell The cell where the card will be placed.
 * @param card The card to place.
 */
function placeCard(cell, card){
    cell.innerText = card.dots;
    changeColor(cell, card.color);
}

function changeColor(cell, color) {
    switch (color) {
        case 'blue':
            cell.style.backgroundColor = '#118ab2';
            break;
        case 'red':
            cell.style.backgroundColor = '#ef476f';
            break
        case 'yellow':
            cell.style.backgroundColor = '#ffd166';
            break;
        case 'green':
            cell.style.backgroundColor = '#06d6a0';
            break;
    }
}

/**
 * This method checks if the card is correct.
 * It throws an error if it isn't.
 * @param card The card to check.
 */
function checkCardData(card){
    if(card !== undefined){
        if(card.dots !== undefined && (card.dots >= 1 && card.dots <= 9)){
            if(card.color in ['blue','red','yellow','green']){
               console.log('checkCardData - The given card is valid.');
            }
        }else{
            throw new Error("Error - checkCardData - The card dots can't be undefined and must be between 1 and 9.");
        }
    }else{
        throw new Error("Error - checkCardData - The card can't be undefined.");
    }
}

/**
 * This method launchs the game.
 */
function launchGame(){
    currentPlayer = players[0];
    console.log(currentPlayer);
    initBoardTracker();
    addListeners();
}