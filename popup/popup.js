let tasks = [];

function updateTime() {
  chrome.storage.local.get(["timer", "timeOption"], function (result) {
    const time = document.getElementById("time");
    let totalSecondsRemaining = result.timeOption * 60 - result.timer;
    let minutes = Math.floor(totalSecondsRemaining / 60)
      .toString()
      .padStart(2, "0");
    let seconds = (totalSecondsRemaining % 60).toString().padStart(2, "0");

    time.innerHTML = `${minutes}:${seconds}`;
  });
}

updateTime();

setInterval(updateTime, 1000);

let startTimerBtn = document.getElementById("start-timer-btn");
startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], function (result) {
    chrome.storage.local.set({ isRunning: !result.isRunning }, function () {
      console.log("Timer started");

      if (!result.isRunning) {
        startTimerBtn.innerHTML = "Pause Timer";
      } else {
        startTimerBtn.innerHTML = "Start Timer";
      }
    });
  });
});

let resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set({ timer: 0, isRunning: false }, function () {
    console.log("Timer reset");

    startTimerBtn.innerHTML = "Start Timer";

    updateTime();
  });
});

// Get tasks from storage

chrome.storage.local.get(["tasks"], function (result) {
  tasks = result.tasks || [];
  renderTasks(tasks);
});

function renderTasks(tasks) {
  // Clear all tasks
  document.getElementById("task-container").innerHTML = "";
  // Render all tasks

  tasks.forEach((task, index) => {
    const taskRow = renderTaskRow(index, tasks);
    document.getElementById("task-container").appendChild(taskRow);
  });
}

const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => {
  tasks.push("");
  renderTasks(tasks);
  saveTasks(tasks);
});

function saveTasks(tasks) {
  chrome.storage.local.set({ tasks: tasks }, function () {
    console.log("Tasks saved");
  });
}

function renderTaskRow(index, tasks) {
  const taskRow = document.createElement("div");
  taskRow.className = "task-row"; // Added class for styling

  const text = document.createElement("input");
  text.type = "text";
  text.value = tasks[index];
  text.className = "task-text";
  text.placeholder = "Enter task here";

  text.addEventListener("change", (event) => {
    tasks[index] = event.target.value;
    console.log(tasks);
    saveTasks(tasks);
  });

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "x";
  removeBtn.addEventListener("click", () => {
    deleteTask(index);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(removeBtn);

  return taskRow;
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(tasks);
  saveTasks(tasks);
}
