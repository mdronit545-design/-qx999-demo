const loginBox = document.getElementById("loginBox");
const app = document.getElementById("app");

const passwordInput =
  document.getElementById("password");

const loginBtn =
  document.getElementById("loginBtn");

const loginError =
  document.getElementById("loginError");

const delayInput =
  document.getElementById("delay");

const afterTradeInput =
  document.getElementById("afterTrade");

const directionInput =
  document.getElementById("direction");

const startBtn =
  document.getElementById("startBtn");

const stopBtn =
  document.getElementById("stopBtn");

const actionDisplay =
  document.getElementById("actionDisplay");

const status =
  document.getElementById("status");

const historyList =
  document.getElementById("historyList");


let running = false;
let timer = null;
let stopTimer = null;


// -------------------------
// LOGIN
// -------------------------

loginBtn.addEventListener("click", login);

passwordInput.addEventListener("keydown", e => {

  if (e.key === "Enter") {
    login();
  }

});


async function login() {

  const password =
    passwordInput.value.trim();

  if (!password) {

    loginError.textContent =
      "Enter password";

    return;
  }

  loginBtn.disabled = true;

  loginError.textContent =
    "Checking...";

  try {

    const response =
      await fetch("/api/check-password", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          password
        })

      });


    const data =
      await response.json();


    if (!response.ok || !data.valid) {

      loginError.textContent =
        "Wrong password";

      return;
    }


    loginBox.classList.add("hidden");

    app.classList.remove("hidden");

    loginError.textContent = "";

    passwordInput.value = "";

  } catch (error) {

    loginError.textContent =
      "Network error";

  } finally {

    loginBtn.disabled = false;

  }

}


// -------------------------
// DIRECTION
// -------------------------

function getDirection() {

  const mode =
    directionInput.value;


  if (mode === "up") {
    return "UP";
  }


  if (mode === "down") {
    return "DOWN";
  }


  return Math.random() < .5
    ? "UP"
    : "DOWN";

}


// -------------------------
// DEMO ACTION
// -------------------------

function demoTrade() {

  if (!running) {
    return;
  }


  const direction =
    getDirection();


  actionDisplay.textContent =
    direction;


  actionDisplay.className =
    "action " +
    direction.toLowerCase();


  status.textContent =
    "Demo action executed";


  addHistory(direction);


  const afterTrade =
    Math.max(
      0,
      Math.min(
        300,
        Number(afterTradeInput.value) || 0
      )
    );


  if (afterTrade > 0) {

    clearTimeout(stopTimer);

    stopTimer =
      setTimeout(() => {

        stopAuto();

      }, afterTrade * 1000);

  }


  scheduleNext();

}


// -------------------------
// AUTO LOOP
// -------------------------

function scheduleNext() {

  if (!running) {
    return;
  }


  const delay =
    Math.max(
      1,
      Math.min(
        120,
        Number(delayInput.value) || 10
      )
    );


  status.textContent =
    `Next demo action in ${delay}s`;


  clearTimeout(timer);


  timer =
    setTimeout(() => {

      demoTrade();

    }, delay * 1000);

}


// -------------------------
// START
// -------------------------

startBtn.addEventListener(
  "click",
  startAuto
);


function startAuto() {

  if (running) {
    return;
  }


  running = true;

  actionDisplay.textContent =
    "SCANNING";


  actionDisplay.className =
    "action";


  status.textContent =
    "Auto demo started";


  scheduleNext();

}


// -------------------------
// STOP
// -------------------------

stopBtn.addEventListener(
  "click",
  stopAuto
);


function stopAuto() {

  running = false;


  clearTimeout(timer);
  clearTimeout(stopTimer);


  timer = null;
  stopTimer = null;


  actionDisplay.textContent =
    "STOPPED";


  actionDisplay.className =
    "action";


  status.textContent =
    "Auto mode stopped";

}


// -------------------------
// HISTORY
// -------------------------

function addHistory(direction) {

  const item =
    document.createElement("div");


  item.className =
    "history-item";


  const time =
    new Date().toLocaleTimeString();


  item.innerHTML = `
    <span class="${direction.toLowerCase()}">
      ${direction}
    </span>

    <span>
      ${time}
    </span>
  `;


  historyList.prepend(item);


  while (
    historyList.children.length > 30
  ) {

    historyList.lastElementChild.remove();

  }

}
