/*----------variables-------------*/

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

//when clicked on colored block
//if class list contains "block-blue" find the cellXY it is appended in
function burstBlock(e, colorClass) {
  let targettedCell = e.target.parentElement;
  let x = Number(targettedCell.dataset.x);
  let y = Number(targettedCell.dataset.y);
  console.log(`X= ${x}, Y=${y}`);
  console.log(e.target.className);
  //BEEFORE REMOVING - check the areas!!!!
  //make a modular code -> remove everythign that is grouped!
  e.target.remove();

  const cellAbove = getCell(x - 1, y);
  const cellBelow = getCell(x + 1, y);
  const cellLeft = getCell(x, y - 1);
  const cellRight = getCell(x, y + 1);

  if (cellAbove && cellAbove.querySelector(colorClass)) {
    cellAbove.querySelector(colorClass).remove();
    queueArr.push(cellAbove);
  } else console.log(`cellAbove is not found = ${cellAbove}`);

  if (cellBelow && cellBelow.querySelector(colorClass)) {
    cellBelow.querySelector(colorClass).remove();
    queueArr.push(cellBelow);
  } else console.log(`cellBelow is not found = ${cellBelow}`);

  if (cellLeft.querySelector(colorClass)) {
    cellLeft.querySelector(colorClass).remove();
    queueArr.push(cellLeft);
  } else console.log(`cellLeft is not found = ${cellLeft}`);

  if (cellRight.querySelector(colorClass)) {
    cellRight.querySelector(colorClass).remove();
    queueArr.push(cellRight);
  } else console.log(`cellRight is not found = ${cellRight}`);

  console.log(queueArr);
}

function burstMoreBlocks(colorClass) {
  let newQueueArr = []; //init

  queueArr.forEach((secCell) => {
    let x = Number(secCell.dataset.x);
    let y = Number(secCell.dataset.y);

    const cellAbove = getCell(x - 1, y);
    const cellBelow = getCell(x + 1, y);
    const cellLeft = getCell(x, y - 1);
    const cellRight = getCell(x, y + 1);

    if (cellAbove && cellAbove.querySelector(colorClass)) {
      //performs check on the cell in queue
      cellAbove.querySelector(colorClass).remove();

      newQueueArr.push(cellAbove); //add cell is there is
      //a function that checks if there is more blocks and burst it.
    } else {
      console.log(`cellAbove is not found= ${cellAbove}`);
    }

    if (cellBelow && cellBelow.querySelector(colorClass)) {
      cellBelow.querySelector(colorClass).remove();
      newQueueArr.push(cellBelow);
    } else {
      console.log(`cellBelow is not found = ${cellBelow}`);
    }

    if (cellLeft.querySelector(colorClass)) {
      cellLeft.querySelector(colorClass).remove();
      newQueueArr.push(cellLeft);
    } else {
      console.log(`cellLeft is not found= ${cellLeft}`);
    }

    if (cellRight.querySelector(colorClass)) {
      cellRight.querySelector(colorClass).remove();
      newQueueArr.push(cellRight);
    } else {
      console.log(`cellRight is not found = ${cellRight}`);
    }
  });

  queueArr = newQueueArr;

  newQueueArr = []; //instead of shifting 1b1 jus replace the queue

  while (queueArr.length > 0) {
    //when function is called, it will be repeated until theres no more elements in the queue
    burstMoreBlocks();
  }
  console.log(queueArr);
}

function findColorType(e) {
  const color = classArr.filter((color) => color === e.target.className);
  return color.toString();
}

function findClass(colorType) {
  return "." + colorType;
}

container.addEventListener(
  "dblclick",
  (e) => {
    const colorType = findColorType(e);
    if (e.target.classList.contains(colorType)) {
      //make it modular - contains the same classlist
      findClass(colorType);
      const colorClass = findClass(colorType);
      burstBlock(e, colorClass);
      burstMoreBlocks(colorClass);
    }
  } //else single - do not burst!
);

/* when game runs
1. initialized - random blocks on load
2. player clicks 
3. targetted block will scan for surrounding blocks
4. group surrounding blocks
5. burst all grouped blocks
6. blocks on the x axis will fall to larger x numbers and fill up any holes.
*/
