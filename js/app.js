'use strict'

var gElements
var gBoard
var gLevel
var gGame
var gstartTime
var gtimerInterval


// Called when page loads
function onInit() {
    setElements()
    setGame()
    gBoard = buildBoard()
    setMinesNegsCount()
    timerDisplay.innerHTML = '00:000'
    renderBoard(gBoard, '.board-container')
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
    // set 2 mines
    board[1][2].isMine = board[0][0].isMine = true

    return board
}

function renderBoard(mat, selector) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j].isMine ? gElements.mine : mat[i][j].minesAroundCount
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className} hide-text-visibility" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event,this,${i},${j})">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
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

function getNegsMinesCount(pos) {
    var rowIdx = pos.i
    var colIdx = pos.j
    var minesCount = 0
    for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            if (gBoard[i][j].isMine) {
                minesCount++
            }
        }
    }
    return minesCount
}

function onCellClicked(elCell, i, j) {

    var cell = gBoard[i][j]

    //TODO: handle game over when click on a mine - need some adjsments

     if (!gGame.isOn) {
        if (cell.isMine !== true) {
            startTimer()
            gGame.isOn = true
        } else {
            console.log('Game Over Loser');
            clearInterval(gtimerInterval)
            return
        }
    }
  

    var cell = gBoard[i][j]


    if (cell.isRevealed || cell.isMarked) return

    cell.isRevealed = true
    gGame.revealedCount++
    elCell.classList.remove('hide-text-visibility')

  if (cell.isMine === true) {
        console.log('Game Over Loser');
        gGame.isOn = false
        clearInterval(gtimerInterval)
        return

    }

    checkGameOver()
}

function onCellMarked(event, elCell, i, j) {

    event.preventDefault()
    var cell = gBoard[i][j]

    if (cell.isRevealed) return

    if (cell.isMarked) {

        cell.isMarked = false
        gGame.markedCount--
        elCell.innerText = cell.isMine ? gElements.mine : cell.minesAroundCount
        elCell.classList.add('hide-text-visibility')

    } else {

        cell.isMarked = true
        gGame.markedCount++
        elCell.innerText = gElements.flag
        elCell.classList.remove('hide-text-visibility')
    }

    if (!gGame.isOn) {
        startTimer()
        gGame.isOn = true
    }
    checkGameOver()

}

function setGame() {
    gGame = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gLevel = {
        SIZE: 4,
        MINES: 2
    }
}

function setElements() {

    gElements = {
        mine: '💣',
        flag: '🚩'
    }
}

function checkGameOver() {

    var cellCount = gLevel.SIZE ** 2
    var mineCount = gLevel.MINES

    if (gGame.markedCount === mineCount && gGame.revealedCount === (cellCount - mineCount)) {
        clearInterval(gtimerInterval)
        console.log('Game Over')

    }


}

// npte date 20.09

// for next phase of work (secound phase) 23.09 : 
// 1. checkGameOver() -- V
// 2. add Timer -- V
// 3. expandReveal