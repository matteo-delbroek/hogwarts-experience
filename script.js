const questions = [
  {
    q: "1. Which quality do you value most when facing danger?",
    options: [
      { text: "Bravery and daring", house: "Gryffindor" },
      { text: "Wit and wisdom", house: "Ravenclaw" },
      { text: "Loyalty and patience", house: "Hufflepuff" },
      { text: "Ambition and resourcefulness", house: "Slytherin" }
    ]
  },
  {
    q: "2. What would you most like to study at Hogwarts?",
    options: [
      { text: "Defense Against the Dark Arts", house: "Gryffindor" },
      { text: "Ancient Runes & Charms", house: "Ravenclaw" },
      { text: "Herbology & Magical Creatures", house: "Hufflepuff" },
      { text: "Potions & Mind Arts", house: "Slytherin" }
    ]
  },
  {
    q: "3. Which object in Diagon Alley catches your eye?",
    options: [
      { text: "A scarlet broomstick", house: "Gryffindor" },
      { text: "A stack of rare spellbooks", house: "Ravenclaw" },
      { text: "A friendly snowy owl", house: "Hufflepuff" },
      { text: "A silver-plated cauldron", house: "Slytherin" }
    ]
  }
];

const houseColors = {
  Gryffindor: "#740001",
  Slytherin: "#1a472a",
  Ravenclaw: "#0e1a40",
  Hufflepuff: "#ecb939"
};

let currentQuestion = 0;
let scores = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };

const startBtn = document.getElementById("start-quiz-btn");
const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const resultEl = document.getElementById("sorting-result");
const badgeEl = document.getElementById("house-badge");

startBtn.addEventListener("click", () => {
  currentQuestion = 0;
  scores = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  resultEl.classList.add("hidden");
  startBtn.classList.add("hidden");
  showQuestion();
});

function showQuestion() {
  const item = questions[currentQuestion];
  questionEl.textContent = item.q;
  optionsEl.innerHTML = "";

  item.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "magic-btn";
    btn.textContent = opt.text;
    btn.onclick = () => selectAnswer(opt.house);
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(house) {
  scores[house]++;
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    finishSorting();
  }
}

function finishSorting() {
  optionsEl.innerHTML = "";
  questionEl.textContent = "Hmm, difficult. Very difficult... Better be:";

  const sortedHouse = Object.keys(scores).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );

  resultEl.innerHTML = `<h3>✨ ${sortedHouse.toUpperCase()}! ✨</h3>`;
  resultEl.classList.remove("hidden");
  badgeEl.textContent = `House: ${sortedHouse}`;
  badgeEl.style.backgroundColor = houseColors[sortedHouse];
  startBtn.textContent = "Sort Again";
  startBtn.classList.remove("hidden");
}

// Spell casting mechanics
function castSpell(spellName) {
  const cleanSpell = spellName.trim().toLowerCase();
  const feedback = document.getElementById("spell-feedback");
  const feather = document.getElementById("feather");
  const chest = document.getElementById("locked-chest");

  if (cleanSpell === "lumos") {
    document.body.classList.add("lumos-active");
    feedback.textContent = "💡 Lumos! Bright light erupts from the tip of your wand.";
  } else if (cleanSpell === "nox") {
    document.body.classList.remove("lumos-active");
    feedback.textContent = "🌑 Nox! The light extinguishes back into darkness.";
  } else if (cleanSpell === "wingardium leviosa" || cleanSpell === "leviosa") {
    feather.classList.add("floating");
    feedback.textContent = "🪶 Swish and flick! The feather gracefully floats into the air.";
    setTimeout(() => feather.classList.remove("floating"), 2500);
  } else if (cleanSpell === "alohomora") {
    chest.textContent = "🔓 Third-Floor Corridor Door (Unlocked — Fluffy awaits!)";
    feedback.textContent = "🗝️ Alohomora! The lock clicks open.";
  } else {
    feedback.textContent = "💨 Sparks fizzle from your wand. Try Lumos, Nox, Wingardium Leviosa, or Alohomora!";
  }
}

function castTypedSpell() {
  const input = document.getElementById("spell-input");
  castSpell(input.value);
  input.value = "";
}

// Mirror of Erised Easter Egg
function revealDesire() {
  const house = badgeEl.textContent.replace("House: ", "");
  const mirrorText = document.getElementById("mirror-text");
  if (house === "Unsorted") {
    mirrorText.textContent = "You see yourself holding the Philosopher's Stone — and winning the House Cup!";
  } else {
    mirrorText.textContent = `You see yourself holding the House Cup in glory for ${house}!`;
  }
}

function hideDesire() {
  document.getElementById("mirror-text").textContent =
    "Hover over the golden glass to gaze into the mirror...";
}

// Secret Platform 9 3/4 Easter Egg
document.getElementById("secret-brick").addEventListener("click", () => {
  alert("🚂 All aboard the Hogwarts Express! Next stop: Hogsmeade Station.");
});