let stopwatchInterval;
let elapsedTime = 0;

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return (
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0')
    );
}

function updateStopwatch() {
    elapsedTime += 100;
    document.querySelector('.stopwatch').textContent = formatTime(elapsedTime);
}

function startStopwatch() {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(updateStopwatch, 100);
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    elapsedTime = 0;
    document.querySelector('.stopwatch').textContent = formatTime(elapsedTime);
}

function saveDuration() {
    if (elapsedTime === 0) {
        alert('Cannot save a duration of 0 seconds.');
        return;
    }

    const durationsList = document.getElementById('durations-list');
    const durationItem = document.createElement('li');
    
    const durationText = document.createElement('span');
    durationText.textContent = formatTime(elapsedTime);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        durationsList.removeChild(durationItem);
    };

    durationItem.appendChild(durationText);
    durationItem.appendChild(deleteButton);
    durationsList.appendChild(durationItem);
}
function setupDatePicker() {
    const picker = document.getElementById('calendar-picker');
    picker.addEventListener('change', () => {
        const selectedDate = picker.value; // format: YYYY-MM-DD
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

// On load
setupDatePicker();


function updateDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, options);
}

updateDate();
