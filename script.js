const statusEl = document.querySelector("#status");        // selects the paragraph that shows status

const minusBtn = document.querySelector(".minus");         // selects the minus button
const plusBtn  = document.querySelector(".plus");          // selects the plus button
const resetBtn = document.querySelector(".reset");         // selects the reset button

const roller    = document.querySelector("#roller");       // selects the rolling container (moves up/down)
const numTop    = document.querySelector("#numTop");       // top number in the slot
const numBottom = document.querySelector("#numBottom");    // bottom number in the slot

let count = 0;                                             // stores the current number value
let isRolling = false;                                     // prevents click spam during animation

const numberWords = {                                      // converts numbers into words
  1:"One",2:"Two",3:"Three",4:"Four",5:"Five",
  6:"Six",7:"Seven",8:"Eight",9:"Nine",10:"Ten"
};

function formatWord(n) {                                   // returns word for 1–10, else number
  return numberWords[Math.abs(n)] ?? Math.abs(n);
}

function updateStatus() {                                  // updates the status text
  if (count === 0) statusEl.textContent = "Neutral";       // if count is 0, show Neutral
  else if (count > 0) statusEl.textContent = `Positive ${formatWord(count)}`; // positive label
  else statusEl.textContent = `Negative ${formatWord(count)}`;                // negative label
}

function rollTo(newValue, direction) {                     // controls slot animation
  isRolling = true;                                        // lock inputs during roll
  roller.classList.remove("roll-up", "roll-down");         // remove old animation classes

  if (direction === "up") {                                // if increasing number
    numTop.textContent = count;                            // current number on top
    numBottom.textContent = newValue;                      // next number below
    roller.style.transform = "translateY(0)";              // start at normal position
    void roller.offsetWidth;                               // force reflow to restart animation
    roller.classList.add("roll-up");                       // play roll-up animation
  } else {                                                 // if decreasing number
    numTop.textContent = newValue;                         // next number on top
    numBottom.textContent = count;                         // current number below
    roller.style.transform = "translateY(-80px)";          // start above view
    void roller.offsetWidth;                               // force reflow
    roller.classList.add("roll-down");                     // play roll-down animation
  }

  roller.addEventListener("animationend", function handler() { // runs after animation ends
    roller.removeEventListener("animationend", handler);   // remove listener to prevent stacking
    numTop.textContent = newValue;                         // set final number on top
    numBottom.textContent = newValue;                      // sync bottom number
    roller.style.transform = "translateY(0)";              // reset position
    isRolling = false;                                     // unlock inputs
  });
}

function changeCount(delta) {                              // central place to change count
  if (isRolling) return;                                   // ignore if mid-animation
  const next = count + delta;                               // compute next
  rollTo(next, delta > 0 ? "up" : "down");                 // animate
  count = next;                                            // save
  updateStatus();                                          // update label
}

plusBtn.addEventListener("click", () => changeCount(1));   // plus button
minusBtn.addEventListener("click", () => changeCount(-1)); // minus button

resetBtn.addEventListener("click", () => {                 // reset button
  if (isRolling) return;                                   // ignore if mid-animation
  count = 0;                                               // reset count to zero
  numTop.textContent = 0;                                  // reset top number
  numBottom.textContent = 0;                               // reset bottom number
  updateStatus();                                          // update status text
});

document.addEventListener("keydown", (e) => {              // keyboard shortcuts (bonus)
  if (e.key === "+") changeCount(1);                       // plus key
  if (e.key === "-") changeCount(-1);                      // minus key
  if (e.key.toLowerCase() === "r") resetBtn.click();       // r resets
});

document.addEventListener("keydown", (e) => {
  if (isRolling) return;

  if (e.key === "+" || e.key === "=") plusBtn.click();      // + (or = without shift)
  if (e.key === "-") minusBtn.click();                      // -
  if (e.key.toLowerCase() === "r") resetBtn.click();        // r
});


updateStatus();                                            // initial status on page load
