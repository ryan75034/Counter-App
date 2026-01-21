const statusEl = document.querySelector("#status");        // selects the paragraph that shows Neutral / words

const minusBtn = document.querySelector(".minus");         // selects the minus button
const plusBtn  = document.querySelector(".plus");          // selects the plus button
const resetBtn = document.querySelector(".reset");         // selects the reset button

const roller    = document.querySelector("#roller");       // selects the rolling container (moves up/down)
const numTop    = document.querySelector("#numTop");       // top number in the slot
const numBottom = document.querySelector("#numBottom");    // bottom number in the slot

let count = 0;                                             // stores the current number value

const numberWords = {                                     // converts numbers into words
  1:"One",2:"Two",3:"Three",4:"Four",5:"Five",
  6:"Six",7:"Seven",8:"Eight",9:"Nine",10:"Ten"
};

// updates the status text (Neutral / words)
function updateStatus() {                                  // function to update the status text
  if (count === 0) statusEl.textContent = "Neutral";       // if count is 0, show Neutral
  else if (count > 0) statusEl.textContent = numberWords[count] ?? count; // positive: show word or number
  else {                                                    // if count is negative
    const absValue = Math.abs(count);                      // make number positive
    const word = numberWords[absValue] ?? absValue;        // get word or number
    statusEl.textContent = `Negative ${word}`;             // show Negative + word
  }
}

// roll function: direction is "up" for +, "down" for -
function rollTo(newValue, direction) {                     // controls slot animation
  roller.classList.remove("roll-up", "roll-down");         // remove old animation classes

  if (direction === "up") {                                // if increasing number
    numTop.textContent = count;                            // current number on top
    numBottom.textContent = newValue;                      // next number below
    roller.style.transform = "translateY(0)";              // start at normal position
    void roller.offsetWidth;                               // force reflow to restart animation
    roller.classList.add("roll-up");                        // play roll-up animation
  } else {                                                  // if decreasing number
    numTop.textContent = newValue;                          // next number on top
    numBottom.textContent = count;                          // current number below
    roller.style.transform = "translateY(-80px)";           // start above view
    void roller.offsetWidth;                               // force reflow
    roller.classList.add("roll-down");                      // play roll-down animation
  }

  roller.addEventListener("animationend", function handler() { // runs after animation ends
    roller.removeEventListener("animationend", handler);   // remove listener to prevent stacking
    numTop.textContent = newValue;                          // set final number on top
    numBottom.textContent = newValue;                       // sync bottom number
    roller.style.transform = "translateY(0)";               // reset position
  });
}

// plus button action
plusBtn.addEventListener("click", () => {                   // when plus button is clicked
  const next = count + 1;                                   // calculate next number
  rollTo(next, "up");                                       // roll slot up
  count = next;                                             // update count value
  updateStatus();                                           // update status text
});

// minus button action
minusBtn.addEventListener("click", () => {                  // when minus button is clicked
  const next = count - 1;                                   // calculate next number
  rollTo(next, "down");                                     // roll slot down
  count = next;                                             // update count value
  updateStatus();                                           // update status text
});

// reset button action
resetBtn.addEventListener("click", () => {                  // when reset button is clicked
  count = 0;                                                 // reset count to zero
  numTop.textContent = 0;                                   // reset top number
  numBottom.textContent = 0;                                // reset bottom number
  updateStatus();                                           // update status text
});

// initial
updateStatus();                                             // set initial status on page load
