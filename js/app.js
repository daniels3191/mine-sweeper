'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}


// Called when page loads
function onInit() {
    gBoard = buildBoard()
    setMinesNegsCount()
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

            const cell = mat[i][j].isMine ? MINE : mat[i][j].minesAroundCount
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event,this,${i},${j})" > <span class="hide-text-visibility">${cell}</span></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(){
        for (var i = 0; i < gBoard.length; i++) {
    
            for (var j = 0; j < gBoard[0].length; j++) {
                var cell = gBoard[i][j]
                var NegsMinesCount = getNegsMinesCount({i,j}) ?  getNegsMinesCount({i,j}) : ''
                cell.minesAroundCount = NegsMinesCount
            }
        }
}

function getNegsMinesCount(pos) {
    var rowIdx = pos.i
    var colIdx = pos.j
    var minesCount = 0
    for (var i = rowIdx -1; i < rowIdx + 2; i++) {
        if(i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            if( j < 0 || j >= gBoard[0].length) continue
            if(i === rowIdx && j === colIdx) continue

            if (gBoard[i][j].isMine){
                minesCount++
            }
        }
    }
    return minesCount
}

function onCellClicked(elCell, i, j){
    console.log(`i: ${i}, j: ${j}`);
    console.log(elCell.querySelector('span'))
    
    elCell.querySelector('span').classList.remove('hide-text-visibility')
    console.log(elCell.querySelector('span'))
}

function onCellMarked(event ,elCell, i, j){
    console.log('onCellMarked');
    event.preventDefault()
    

}