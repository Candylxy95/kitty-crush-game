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
let prevScoresArr = [];
let combosArr = [];
let checksArr = [];

/*--- cached element-----*/
const playButton = document.querySelector("#play");
const manual = document.querySelector("#instructions");
const manualSansButton = document.querySelector("#manualSansButton");
const manualBook = document.querySelector("#manualBook");
const container = document.querySelector("#container");
const board = document.querySelector("#board");
const endBoard = document.querySelector("#end-board");
let score = document.querySelector("#score-count");
let endBoardScore = document.querySelector("#end-board-score");
const victoryMsg = document.querySelector("#victory-msg");
const replay = document.querySelector("#replay");
const restart = document.querySelector("#nav-button");
const blockerWall = document.querySelector("#blocker-wall");
let gridSize = 11; //11 - 1 = 10
const victoryCat = document.querySelector("#victory-cat");

//declare Timer
const timer = document.querySelector("#time-count");
let timeCount = 60;
let timeCounter = ""; //var to clear interval
timer.innerText = timeCount;

//declare Sound effect
let clickSound = new Audio(
  "../project-1-game/sound/mixkit-gear-fast-lock-tap-2857.wav"
);
let meowSound = new Audio(
  "../project-1-game/sound/mixkit-sweet-kitty-meow-93.wav"
);

const muteButton = document.querySelector("#mute");

