/*----------variables-------------*/
const playButton = document.querySelector("#play");
const manual = document.querySelector("#instructions");
const container = document.querySelector("#container");
const board = document.querySelector("#board");
const classArr = [
  "block-blue",
  "block-green",
  "block-pink",
  "block-white",
  "block-black",
];

const cellDiv = "";
//populate container with cells
for (let x = 1; x < 11; x++) {
  for (let y = 1; y < 11; y++) {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    board.appendChild(cellDiv);
    cellDiv.dataset.x = x; //identify with attribute
    cellDiv.dataset.y = y;
  }
}

/*----------functions-------------*/
//function to get cell by its coordinate
function getCell(x, y) {
  return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

//return randomize blocks
//generate a block of a certain class
function randomBlocks() {
  const idx = Math.floor(Math.random() * classArr.length);
  let block = document.createElement("div");
  block.classList.add(classArr[idx]);
  return block;
}

//function to select every single cell
function everyCell() {
  for (let a = 1; a < 11; a++) {
    for (let b = 1; b < 11; b++) {
      let cell = getCell(a, b);
      //document.querySelector(`.cell[data-x="${a}"][data-y="${b}"]`);
      if (cell) {
        cell.appendChild(randomBlocks());
      }
    }
  }
}

everyCell();
let queueArr = [];

function findColorType(e) {
  const color = classArr.filter((color) => color === e.target.className);
  return color.toString();
}

function findClass(colorType) {
  return "." + colorType;
}

//when clicked on colored block
//if class list contains "block-blue" find the cellXY it is appended in
function burstBlock(e, colorClass) {
  let targettedCell = e.target.parentElement;
  let x = Number(targettedCell.dataset.x);
  let y = Number(targettedCell.dataset.y);
  //BEEFORE REMOVING - check the areas!!!!
  //make a modular code -> remove everythign that is grouped!

  const cellAbove = getCell(x - 1, y);
  const cellBelow = getCell(x + 1, y);
  const cellLeft = getCell(x, y - 1);
  const cellRight = getCell(x, y + 1);

  if (
    (!cellAbove || !cellAbove.querySelector(colorClass)) &&
    (!cellBelow || !cellBelow.querySelector(colorClass)) &&
    (!cellLeft || !cellLeft.querySelector(colorClass)) &&
    (!cellRight || !cellRight.querySelector(colorClass))
  ) {
    return;
  }

  e.target.remove();

  if (cellAbove && cellAbove.querySelector(colorClass)) {
    cellAbove.querySelector(colorClass).remove();
    queueArr.push(cellAbove);
  }

  if (cellBelow && cellBelow.querySelector(colorClass)) {
    cellBelow.querySelector(colorClass).remove();
    queueArr.push(cellBelow);
  }

  if (cellLeft && cellLeft.querySelector(colorClass)) {
    cellLeft.querySelector(colorClass).remove();
    queueArr.push(cellLeft);
  }

  if (cellRight && cellRight.querySelector(colorClass)) {
    cellRight.querySelector(colorClass).remove();
    queueArr.push(cellRight);
  }
}

function burstMoreBlocks(colorClass) {
  //let newQueueArr = []; //init
  while (queueArr.length > 0) {
    //queueArr.forEach((secCell) => {
    let secCell = queueArr.shift();

    let x = Number(secCell.dataset.x);
    let y = Number(secCell.dataset.y);

    let cellAbove = getCell(x - 1, y);
    let cellBelow = getCell(x + 1, y);
    let cellLeft = getCell(x, y - 1);
    let cellRight = getCell(x, y + 1);

    if (cellAbove && cellAbove.querySelector(colorClass)) {
      cellAbove.querySelector(colorClass).remove();
      queueArr.push(cellAbove);
    }

    if (cellBelow && cellBelow.querySelector(colorClass)) {
      cellBelow.querySelector(colorClass).remove();
      queueArr.push(cellBelow);
    }

    if (cellLeft && cellLeft.querySelector(colorClass)) {
      cellLeft.querySelector(colorClass).remove();
      queueArr.push(cellLeft);
    }

    if (cellRight && cellRight.querySelector(colorClass)) {
      cellRight.querySelector(colorClass).remove();
      queueArr.push(cellRight);
    }
  }
}

let emptiedCells = [];
function grabEmptyCells() {
  //scan for empty cells
  //capture its dataset x & y (eg, x = 8, y = 4)
  emptiedCells = [];
  for (let a = 0; a < 11; a++) {
    for (let b = 0; b < 11; b++) {
      const cell = getCell(a, b);

      if (cell && cell.childNodes.length === 0) {
        let x = Number(cell.dataset.x);
        let y = Number(cell.dataset.y);
        emptiedCells.push(getCell(x, y)); //get cells with no child
      } /*else {
        console.log(`no empty cells found`);
      } */
    }
  }
  //find cells with the same Yaxis but smalle X axis that contains child.
}
//if cell is empty and cell above contains childBlock
function fillEmptyCells() {
  while (emptiedCells.length > 0) {
    let emptyCell = emptiedCells.pop(); //pass the last element to be "checked"
    //last element has the largest X value
    let x = Number(emptyCell.dataset.x);
    let y = Number(emptyCell.dataset.y);
    //blocks on higher X axis (smaller numbers) will fall to lower (larger number)
    //check if cells on y4 with X axis smaller than 8 contains blocks?
    //check if cell on the same Y with <X contains blocks.

    for (let a = x - 1; a >= 1; a--) {
      //loop through to find nearest Xcell with child node
      let upperCell = getCell(a, y);
      if (upperCell && upperCell.hasChildNodes()) {
        const fallingBlock = upperCell.removeChild(upperCell.firstChild);
        emptiedCells.push(upperCell);
        getCell(x, y).appendChild(fallingBlock);
        break;
      }
    }
  }
}

function gapCheck() {
  let y = 10;

  while (y > 0) {
    let columnArr = [];
    for (let x = 1; x < 11; x++) {
      const cell = getCell(x, y);
      if (cell) {
        columnArr.push(getCell(x, y));
      }
    }

    const emptyColumn = columnArr.every((cell) => cell.childNodes.length === 0);
    if (emptyColumn) {
      //checks that everycell returns without a child
      console.log(`heres the value of empty column Y = ${y}`);
      return;
    }
    y--;
  }
}

playButton.addEventListener("click", () => (manual.style.display = "none"));

container.addEventListener("dblclick", (e) => {
  const colorType = findColorType(e);
  if (e.target.classList.contains(colorType)) {
    //make it modular - contains the same classlist
    findClass(colorType);
    const colorClass = findClass(colorType);
    burstBlock(e, colorClass);
    burstMoreBlocks(colorClass);

    grabEmptyCells();
    fillEmptyCells();

    gapCheck();
  }
});

/* when game runs
1. initialized - random blocks on load
2. player clicks 
3. targetted block will scan for surrounding blocks
4. burst all grouped blocks with loops 
6. blocks on the x axis will fall to larger x numbers and fill up any holes.
*/
