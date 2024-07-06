let board = document.getElementById("board");
let currentPlayerIndex = 0;
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
        let drawnCard = currentPlayerCards[currentPlayerCards.length-1];
        let cellCoordinates = cell.cellIndex + ';' + cell.parentNode.rowIndex;
        if(askToPlaceCard(cellCoordinates,drawnCard)){
            console.log("Card can be placed");
            currentPlayerCards.pop();
            placeCard(cell,drawnCard);
            changeCurrentPlayer();
        }
    }else{
        console.log("No card left...");
    }
}

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

function changeCurrentPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentPlayer = players[currentPlayerIndex];
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
    currentPlayer = players[currentPlayerIndex];
    console.log(currentPlayer);
    initBoardTracker();
    addListeners();
}