const cellDiv = "";
//populate container with div cells by creating 100 of it and appending to the board
for (let x = 1; x < gridSize; x++) {
  for (let y = 1; y < gridSize; y++) {
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

//function to select every single cell & append a random colored block to it
function everyCell() {
  for (let a = 1; a < gridSize; a++) {
    for (let b = 1; b < gridSize; b++) {
      let cell = getCell(a, b);
      if (cell && cell.childNodes.length === 0) {
        cell.appendChild(randomBlocks());
      }
    }
  }
}

//return the className of the block used with bubbling event listener to make sure only blocks can be clicked
// only elements that matches the strings in classArr can be clicked
function findColorType(e) {
  const color = classArr.filter((color) => color === e.target.className);
  return color.toString();
}

//return name in class form to be used w queryselector when checking for surrounding cells in burstBlock/hover functions
function findClass(colorType) {
  return "." + colorType;
}
//retrieve dataset of any cell
function getCells(x, y) {
  const cellAbove = getCell(x - 1, y);
  const cellBelow = getCell(x + 1, y);
  const cellLeft = getCell(x, y - 1);
  const cellRight = getCell(x, y + 1);

  return [cellAbove, cellBelow, cellLeft, cellRight];
}
//when clicked on colored block
//if class list contains "eg. block-blue" find the cell coordinate it is appended in (first round of check on target)
function groupBlock(e, colorClass) {
  let targettedCell = e.target.parentElement; //when click on block - find the cell(parent element) it is appended in
  let x = Number(targettedCell.dataset.x); //let x & y be the targetted cell's coordinate
  let y = Number(targettedCell.dataset.y);

  const [cellAbove, cellBelow, cellLeft, cellRight] = getCells(x, y);
  //if there is no cells of connecting classses, return.
  if (
    (!cellAbove || !cellAbove.querySelector(colorClass)) &&
    (!cellBelow || !cellBelow.querySelector(colorClass)) &&
    (!cellLeft || !cellLeft.querySelector(colorClass)) &&
    (!cellRight || !cellRight.querySelector(colorClass))
  ) {
    return;
  }

  combosArr.push(e.target.parentElement); //push the targetted cell coordinate into comboArr
  //check it's four surroundings for connecting cells and push it into a diff arr : checksArr

  if (cellAbove && cellAbove.querySelector(colorClass)) {
    checksArr.push(cellAbove);
  }

  if (cellBelow && cellBelow.querySelector(colorClass)) {
    checksArr.push(cellBelow);
  }

  if (cellLeft && cellLeft.querySelector(colorClass)) {
    checksArr.push(cellLeft);
  }

  if (cellRight && cellRight.querySelector(colorClass)) {
    checksArr.push(cellRight);
  }
}

function groupSecBlock(colorClass) {
  //check each element in the checksArr by shifting the first element into a variable called secCell aka secondary cell
  while (checksArr.length > 0) {
    let secCell = checksArr.shift();
    const x = Number(secCell.dataset.x);
    const y = Number(secCell.dataset.y);
    //grab its coordinates and check its surrounding cells if they are appended with the same class-color.
    const [cellAbove, cellBelow, cellLeft, cellRight] = getCells(x, y);

    if (
      cellAbove &&
      cellAbove.querySelector(colorClass) &&
      !combosArr.includes(cellAbove) //make sure it does not grab the same cell
    ) {
      checksArr.push(cellAbove); //if connecting class-color exists push the cell into checksArr to be rechecked.
    }

    if (
      cellBelow &&
      cellBelow.querySelector(colorClass) &&
      !combosArr.includes(cellBelow)
    ) {
      checksArr.push(cellBelow);
    }

    if (
      cellLeft &&
      cellLeft.querySelector(colorClass) &&
      !combosArr.includes(cellLeft)
    ) {
      checksArr.push(cellLeft);
    }

    if (
      cellRight &&
      cellRight.querySelector(colorClass) &&
      !combosArr.includes(cellRight)
    ) {
      checksArr.push(cellRight);
    }
    combosArr.push(secCell); //after checking each secCell, push it to the comboArr to be grouped.
  } //while loop continues until there is nothing left in the checksArr.
}
//every cats in the combosArr enlarge on hover & clear combosArr after
function hoverAnimation() {
  for (const elem of combosArr) {
    elem.style.animation = "enlargeCats 1s 1";
  }
  combosArr.length = 0;
}

//unappend all the cats in the cells coordinates that exists in the comboArr.
function removeBlocks() {
  if (combosArr.length > 1) {
    addMeowSound();
  }
  for (const elem of combosArr) {
    elem.innerHTML = "";
  }
  combosArr.length = 0;
}

//function to find all empty cells - (used with fillEmptyCells function) so that top blocks will fall to fill up emptyCells below.
let emptiedCells = [];
function grabEmptyCells() {
  //scan through entire cells
  emptiedCells = [];
  for (let a = 0; a < gridSize; a++) {
    for (let b = 0; b < gridSize; b++) {
      const cell = getCell(a, b);

      if (cell && cell.childNodes.length === 0) {
        //if cell is true and is not appended with blocks
        let x = Number(cell.dataset.x);
        let y = Number(cell.dataset.y);
        emptiedCells.push(getCell(x, y)); //store these cells into an EmptiedCellsarray
      }
    }
  }
}
//find cells with the same Yaxis but smaller X axis that contains child. (smaller X axis = cells at the top)
//if cell is empty and cell above contains childBlock
function fillEmptyCells() {
  while (emptiedCells.length > 0) {
    //as long as there are emptiedCells in the array - do this
    let emptyCell = emptiedCells.pop(); //pass the last element to be "checked" as last element has the largest X value
    let x = Number(emptyCell.dataset.x);
    let y = Number(emptyCell.dataset.y);

    //check whatevr is on top of the empty cells w childnodes all the way to the top cell (decreasing X value order)
    for (let a = x - 1; a >= 1; a--) {
      //loop through to find nearest Xcell with child node
      let upperCell = getCell(a, y); //since we are checking column Y remains the same
      if (upperCell && upperCell.hasChildNodes()) {
        const fallingBlock = upperCell.removeChild(upperCell.firstChild); //remove blocks from (cells appended with blocks on top of empty cells)
        emptiedCells.push(upperCell);
        getCell(x, y).appendChild(fallingBlock); //append them to the empty cells below.
        fallingBlock.style.animation = "reappear 1s 1";
        break;
      }
    }
  }
}

//check if there is any empty column
function checkAndCollapseGap() {
  let y = 10;
  //check through all ten column of cells
  while (y > 0) {
    let columnArr = [];
    for (let x = 1; x < gridSize; x++) {
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

//fill up column by shifting all blocks to the right.
function collapseGap(yvalue) {
  for (x = 1; x < gridSize; x++) {
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
  for (let x = 1; x < gridSize; x++) {
    for (let y = 1; y < gridSize; y++) {
      const cell = getCell(x, y);
      if (cell && cell.childNodes.length > 0) {
        appCellArr.push(cell);
      }
    }
  }

  const matchingBlocks = appCellArr.some((testCell) => {
    x = Number(testCell.dataset.x);
    y = Number(testCell.dataset.y);

    const [cellAbove, cellBelow, cellLeft, cellRight] = getCells(x, y);

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
      return true;
    }
    return false;
  });

  if (!matchingBlocks) {
    endBoard.style.display = "block";
    blockerWall.style.display = "block";
    clearInterval(timeCounter);
  }

  appCellArr = [];
}

//subtract no. of previous empty blocks with no. of current empty blocks to see how many block's bursted in a round
//calculate points base on combos
function scoreSystem() {
  let currScoresArr = []; //length of total scoreArray
  let points = "";
  //length scoreArray before it is appended with new blocks from this round (an unupdated);

  //onclick - 2 cats = 1 point
  //scan cells to see how many cats have been removed each round..
  for (let x = 1; x < gridSize; x++) {
    for (let y = 1; y < gridSize; y++) {
      //calculate cells not appended with blocks
      let cell = getCell(x, y);
      if (cell && !cell.hasChildNodes()) {
        currScoresArr.push(cell); //get the length of total unappended blocks minus previously unappended blocks.
      }
    }
  }

  let prevScore = prevScoresArr.reduce((acc, num) => acc + num, 0);
  points = currScoresArr.length - prevScore; //SUM OF PREVSCORE ARR.

  //push the total num of everything that was deleted into calScore Arr.
  if (points === 2) {
    score.innerText = Number(score.innerText) + 1;
  } else if (points > 2 && points < 5) {
    score.innerText = Number(score.innerText) + points * 2;
  } else if (points >= 5 && points < 8) {
    score.innerText = Number(score.innerText) + points * 3;
  } else if (points >= 8) {
    score.innerText = Number(score.innerText) + points * 5;
  }
  endBoardScore.innerText = score.innerText;
  prevScoresArr.push(Number(points)); //stores the number of blocks cleared each round.
  currScoresArr.length = 0;
}

//winning condition and incentives
function didYouWin() {
  if (Number(endBoardScore.innerText) >= 200) {
    victoryMsg.innerText = "CONGRATULATIONS! You've won!";
    victoryCat.src = "../project-1-game/images/Winning-cat.png";
  } else if (Number(endBoardScore.innerText) < 200) {
    victoryMsg.innerText = "Sorry, please try harder.";
    victoryCat.src = "../project-1-game/images/Blue-cat-crying.png";
  }
}

//start timer and clear timer on each new round.
function startTimer() {
  clearInterval(timeCounter);

  timeCounter = setInterval(() => {
    timeCount--;
    timer.innerText = timeCount;
    if (timeCount === 0) {
      endBoard.style.display = "block";
      clearInterval(timeCounter);
    }
  }, 1000);
}

function init() {
  everyCell();
  endBoard.style.display = "none";
  manualSansButton.style.display = "none";
  prevScoresArr = [];
  score.innerText = 0;
  timeCount = 60;
  //
  if (mode.innerText === "Light") {
    nightMode(); // Ensure that dark mode settings are applied after reset
  }
}

function toggleManual() {
  if (manualSansButton.style.display === "none") {
    return (manualSansButton.style.display = "block");
  } else manualSansButton.style.display = "none";
}

function toggleSound() {
  if (muteButton.innerText === "Sound On") {
    muteButton.innerText = "Sound Off";
  } else {
    muteButton.innerText = "Sound On";
  }
}

function addClickSound() {
  if (muteButton.innerText === "Sound Off") {
    clickSound.play();
  }
}

function addMeowSound() {
  if (muteButton.innerText === "Sound Off") {
    meowSound.play();
  }
}

/*----event listeners---*/

playButton.addEventListener("mouseover", () => {
  addClickSound();
});

playButton.addEventListener("click", () => {
  addClickSound();
  manual.style.display = "none";
  blockerWall.style.display = "none";
  startTimer();
});

let delayHover = null;

container.addEventListener("mouseover", (e) => {
  const colorType = findColorType(e);
  if (e.target.classList.contains(colorType)) {
    //make it modular - contains the same classlist
    const colorClass = findClass(colorType);

    if (e.target.classList.contains(colorType)) {
      delayHover = setTimeout(() => {
        groupBlock(e, colorClass);
        groupSecBlock(colorClass);
        hoverAnimation();
      }, 400);
    }
  }
});

container.addEventListener("mouseout", (e) => {
  const colorType = findColorType(e);
  if (e.target.classList.contains(colorType)) {
    clearTimeout(delayHover);
  }
});

container.addEventListener("dblclick", (e) => {
  const colorType = findColorType(e);
  if (e.target.classList.contains(colorType)) {
    //make sure you can only click on block element within classArr

    findClass(colorType);
    const colorClass = findClass(colorType);
    groupBlock(e, colorClass);
    groupSecBlock(colorClass);
    removeBlocks();

    grabEmptyCells();
    fillEmptyCells();

    scoreSystem();

    checkAndCollapseGap();
    scanForWin();
    didYouWin();
  }
});

replay.addEventListener("mouseover", () => {
  addClickSound();
});

replay.addEventListener("click", () => {
  init();
  blockerWall.style.display = "none";
  addClickSound();
  startTimer();
  //
  if (mode.innerText === "Light") {
    nightMode(); // Ensure that dark mode settings are applied after reset
  }
});

restart.addEventListener("mouseover", () => {
  addClickSound();
});

restart.addEventListener("click", () => {
  init();
  addClickSound();
  startTimer();
  //
  if (mode.innerText === "Light") {
    nightMode(); // Ensure that dark mode settings are applied after reset
  }
});

manualBook.addEventListener("click", () => {
  addClickSound();
  toggleManual();
});

muteButton.addEventListener("click", () => toggleSound());

init();

/* night mode */
function toggleMode() {
  if (mode.innerText === "Light") {
    mode.innerText = "Dark";
  } else {
    mode.innerText = "Light";
  }
}

function nightMode() {
  if (mode.innerText === "Light") {
    const blockBlack = document.querySelectorAll(".block-black");
    blockBlack.forEach((block) => {
      block.style.backgroundImage =
        "url(../project-1-game/images/Black_cat_darkmode.png)";
    });

    const blockPink = document.querySelectorAll(".block-pink");
    blockPink.forEach((block) => {
      block.style.backgroundImage =
        "url(../project-1-game/images/Pink_cat_darkmode.png)";
    });

    const blockOrange = document.querySelectorAll(".block-orange");
    blockOrange.forEach((block) => {
      block.style.backgroundImage =
        "url(../project-1-game/images/Orange_cat_darkmode.png)";
    });

    const blockBlue = document.querySelectorAll(".block-blue");
    blockBlue.forEach((block) => {
      block.style.backgroundImage =
        "url(../project-1-game/images/Blue_cat_darkmode.png)";
    });

    const blockWhite = document.querySelectorAll(".block-white");
    blockWhite.forEach((block) => {
      block.style.backgroundImage =
        "url(../project-1-game/images/White_cat_darkmode.png)";
    });

    document.querySelector("body").style.backgroundImage =
      "linear-gradient(var(--black), var(--blue))";

    container.style.borderColor = "var(--blue)";
    document.querySelector("#nav").style.backgroundColor = "var(--blue)";
    document.querySelector("#nav").style.color = "var(--beige)";

    const buttons = document.querySelectorAll(".toggles");
    buttons.forEach((button) => {
      button.style.backgroundColor = "var(--gray)";
      button.style.color = "var(--linen)";
      button.style.borderColor = "var(--lblue)";
    });

    document.querySelector("footer").style.color = "var(--beige)";

    document.querySelector("#cloud").src =
      "../project-1-game/images/Black_cloud.png";
    document.querySelector("#cloud2").src =
      "../project-1-game/images/Black_cloud2.png";
    document.querySelector("#cloud3").src =
      "../project-1-game/images/Black_cloud3.png";
    document.querySelector("#cloud4").src =
      "../project-1-game/images/Black_cloud.png";
  } else if (mode.innerText === "Dark") {
    const blockBlack = document.querySelectorAll(".block-black");
    blockBlack.forEach((block) => {
      block.style.backgroundImage = "";
    });

    const blockPink = document.querySelectorAll(".block-pink");
    blockPink.forEach((block) => {
      block.style.backgroundImage = "";
    });

    const blockOrange = document.querySelectorAll(".block-orange");
    blockOrange.forEach((block) => {
      block.style.backgroundImage = "";
    });

    const blockBlue = document.querySelectorAll(".block-blue");
    blockBlue.forEach((block) => {
      block.style.backgroundImage = "";
    });

    const blockWhite = document.querySelectorAll(".block-white");
    blockWhite.forEach((block) => {
      block.style.backgroundImage = "";
    });

    document.querySelector("body").style.backgroundImage = "";

    container.style.borderColor = "";
    document.querySelector("#nav").style.backgroundColor = "";
    document.querySelector("#nav").style.color = "";

    const buttons = document.querySelectorAll(".toggles");
    buttons.forEach((button) => {
      button.style.backgroundColor = "";
      button.style.color = "";
      button.style.borderColor = "";
    });

    document.querySelector("footer").style.color = "";

    document.querySelector("#cloud").src = "images/Cloud.png";
    document.querySelector("#cloud2").src = "images/Cloud2.png";
    document.querySelector("#cloud3").src = "images/Cloud3.png";
    document.querySelector("#cloud4").src = "images/Cloud.png";
  }
}

mode.addEventListener("click", () => {
  toggleMode();
  nightMode();
});
