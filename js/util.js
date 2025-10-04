'use strict'

function renderBoard(mat, selector) {
    var strHTML = '<tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < mat[0].length; j++) {
            var cell = ''
            var className = `cell cell-${i}-${j}`
            if (mat[i][j].isMarked) {
                // cell content
                cell = gElements.flag
                // hide class
            } else if (mat[i][j].isMine) {
                // cell content
                cell = gElements.mine
                // hide class
                className += ` hide-text-visibility`
            } else if (mat[i][j].isRevealed) {
                // cell content
                cell = mat[i][j].minesAroundCount
                // hide class
                className += ` revealed-backround-style`
            } else {
                // cell content
                cell = mat[i][j].minesAroundCount
                // hide class
                className += ` hide-text-visibility`
            }

            if (cell === 0) cell = ''

            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(event,this,${i},${j})">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)

    elCell.innerHTML = value
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

function startTimer() {
    gstartTime = Date.now()

    clearInterval(gtimerInterval)
    gtimerInterval = setInterval(updateTimer, 37)
}

function updateTimer() {
    const timerDisplay = document.getElementById('timerDisplay')
    const pasedTime = Date.now() - gstartTime // Calculate elapsed time
    const seconds = Math.floor(pasedTime / 1000)
    const milliseconds = pasedTime % 1000

    // Format milliseconds to always have three digits
    const formattedMilliseconds = String(milliseconds).padStart(3, '0')

    // Format seconds to always have two digits
    const formattseconds = String(seconds).padStart(2, '0')
    gGame.secsPassed = +formattseconds

    timerDisplay.innerHTML = `${formattseconds} : ${formattedMilliseconds}`
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
