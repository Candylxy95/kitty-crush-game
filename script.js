/*----------variables-------------*/
//things to init PREV SCORE ARR,
//Score

const classArr = [
  "block-blue",
  "block-orange",
  "block-pink",
  "block-white",
  "block-black",
];
let queueArr = [];
let prevScoreArr = [];

/*--- cached element-----*/
const playButton = document.querySelector("#play");
const manual = document.querySelector("#instructions");
const container = document.querySelector("#container");
const board = document.querySelector("#board");
const endBoard = document.querySelector("#end-board");
let score = document.querySelector("#score-count");

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

    const x = Number(secCell.dataset.x);
    const y = Number(secCell.dataset.y);

    const cellAbove = getCell(x - 1, y);
    const cellBelow = getCell(x + 1, y);
    const cellLeft = getCell(x, y - 1);
    const cellRight = getCell(x, y + 1);

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

function checkAndCollapseGap() {
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
      const emptyY = y;
      collapseGap(emptyY);
    }
    y--;
  }
}

function collapseGap(yvalue) {
  for (x = 1; x < 11; x++) {
    for (y = 1; y < yvalue; y++) {
      const cell = getCell(x, y);
      if (cell && cell.hasChildNodes()) {
        const moveBlocks = cell.removeChild(cell.firstChild);
        const moveToCell = getCell(x, y + 1);
        moveToCell.appendChild(moveBlocks);
      }
    }
  }
}

//scans through cells to determine if theres any linking blocks left
function scanForWin() {
  //loop through each cell with childNodes
  // loop through each colorClass to check 4 surroundings
  let appCellArr = [];
  for (let x = 1; x < 11; x++) {
    for (let y = 1; y < 11; y++) {
      const cell = getCell(x, y);
      if (cell && cell.childNodes.length > 0) {
        appCellArr.push(cell);
      }
    }
  }

  const matchingBlocks = appCellArr.some((testCell) => {
    x = Number(testCell.dataset.x);
    y = Number(testCell.dataset.y);

    const cellAbove = getCell(x - 1, y);
    const cellBelow = getCell(x + 1, y);
    const cellLeft = getCell(x, y - 1);
    const cellRight = getCell(x, y + 1);

    if (
      (cellAbove &&
        cellAbove.firstChild &&
        cellAbove.firstChild.className === testCell.firstChild.className) ||
      (cellBelow &&
        cellBelow.firstChild &&
        cellBelow.firstChild.className === testCell.firstChild.className) ||
      (cellLeft &&
        cellLeft.firstChild &&
        cellLeft.firstChild.className === testCell.firstChild.className) ||
      (cellRight &&
        cellRight.firstChild &&
        cellRight.firstChild.className === testCell.firstChild.className)
    ) {
      console.log("game continues");
      return true;
    }
    return false;
  });

  if (!matchingBlocks) {
    console.log("gameOver");
    endBoard.style.display = "block";
  }

  appCellArr = [];
}

function scoreSystem() {
  let currScoreArr = []; //length of total scoreArray
  let points = "";
  //length scoreArray before it is appended with new blocks from this round (an unupdated);

  //onclick - 2 cats = 1 point
  //scan cells to see how many cats have been removed each round - accumulative...
  for (let x = 1; x < 11; x++) {
    for (let y = 1; y < 11; y++) {
      //calculate cells not appended with blocks
      let cell = getCell(x, y);
      if (cell && !cell.hasChildNodes()) {
        currScoreArr.push(cell); //get the length of total unappended blocks minus previously unappended blocks.
      }
    }
  }

  let prevScore = prevScoreArr.reduce((acc, num) => acc + num, 0);
  points = currScoreArr.length - prevScore; //SUM OF PREVSCORE ARR.

  //push the total num of everything that was deleted into calScore Arr.
  if (points === 2) {
    score.innerText = Number(score.innerText) + 1;
  } else if (points > 2 && points < 5) {
    score.innerText = Number(score.innerText) + points * 2;
  } else if (points >= 5) {
    score.innerText = Number(score.innerText) + points * 3;
  }

  console.log(`points: ${points}, currScoreArr = ${currScoreArr.length}`);
  prevScoreArr.push(Number(points)); //stores the number of blocks cleared each round.

  currScoreArr.length = 0;

  console.log(`prev score arr = ${prevScoreArr}`);
}

everyCell();
endBoard.style.display = "none";
score.innerText = 0;
console.log(typeof score.innerText);

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

    scoreSystem();

    checkAndCollapseGap();
    scanForWin();
  }
});
