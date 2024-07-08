const BOARD = document.getElementById("board");
const PLAYER_NAME_PREVIEW = document.getElementById("player_name");
const CARD_PREVIEW = document.getElementById("card");

let currentPlayerIndex;
let currentPlayer;
let boardTracker = [];
let drawnCard = {};

/**
 * This method initialize a tracker to know the value of every cell in the board.
 * The tracker is then updated when a card is placed.
 */
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
 * Update the preview to display the drawn card and the name of the current player.
 */
function updatePreview() {
    PLAYER_NAME_PREVIEW.innerText = currentPlayer.name;
    let color = drawnCard.color;
    CARD_PREVIEW.innerText = drawnCard.dots;

    switch (color) {
        case 'blue':
            CARD_PREVIEW.style.backgroundColor = '#118ab2';
            break;
        case 'red':
            CARD_PREVIEW.style.backgroundColor = '#ef476f';
            break
        case 'yellow':
            CARD_PREVIEW.style.backgroundColor = '#ffd166';
            break;
        case 'green':
            CARD_PREVIEW.style.backgroundColor = '#06d6a0';
            break;
    }
}

/**
 * This function add an event listener to each cell of the board that calls for the method 'clickedCell'.
 */
function addListeners(){
    let rows = BOARD.getElementsByTagName("tr");

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
 * This method draw a card from the current player's deck.
 * @returns card
 */
function drawCard() {
    let card = {};
    let currentPlayerDeck = currentPlayer.deck;

    if (currentPlayerDeck.length > 0){
        card = currentPlayerDeck.pop();
    }else{
        throw new Error("Error - drawCard - The player doesn't have cards.");
    }

    return card;
}

/**
 * This function is called when a cell of the table is clicked;
 * For now, it prints the coordinates of the clicked cell.
 * @param cell The clicked cell.
 */
function clickedCell(cell){

    try {
        let cellCoordinates = cell.cellIndex + ';' + cell.parentNode.rowIndex;

        if(askToPlaceCard(cellCoordinates,drawnCard)){
            placeCard(cell, drawnCard);
            changeCurrentPlayer();
        }

    }catch (error) {
        console.log(error);
    }

}

/**
 * This method checks if the given card can be placed at the given coordinates.
 * @param cellCoordinates The coordinates of the cell.
 * @param card The card to place.
 * @returns boolean
 */
function askToPlaceCard(cellCoordinates, card) {
    try{
        let canPlace = false;
        checkCardData(card);

        let availablePlacements = getAvailablePlacements(card.dots);
        console.log(availablePlacements.includes(cellCoordinates));

        if(availablePlacements.includes(cellCoordinates)){
            canPlace = true;
        }

        return canPlace;
    }catch (error) {
        console.error(error);
    }
}

/**
 * This method gets and returns every available placement on the board for the current card.
 * @param cardDots The number of dots the card possess.
 * @returns *[]
 */
function getAvailablePlacements(cardDots) {
    let availablePlacements = [];
    let playedCoordinates = [];
    let cardEncountered = 0;

    // Get played cell where the actual card can be superposed.
    for (let rowId = 0; rowId < ROW_LENGTH; rowId++) {
        let row = boardTracker[rowId];
        for (let columnId = 0; columnId < COLUMN_LENGTH; columnId++) {
            let cell = row[columnId];
            if(cell.dots !== undefined){
                let currentCoordinates = columnId+";"+rowId;
                cardEncountered++;
                playedCoordinates.push(currentCoordinates);
                if(cardDots > cell.dots){
                    availablePlacements.push(currentCoordinates);
                }
            }
        }
    }

    // Get not-played adjacent cell;
    for (let cellIndex = 0; cellIndex < playedCoordinates.length; cellIndex++) {
        let cellCoordinates = playedCoordinates[cellIndex].split(";");
        let cellColumnId = parseInt(cellCoordinates[0]);
        let cellRowId = parseInt(cellCoordinates[1]);

        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            let adjacentRow = cellRowId + rowOffset;

            if((adjacentRow >= 0) && (adjacentRow < ROW_LENGTH)){
                for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
                    let adjacentColumn = cellColumnId + columnOffset;

                    if((adjacentColumn >= 0) && (adjacentColumn < COLUMN_LENGTH)){
                        let adjacentCoordinates = adjacentColumn + ";" + adjacentRow;
                        if(!availablePlacements.includes(adjacentCoordinates) && !playedCoordinates.includes(adjacentCoordinates)){
                            availablePlacements.push(adjacentCoordinates);
                        }
                    }
                }
            }

        }
    }

    if (cardEncountered === 0){
        availablePlacements.push("5;5");
    }

    return availablePlacements;
}

/**
 * This function allows to place the given card if the card is considered as correct.
 * @param cell The cell where the card will be placed.
 * @param card The card to place.
 */
function placeCard(cell, card){
    boardTracker[cell.parentNode.rowIndex][cell.cellIndex] = card;
    cell.innerText = card.dots;
    changeColor(cell, card.color);
}

/**
 * This method changes the background color of the given cell to match the placed card color.
 * @param cell The cell to change.
 * @param color The color of the card.
 */
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
 * This method changes the current player to the next one.
 */
function changeCurrentPlayer() {
    try{
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentPlayer = players[currentPlayerIndex];
        drawnCard = drawCard();
        updatePreview();
    }catch (error){
        console.log(error);
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
 * This method launches the game.
 */
function launchGame(){
    currentPlayerIndex = 0;

    currentPlayer = players[0];
    drawnCard = drawCard();
    console.log(currentPlayer);

    console.log(CARD_PREVIEW);
    console.log(PLAYER_NAME_PREVIEW);

    initBoardTracker();
    updatePreview();
    addListeners();
}