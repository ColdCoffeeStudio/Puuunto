const BOARD = document.getElementById("board");
const PLAYER_NAME_PREVIEW = document.getElementById("player_name");
const CARD_PREVIEW = document.getElementById("card");
const ROW_SIZE_LIMIT = 6;
const COLUMN_SIZE_LIMIT = 6;

let inGame = false;
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
        if(inGame){
            let cellCoordinates = cell.cellIndex + ';' + cell.parentNode.rowIndex;

            if(askToPlaceCard(cellCoordinates,drawnCard)){
                placeCard(cell, drawnCard);
                if(checkVictory(drawnCard.color)){
                    inGame = false;
                    alert("The player with the " + drawnCard.color + " has won.");
                }else{
                    changeCurrentPlayer();
                }
            }
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

        if (availablePlacements.length > 0){
            if(availablePlacements.includes(cellCoordinates)){
                canPlace = true;
            }
        }else{
            console.log("askToPlaceCard - Error - The card can't be placed on the board");
        }

        return canPlace;
    }catch (error) {
        console.error(error);
    }
}

/**
 * This method calculates the limits of the board according to players' moves.
 * It returns the limit and the available placements will be based on these value.
 * @returns {(number|number)[]}
 */
function getBoardLimits() {

    let minRowIndex = ROW_LENGTH;
    let maxRowIndex = 0;
    let minColumnIndex = COLUMN_LENGTH;
    let maxColumnIndex = 0;

    for (let rowIndex = 0; rowIndex < ROW_LENGTH; rowIndex++) {
        for (let columnIndex = 0; columnIndex < COLUMN_LENGTH; columnIndex++) {
            let cellValue = boardTracker[rowIndex][columnIndex];

            if(!(cellValue.dots === undefined) && !(cellValue.color === undefined)){
                if (rowIndex < minRowIndex){
                    minRowIndex = rowIndex;
                }
                if (rowIndex > maxRowIndex){
                    maxRowIndex = rowIndex;
                }

                if (columnIndex < minColumnIndex){
                    minColumnIndex = columnIndex;
                }

                if (columnIndex > maxColumnIndex){
                    maxColumnIndex = columnIndex;
                }
            }
        }
    }

    if ((maxRowIndex - minRowIndex +1) < ROW_SIZE_LIMIT){
        minRowIndex = 0;
        maxRowIndex = ROW_LENGTH;
    }else{
        // Include the last cell
        maxRowIndex++;
    }

    if ((maxColumnIndex - minColumnIndex +1) < COLUMN_SIZE_LIMIT){
        minColumnIndex = 0;
        maxColumnIndex = COLUMN_LENGTH;
    }else{
        // Include the last cell
        maxColumnIndex++;
    }

    console.log(minRowIndex, maxRowIndex, minColumnIndex, maxColumnIndex);
    return [minRowIndex, maxRowIndex, minColumnIndex, maxColumnIndex];
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
    let limitsValue = getBoardLimits();
    let minRowIndex = limitsValue[0];
    let maxRowIndex = limitsValue[1];
    let minColumnIndex = limitsValue[2];
    let maxColumnIndex = limitsValue[3];

    // Get played cell where the actual card can be superposed.
    for (let rowId = minRowIndex; rowId < maxRowIndex; rowId++) {
        let row = boardTracker[rowId];
        for (let columnId = minColumnIndex; columnId < maxColumnIndex; columnId++) {
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

            if((adjacentRow >= minRowIndex) && (adjacentRow < maxRowIndex)){
                for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
                    let adjacentColumn = cellColumnId + columnOffset;

                    if((adjacentColumn >= minColumnIndex) && (adjacentColumn < maxColumnIndex)){
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
 * This method lists the size of every horizontal streak of the given color.
 * @param placedCardColor The checked color.
 * @returns {*[]} The list of the size of every horizontal streak
 */
function getHorizontalStreaks(placedCardColor) {
    let horizontalStreaks = [];
    let currentlyCrossedStreak = 0;
    
    for (let rowIndex = 0; rowIndex < ROW_LENGTH; rowIndex++) {
        for (let columnIndex = 0; columnIndex < COLUMN_LENGTH; columnIndex++) {
            let crossedCell = boardTracker[rowIndex][columnIndex];
            if(crossedCell.color !== null){
                let crossedCellColor = crossedCell.color;

                if(crossedCellColor !== placedCardColor){
                    if (currentlyCrossedStreak > 0){
                        horizontalStreaks.push(currentlyCrossedStreak);
                        currentlyCrossedStreak = 0;
                    }
                }else{
                    currentlyCrossedStreak++;
                }
            }
        }
    }

    console.log(horizontalStreaks);
    return horizontalStreaks;
}

/**
 * This method lists the size of every vertical streak of the given color.
 * @param placedCardColor The checked color.
 * @returns {*[]} The list of the size of every vertical streak.
 */
function getVerticalStreaks(placedCardColor) {
    let verticalStreaks = [];
    let currentlyCrossedStreak = 0;
    
    for (let columnIndex = 0; columnIndex < COLUMN_LENGTH; columnIndex++) {
        for (let rowIndex = 0; rowIndex < ROW_LENGTH; rowIndex++) {
            let crossedCell = boardTracker[rowIndex][columnIndex];
            if(crossedCell.color !== null){
                let crossedCellColor = crossedCell.color;

                if(crossedCellColor !== placedCardColor){
                    if (currentlyCrossedStreak > 0){
                        verticalStreaks.push(currentlyCrossedStreak);
                        currentlyCrossedStreak = 0;
                    }
                }else{
                    currentlyCrossedStreak++;
                }
            }
        }
    }

    return verticalStreaks;
}

/**
 * This method lists the size of every diagonal streak of the given color.
 * @param placedCardColor The checked color.
 * @returns {*[]} The list of the size of every diagonal streak.
 */
function getDiagonalStreaks(placedCardColor) {
    let diagonalStreaks = [];
    let currentlyCrossedStreak = 0;

    // From top-left to bottom-right
    // Starting from the first row (first half of diagonals)
    for (let startingColumnIndex = 0; startingColumnIndex < COLUMN_LENGTH; startingColumnIndex++) {
        let columnIndex = startingColumnIndex;
        let rowIndex = 0;

        while(rowIndex < ROW_LENGTH &&  columnIndex < COLUMN_LENGTH){
            let crossedCell = boardTracker[rowIndex][columnIndex];
            let crossedCellColor = crossedCell.color;

            if(crossedCellColor !== placedCardColor){
                if (currentlyCrossedStreak > 0){
                    diagonalStreaks.push(currentlyCrossedStreak);
                    currentlyCrossedStreak = 0;
                }
            }else{
                currentlyCrossedStreak++;
            }

            rowIndex++;
            columnIndex++;
        }
    }

    // Starting from the first column (second half of diagonals) (the first row is crossed earlier, so we skip it)
    for (let startingRowIndex = 1; startingRowIndex < COLUMN_LENGTH; startingRowIndex++) {
        let columnIndex = 0;
        let rowIndex = startingRowIndex;

        while(rowIndex < ROW_LENGTH &&  columnIndex < COLUMN_LENGTH){
            let crossedCell = boardTracker[rowIndex][columnIndex];
            let crossedCellColor = crossedCell.color;

            if(crossedCellColor !== placedCardColor){
                if (currentlyCrossedStreak > 0){
                    diagonalStreaks.push(currentlyCrossedStreak);
                    currentlyCrossedStreak = 0;
                }
            }else{
                currentlyCrossedStreak++;
            }

            rowIndex++;
            columnIndex++;
        }
    }

    // From bottom-left to top-right
    // Starting from the first column (first half of diagonals)
    for (let startingRowIndex = 0; startingRowIndex < COLUMN_LENGTH; startingRowIndex++) {
        let columnIndex = 0;
        let rowIndex = startingRowIndex;

        while(rowIndex >= 0 &&  columnIndex < COLUMN_LENGTH){
            let crossedCell = boardTracker[rowIndex][columnIndex];
            let crossedCellColor = crossedCell.color;

            if(crossedCellColor !== placedCardColor){
                if (currentlyCrossedStreak > 0){
                    diagonalStreaks.push(currentlyCrossedStreak);
                    currentlyCrossedStreak = 0;
                }
            }else{
                currentlyCrossedStreak++;
            }

            rowIndex--;
            columnIndex++;
        }
    }

    // Starting from the last row (second half of diagonals)
    for (let startingColumnIndex = 1; startingColumnIndex < COLUMN_LENGTH; startingColumnIndex++) {
        let columnIndex = startingColumnIndex;
        let rowIndex = ROW_LENGTH-1;

        while(rowIndex >= 0 &&  columnIndex < COLUMN_LENGTH){
            let crossedCell = boardTracker[rowIndex][columnIndex];
            let crossedCellColor = crossedCell.color;

            if(crossedCellColor !== placedCardColor){
                if (currentlyCrossedStreak > 0){
                    diagonalStreaks.push(currentlyCrossedStreak);
                    currentlyCrossedStreak = 0;
                }
            }else{
                currentlyCrossedStreak++;
            }

            rowIndex--;
            columnIndex++;
        }
    }

    return diagonalStreaks;
}

function getLongestStreak(placedCardColor) {

    let horizontalStreaks = getHorizontalStreaks(placedCardColor);
    let verticalStreaks = getVerticalStreaks(placedCardColor);
    let diagonalStreaks = getDiagonalStreaks(placedCardColor);

    let everyStreaks = horizontalStreaks.concat(horizontalStreaks.concat(diagonalStreaks));
    let biggestStreak = Math.max(...everyStreaks);

    console.log("INFO : getLongestStreak(" + placedCardColor + ") - Horizontal streaks " + horizontalStreaks + "; Vertical streaks " + verticalStreaks + "; Diagonal streak " + diagonalStreaks );
    console.log("INFO : getLongestStreak(" + placedCardColor + ") - Longest Streak : " + biggestStreak);
    return biggestStreak;
}

/**
 * This method checks if the given color has won.
 * @param placedCardColor The color of the last placed card.
 * @returns {boolean} True if the player has a streak that is long enough.
 */
function checkVictory(placedCardColor) {
    let hasWon = false;

    if(placedCardColor !== "neutral"){
        let longestColorStreak = getLongestStreak(placedCardColor);
        if(longestColorStreak >= streakLengthGoal){
            hasWon = true;
        }
    }

    console.log("INFO : checkVictory(" + placedCardColor + ") - " + hasWon);
    return hasWon;
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

    inGame = true;
}