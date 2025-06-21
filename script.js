let stopwatchInterval;
let startTime = 0;
let pausedTime = 0;
let running = false;
let lastSavedTime = 0;
let laps = [];

// Format milliseconds into HH:MM:SS
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

// Updates stopwatch display
function updateStopwatch() {
    if (!running) return;
    const now = Date.now();
    const elapsed = now - startTime + pausedTime;
    document.querySelector('.stopwatch').textContent = formatTime(elapsed);
}

// Starts stopwatch
function startStopwatch() {
    if (running) return;
    startTime = Date.now();
    running = true;
    stopwatchInterval = setInterval(updateStopwatch, 200);
}

// Stops stopwatch
function stopStopwatch() {
    if (!running) return;
    pausedTime += Date.now() - startTime;
    running = false;
    clearInterval(stopwatchInterval);
}

// Resets stopwatch and laps
function resetStopwatch() {
    stopStopwatch();
    pausedTime = 0;
    lastSavedTime = 0;
    laps = [];
    document.querySelector('.stopwatch').textContent = formatTime(0);
    displayLaps(); // Clear lap list
}

// Save duration since last save
function saveDuration() {
    const totalElapsed = running ? Date.now() - startTime + pausedTime : pausedTime;
    const unsavedDuration = totalElapsed - lastSavedTime;

    if (unsavedDuration <= 0) {
        alert('No new duration to save.');
        return;
    }

    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const savedData = JSON.parse(localStorage.getItem('studyTracker')) || {};

    if (savedData[dateKey]) {
        savedData[dateKey] += unsavedDuration;
    } else {
        savedData[dateKey] = unsavedDuration;
    }

    localStorage.setItem('studyTracker', JSON.stringify(savedData));
    lastSavedTime = totalElapsed;
    alert(`Saved ${formatTime(unsavedDuration)} on ${dateKey}`);
    displayCalendar();
}

// Update current date on screen
function updateDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, options);
}

// Show saved durations by date
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

// Show saved time for a selected date
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


// Laps 
function recordLap() {
    const totalElapsed = running ? Date.now() - startTime + pausedTime : pausedTime;
    laps.push(totalElapsed);
    displayLaps();
}

function displayLaps() {
    const list = document.getElementById('lap-list');
    if (!list) return;
    list.innerHTML = '';

    laps.forEach((lapTime, index) => {
        const li = document.createElement('li');
        li.textContent = `Lap ${index + 1}: ${formatTime(lapTime)}`;
        list.appendChild(li);
    });
}

// On page load
updateDate();
displayCalendar();
setupDatePicker();
setSeasonalWallpaper();
