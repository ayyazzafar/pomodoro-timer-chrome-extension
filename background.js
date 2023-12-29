console.log("Service Worker starting");

// Create an alarm that goes off every minute
chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1,
});

let intervalId; // Reference for the setInterval

// Listen for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm triggered:", alarm);

  handleTrigger(alarm);
});

handleTrigger({ name: "pomodoroTimer" });

// Function to handle the alarm trigger
function handleTrigger(alarm) {
  if (alarm.name === "pomodoroTimer") {
    // Clear any existing interval to avoid overlaps
    clearInterval(intervalId);

    // Set up a new interval to run every second for 60 seconds
    let secondsPassed = 0;
    intervalId = setInterval(() => {
      updateTimer();

      secondsPassed++;
      if (secondsPassed >= 60) {
        clearInterval(intervalId); // Clear the interval after 60 seconds
      }
    }, 1000); // 1000 milliseconds = 1 second
  }
}

// Function to update the timer
function updateTimer() {
  chrome.storage.local.get(
    ["timer", "isRunning", "timeOption"],
    function (result) {
      if (result.isRunning) {
        let timer = result.timer + 1;
        // Check if the timer has reached the set timeOption
        if (timer >= 60 * result.timeOption) {
          showNotification(
            "Pomodoro Timer",
            `${result.timeOption} minutes have passed! Take a break!`
          );

          // Reset timer and stop it
          timer = 0;
          result.isRunning = false;
        }

        // Update the timer and isRunning status
        chrome.storage.local.set(
          { timer: timer, isRunning: result.isRunning },
          function () {}
        );
      }
    }
  );
}

// Function to show notifications
function showNotification(title, message) {
  chrome.notifications.create(
    "name-for-notification",
    {
      type: "basic",
      iconUrl: "icon.png",
      title: title,
      message: message,
    },
    function () {}
  );
}

// Initialize default values if not already set
chrome.storage.local.get(
  ["timer", "isRunning", "timeOption"],
  function (result) {
    chrome.storage.local.set(
      {
        timer: result.timer ?? 0,
        isRunning: result.isRunning ?? false,
        timeOption: result.timeOption ?? 25,
      },
      function () {
        console.log("Initial setup complete");
      }
    );
  }
);
