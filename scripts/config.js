// Define the max size of the board. A limit of 6x6 will be calculated later in script.js according to the game rules.
const ROW_LENGTH = 11;
const COLUMN_LENGTH = 11;

let cards = [];

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
            tmpBoardCell.innerText = `${columnId};${rowId}`;
            tmpBoardCell.style.height = "64px";
            tmpBoardCell.style.width = "64px";
            tmpBoardCell.style.textAlign = "center";
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
        for (let dotsIndex = 0; dotsIndex < dots.length; dotsIndex++) {
            let dotsValue = dots[dotsIndex];
            cards.push({dots: dotsValue, color: colorValue});
            cards.push({dots: dotsValue, color: colorValue});
        }
    }
    console.log(cards);

}
function initBoardAndCards(){
    initBoard();
    initCards();
}
