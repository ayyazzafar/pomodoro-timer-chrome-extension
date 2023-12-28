chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1 / 60, // 1 second
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(
      ["timer", "isRunning", "timeOption"],
      function (result) {
        if (result.isRunning) {
          let timer = result.timer + 1;
          let isRunning = result.isRunning;

          // Check if the timer has reached the set timeOption
          if (timer >= 60 * result.timeOption) {
            console.log("Time's up!");
            showNotification(
              "Pomodoro Timer",
              `${result.timeOption} minutes have passed! Take a break!`
            );

            // Reset timer and stop it
            timer = 0;
            isRunning = false;
          }

          // Update the timer and isRunning status
          chrome.storage.local.set(
            { timer: timer, isRunning: isRunning },
            function () {
              console.log("Timer updated");
            }
          );
        }
      }
    );
  }
});

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
        timer: "timer" in result ? result.timer : 0,
        isRunning: "isRunning" in result ? result.isRunning : false,
        timeOption: "timeOption" in result ? result.timeOption : 25,
      },
      function () {
        console.log("Initial setup complete");
      }
    );
  }
);
