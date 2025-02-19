// Splash Screen Timer
setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("app").style.display = "block";
}, 3000);



// Task Data Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let category = "";
let currentDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
updateDateHeader();

// Page Navigation (Next/Previous Day)
function updateDateHeader() {
    document.getElementById("current-date").innerText = formatDate(currentDate);
    displayTasks();
    calculateWastedTime();
}

function prevDay() {
    let date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    currentDate = date.toISOString().split("T")[0];
    updateDateHeader();
}

function nextDay() {
    let date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    currentDate = date.toISOString().split("T")[0];
    updateDateHeader();
}

function formatDate(dateString) {
    let options = { weekday: "long", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
}

// Open & Close Modal
document.getElementById("add-task-btn").addEventListener("click", function () {
    document.getElementById("task-modal").style.display = "flex";
});

document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("task-modal").style.display = "none";
});

// Set Task Category
function setCategory(selected) {
    category = selected;
}

// Add Task
document.getElementById("save-task").addEventListener("click", function () {
    let taskName = document.getElementById("task-name").value.trim();
    let taskStartTime = document.getElementById("task-start-time").value;
    let taskDuration = parseInt(document.getElementById("task-duration").value.trim());

    if (taskName && taskStartTime && taskDuration) {
        if (!tasks[currentDate]) {
            tasks[currentDate] = [];
        }

        let task = {
            category,
            name: taskName,
            startTime: taskStartTime,
            duration: taskDuration
        };

        tasks[currentDate].push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
        calculateWastedTime();
        document.getElementById("task-modal").style.display = "none";
    } else {
        alert("Please fill out all fields.");
    }
});

// Display Tasks for Selected Date
function displayTasks() {
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    if (!tasks[currentDate] || tasks[currentDate].length === 0) {
        taskList.innerHTML = "<p>No tasks scheduled.</p>";
        return;
    }

    tasks[currentDate].forEach((task, index) => {
        let div = document.createElement("div");
        div.className = "task-item";
        div.innerHTML = `<div>
                            <span class="task-time">${task.startTime}</span> 
                            <strong>${task.name}</strong> (${task.duration} mins)
                         </div>
                         <button class="delete-btn" onclick="deleteTask(${index})">X</button>`;
        taskList.appendChild(div);
    });
}

// Delete Task
function deleteTask(index) {
    tasks[currentDate].splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    calculateWastedTime();
}

// Calculate Wasted Time (Untracked Time)
function calculateWastedTime() {
    let totalAvailableTime = 24 * 60; // 1440 minutes (24 hours)
    let recordedTime = (tasks[currentDate] || []).reduce((sum, task) => sum + task.duration, 0);
    let wastedTime = totalAvailableTime - recordedTime;

    if (wastedTime < 0) wastedTime = 0;

    document.getElementById("wasted-time").innerText = `${wastedTime} mins`;
    updateWastedTimeBar(wastedTime, totalAvailableTime);
}

// Update Wasted Time Progress Bar
function updateWastedTimeBar(wasted, total) {
    let percentage = (wasted / total) * 100;
    document.getElementById("wasted-time-fill").style.width = `${percentage}%`;
}

// Initialize
displayTasks();
calculateWastedTime();
