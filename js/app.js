'use strict'

var gElements
var gBoard
var gLevel
var gGame
var gstartTime
var gtimerInterval
var gGamePrev
var gBoardPrev

function onInit(size = 5, mines = 4) {
    setElements()
    setGame(size, mines)
    gBoard = buildBoard()
    gBoardPrev = buildBoard()
    timerDisplay.innerHTML = '00:000'
    gGame.isOn = true
    renderBoard(gBoard, '.board-container table')
    renderLives()
    renderhints()
    renderBestScore()
}

function buildBoard() {
    const size = gLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: '',
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board
}

function setMinesNegsCount() {

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[0].length; j++) {

            var cell = gBoard[i][j]
            var NegsMinesCount = getNegsMinesCount({ i, j })
            cell.minesAroundCount = NegsMinesCount
        }
    }
}

function onCellClicked(elCell, i, j) {


    var cell = gBoard[i][j]
    savePrevMove()

    if (!gGame.isOn) return


    if (gGame.revealedCount === 0) {

        if (gGame.manualMinesMode) {

            if (gGame.manualMinesCount < gLevel.MINES) {
                if (cell.isMine) {
                    alert('You’ve already placed a mine here, try another cell')
                    return
                }

                cell.isMine = true
                gGame.manualMinesCount++
                alert(`you have ${gLevel.MINES - gGame.manualMinesCount} to set on the board`)
                return
            }

        } else {
            // The first clicked cell is never a mine
            addRandomMines(i, j)
            // set 2 mines
            // gBoard[3][2].isMine = gBoard[0][0].isMine = true
        }

        setMinesNegsCount()
        renderBoard(gBoard, '.board-container table')
        startTimer()
        var elCell = document.querySelector(`.cell-${i}-${j}`)
        cell = gBoard[i][j]
        savePrevMove()

    }
    if (gGame.hintMode) {
        expandRevealHintMode(elCell, i, j, 'reveal')
        setTimeout(() => {
            expandRevealHintMode(elCell, i, j, 'hide')
        }, "1000")

        gGame.hintMode = false
        return

    }
    if (cell.isRevealed || cell.isMarked) return



    cell.isRevealed = true
    gGame.revealedCount++
    elCell.classList.remove('hide-text-visibility')


    if (cell.isMine) {
        if (gGame.lives > 1) {
            alert(`You hit a mine, but dont worry, you have ${gGame.lives - 1} left`)
        }
        reduceLive(elCell, cell)
    }

    if (cell.minesAroundCount === 0 && !cell.isMine) expandReveal(elCell, i, j)


    checkGameOver()
}

function onCellMarked(event, elCell, i, j) {
    savePrevMove()

    event.preventDefault()
    var cell = gBoard[i][j]

    if (!gGame.isOn || !gGame.revealedCount || (cell.isRevealed && !cell.isMarked)) return

    if (cell.isMarked) {

        cell.isMarked = false
        gGame.markedCount--
        elCell.innerText = cell.isMine ? gElements.mine : cell.minesAroundCount
        if (!cell.isRevealed) elCell.classList.add('hide-text-visibility')

    } else {

        cell.isMarked = true
        gGame.markedCount++
        elCell.innerText = gElements.flag
        elCell.classList.remove('hide-text-visibility')
    }
    checkGameOver()

}

function setGame(size, mines) {
    gGame = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hintMode: false,
        hints: 3,
        safeClicks: 3,
        lightMode: false,
        manualMinesMode: false,
        manualMinesCount: 0
    }
    gLevel = {
        SIZE: size,
        MINES: mines,
    }
    gGamePrev = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        i: '',
        j: '',
        elCell: '',
    }

}

function setElements() {

    gElements = {
        mine: '💣',
        flag: '🚩',
        live: '❤️',
        smiley_normal: '😃',
        smiley_sad: '🤯',
        smiley_sunglasses: '😎',
        hint: '💡',
    }
}

function checkGameOver() {

    var cellCount = gLevel.SIZE ** 2
    var mineCount = gLevel.MINES

    if (gGame.lives) {
        var str = 'You Won! Game Over'
        var smileyState = gElements.smiley_sunglasses

    } else {
        var str = 'Game Over Loser'
        var smileyState = gElements.smiley_sad
    }

    if (gGame.markedCount === mineCount && gGame.revealedCount === (cellCount - mineCount) ||
        gGame.lives === 0) {
        clearInterval(gtimerInterval)
        renderSmiley(smileyState)
        console.log(str)
        gGame.isOn = false
        saveBestScore()
    }
}

function expandReveal(elCell, i, j) {

    var rowIdx = i
    var colIdx = j

    for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            var cell = gBoard[i][j]
            if (cell.isRevealed) continue
            cell.isRevealed = true
            gGame.revealedCount++
            var elCurrentCell = document.querySelector(`.cell-${i}-${j}`)
            elCurrentCell.classList.remove('hide-text-visibility')

            if (cell.minesAroundCount === 0) expandReveal(elCurrentCell, i, j)

        }
    }
    return
}

function addRandomMines(i, j) {
    const minesAmount = gLevel.MINES
    const emptyCells = getAllEmptyCells(i, j)
    for (var i = 0; i < minesAmount; i++) {
        const rndIdx = [getRandomInt(emptyCells.length)]
        const rndEmptyCell = emptyCells.splice(rndIdx, 1)[0]
        console.log(rndEmptyCell);
        gBoard[rndEmptyCell.i][rndEmptyCell.j].isMine = true

    }

}

function getAllEmptyCells(i, j) {
    var emptyCells = []
    const rowIdx = i
    const colIdx = j

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (!gBoard[i][j].isMine) {
                emptyCells.push({ i, j })
            }
        }
    }


    return emptyCells
}

function resetGame() {
    renderSmiley(gElements.smiley_normal)
    onInit()
    clearInterval(gtimerInterval)
}


