// === Updated script.js ===

let stopwatchInterval;
let startTime = 0;
let pausedTime = 0;
let running = false;

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));
    return (
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0')
    );
}

function updateStopwatch() {
    if (!running) return;
    const now = Date.now();
    const elapsed = now - startTime + pausedTime;
    document.querySelector('.stopwatch').textContent = formatTime(elapsed);
}

function startStopwatch() {
    if (running) return;
    startTime = Date.now();
    running = true;
    stopwatchInterval = setInterval(updateStopwatch, 200);
}

function stopStopwatch() {
    if (!running) return;
    pausedTime += Date.now() - startTime;
    running = false;
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    stopStopwatch();
    pausedTime = 0;
    document.querySelector('.stopwatch').textContent = formatTime(0);
}

function saveDuration() {
    const totalElapsed = running ? Date.now() - startTime + pausedTime : pausedTime;
    if (totalElapsed === 0) {
        alert('Cannot save a duration of 0 seconds.');
        return;
    }

    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const savedData = JSON.parse(localStorage.getItem('studyTracker')) || {};

    if (savedData[dateKey]) {
        savedData[dateKey] += totalElapsed;
    } else {
        savedData[dateKey] = totalElapsed;
    }

    localStorage.setItem('studyTracker', JSON.stringify(savedData));
    alert(`Saved ${formatTime(totalElapsed)} on ${dateKey}`);
    displayCalendar();
}

function updateDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, options);
}

function displayCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    container.innerHTML = '';
    const data = JSON.parse(localStorage.getItem('studyTracker')) || {};

    for (const date in data) {
        const entry = document.createElement('div');
        entry.className = 'calendar-entry';
        entry.textContent = `${date}: ${formatTime(data[date])}`;
        container.appendChild(entry);
    }
}

function setupDatePicker() {
    const picker = document.getElementById('calendar-picker');
    if (!picker) return;
    picker.addEventListener('change', () => {
        const selectedDate = picker.value;
        const data = JSON.parse(localStorage.getItem('studyTracker')) || {};
        const durationMs = data[selectedDate] || 0;
        const display = document.getElementById('selected-date-duration');

        if (durationMs === 0) {
            display.textContent = `No study duration logged on ${selectedDate}.`;
        } else {
            display.textContent = `You studied for ${formatTime(durationMs)} on ${selectedDate}.`;
        }
    });
}

function setSeasonalWallpaper() {
    const month = new Date().getMonth();
    let season;

    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';

    const video = document.getElementById('myVideo');
    const source = document.getElementById('video-source');
    if (source) {
        source.src = `${season}.mp4`;
        video.load();
    }
}

// On page load
updateDate();
displayCalendar();
setupDatePicker();
setSeasonalWallpaper();
