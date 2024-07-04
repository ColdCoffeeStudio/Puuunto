let board = document.getElementById("board");

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
    let columnId = cell.cellIndex;
    let rowId = cell.parentNode.rowIndex;
    let card = cards[Math.floor(Math.random() * cards.length)];

    console.log(columnId + ";" + rowId);
    console.log(cards);
    console.log(card);

    placeCard(cell, card);
}

function placeCard(cell, card){
    try{
        checkCardData(card);
        cell.innerText = card.dots;
        changeColor(cell, card.color);
    }catch (error) {
        console.error(error);
    }
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
    addListeners();
}