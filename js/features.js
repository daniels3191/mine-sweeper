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
    setTimeout(() => {
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
        str += `<button onclick="hintMode()" class="hint-button black-backround">${gElements.hint}</button>`
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

    if (pasedTime !== 0) {
        const seconds = Math.floor(pasedTime / 1000)
        const milliseconds = pasedTime % 1000
        // Format milliseconds to always have three digits
        const formattedMilliseconds = String(milliseconds).padStart(3, '0')

        // Format seconds to always have two digits
        const formattseconds = String(seconds).padStart(2, '0')

        const elBestScore = document.querySelector('.best-score')
        elBestScore.innerHTML = `${formattseconds} : ${formattedMilliseconds}`


    }
}


