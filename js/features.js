'use strict'


function renderLives() {
    const elLives = document.querySelector('.lives-display')
    var str = ''
    for (var i = 0; i < gGame.lives; i++) {
        str += gElements.live
    }
    elLives.innerText = str
}

function reduceLive(elCell, cell) {

    gGame.lives--
    cell.isRevealed = false
    gGame.revealedCount--
    gGame.HideMineTimeOutFunc = setTimeout(() => {
        elCell.classList.remove('revealed-backround-style')
        elCell.classList.add('hide-text-visibility')
    }, "1500")
    renderLives()
}

function renderSmiley(value) {
    var elSmiley = document.querySelector('.reset-game')
    elSmiley.innerHTML = value

}

function renderhints() {
    const elLives = document.querySelector('.hint-display')
    var str = ''
    for (var i = 0; i < gGame.hints; i++) {
        str += `<button onclick="hintMode()" class="hint-button black-backround display-mode hint-display" >${gElements.hint}</button>`
    }
    elLives.innerHTML = str
}

function hintMode() {

    gGame.hintMode = true
    gGame.hints--
    renderhints()
}

function expandRevealHintMode(elCell, i, j, action) {

    var rowIdx = i
    var colIdx = j

    for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            var cell = gBoard[i][j]
            if (cell.isRevealed) continue
            var elCurrentCell = document.querySelector(`.cell-${i}-${j}`)
            if (action === 'hide') {

                elCurrentCell.classList.add('hide-text-visibility')

            } else elCurrentCell.classList.remove('hide-text-visibility')


        }
    }
    return
}

function saveBestScore() {
    const timerDisplay = document.getElementById('timerDisplay')
    const currentPasedTimeStr = timerDisplay.innerHTML
    var timeArr = currentPasedTimeStr.split(' : ')
    var sec = +timeArr[0]
    var millisec = +timeArr[1]
    console.log(`secound: ${sec}`);
    console.log(`millisecound: ${millisec}`);
    var currentPasedTime = sec * 1000 + millisec
    var itemScore = `Size: ${gLevel.SIZE} Mines: ${gLevel.MINES}`
    var prev_pasedTime = +sessionStorage.getItem(itemScore)

    if (!prev_pasedTime || prev_pasedTime > currentPasedTime) {
        sessionStorage.setItem(itemScore, currentPasedTime)
    }
}

function renderBestScore() {

    const itemScore = `Size: ${gLevel.SIZE} Mines: ${gLevel.MINES}`
    const pasedTime = +sessionStorage.getItem(itemScore)
    const elBestScore = document.querySelector('.best-score span')

    if (pasedTime === 0) elBestScore.innerHTML = ''
    else {
        const seconds = Math.floor(pasedTime / 1000)
        const milliseconds = pasedTime % 1000
        // Format milliseconds to always have three digits
        const formattedMilliseconds = String(milliseconds).padStart(3, '0')

        // Format seconds to always have two digits
        const formattseconds = String(seconds).padStart(2, '0')

        const elBestScore = document.querySelector('.best-score span')
        elBestScore.innerHTML = `${formattseconds} : ${formattedMilliseconds}`
    }
}

function safeClick() {
    if (!gGame.revealedCount || gGame.safeClicks < 1) return

    const emptyCells = allUnClickedAndNOtMineCells()
    const rndIdx = [getRandomInt(emptyCells.length)]
    const rndEmptyCell = emptyCells.splice(rndIdx, 1)[0]
    const elCell = document.querySelector(`.cell-${rndEmptyCell.i}-${rndEmptyCell.j}`)

    elCell.classList.remove('hide-text-visibility')
    setTimeout(() => {
        elCell.classList.add('hide-text-visibility')
    }, "1500")

    gGame.safeClicks--
    renderSafeClicks()
}

function allUnClickedAndNOtMineCells() {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[0].length; j++) {

            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isRevealed && !cell.isMarked) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}

function displayMode() {


    const elDisplayMode = document.querySelectorAll('.display-mode')

    if (!gGame.lightMode) {
        gGame.lightMode = true
        changeClassElArr(elDisplayMode, 'add', 'light-mode')

    } else {
        gGame.lightMode = false
        changeClassElArr(elDisplayMode, 'remove', 'light-mode')
    }
}

function changeClassElArr(elElmentArr, action, chosenClass) {

    for (var i = 0; i < elElmentArr.length; i++) {
        var element = elElmentArr[i]
        if (action === 'add') element.classList.add(chosenClass)
        else element.classList.remove(chosenClass)
    }
}

function savePrevMove() {

    gGamePrev.isOn = gGame.isOn
    gGamePrev.revealedCount = gGame.revealedCount
    gGamePrev.markedCount = gGame.markedCount
    gGamePrev.secsPassed = gGame.secsPassed
    gGamePrev.lives = gGame.lives
    gGamePrev.isOn = gGame.isOn

    // Save previous board
    const size = gLevel.SIZE

    for (var i = 0; i < size; i++) {

        for (var j = 0; j < size; j++) {

            var cell = gBoard[i][j]
            var cellPrev = gBoardPrev[i][j]

            cellPrev.minesAroundCount = cell.minesAroundCount
            cellPrev.isRevealed = cell.isRevealed
            cellPrev.isMine = cell.isMine
            cellPrev.isMarked = cell.isMarked
        }
    }
}

function undo() {
    // modal
    changeToPrevMove()

    // dom
    renderBoard(gBoard, '.board-container table')

    renderLives()
}

function renderCell(elCell, cell) {


    if (cell.isMarked) {
        elCell.innerText = gElements.flag
        elCell.classList.remove('hide-text-visibility')
        console.log(elCell);

    } else if (cell.isRevealed) {
        elCell.classList.remove('hide-text-visibility')
        console.log(elCell);

    }

}

function ManuallyPositionedMines() {

    gGame.manualMinesMode = true
}

function onClickDiffuclty(size, mines) {

    gLevel.SIZE = size
    gLevel.MINES = mines
    renderBestScore()
    onInit(size, mines)
}

function renderSafeClicks() {
    const elClicksAvailable = document.querySelector('.clicks-available span')
    elClicksAvailable.innerText = gGame.safeClicks
}


function changeToPrevMove() {

    gGame.isOn = gGamePrev.isOn
    gGame.revealedCount = gGamePrev.revealedCount
    gGame.markedCount = gGamePrev.markedCount
    gGame.secsPassed = gGamePrev.secsPassed
    gGame.lives = gGamePrev.lives
    gGame.isOn = gGamePrev.isOn

    // Change to prevvious board
    const size = gLevel.SIZE

    for (var i = 0; i < size; i++) {

        for (var j = 0; j < size; j++) {

            gBoard[i][j].minesAroundCount = gBoardPrev[i][j].minesAroundCount
            gBoard[i][j].isRevealed = gBoardPrev[i][j].isRevealed
            gBoard[i][j].isMine = gBoardPrev[i][j].isMine
            gBoard[i][j].isMarked = gBoardPrev[i][j].isMarked

        }
    }

}