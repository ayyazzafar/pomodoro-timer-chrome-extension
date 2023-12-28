let timeOption = document.getElementById("time-option");
timeOption.addEventListener("change", (event) => {
  const value = event.target.value;

  if (value < 1 || value > 60) {
    timeOption.value = 25;
  }
});

const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
  const value = timeOption.value;

  chrome.storage.local.set(
    { timeOption: value, timer: 0, isRunning: false },
    function () {
      console.log("Time option updated");
    }
  );
});

chrome.storage.local.get(["timeOption"], function (result) {
  timeOption.value = result.timeOption || 25;
});
//
