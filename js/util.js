'use strict'

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
//<span class="hide-text-visibility">${cell}</span>