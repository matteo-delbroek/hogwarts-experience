const questions = [
  {
    q: "“Which quality do you value most when stepping into the unknown?”",
    options: [
      { text: "Courage to stand up for others", house: "Gryffindor" },
      { text: "Curiosity and a sharp mind", house: "Ravenclaw" },
      { text: "Unwavering loyalty to friends", house: "Hufflepuff" },
      { text: "Determination to achieve greatness", house: "Slytherin" }
    ]
  },
  {
    q: "“Which subject inside the castle intrigues you the most?”",
    options: [
      { text: "Defense Against the Dark Arts", house: "Gryffindor" },
      { text: "Charms and Ancient Runes", house: "Ravenclaw" },
      { text: "Herbology in the greenhouses", house: "Hufflepuff" },
      { text: "Potions down in the dungeons", house: "Slytherin" }
    ]
  },
  {
    q: "“A troll is loose in the dungeons. What is your instinct?”",
    options: [
      { text: "Rush to make sure no one is trapped", house: "Gryffindor" },
      { text: "Outsmart it using the environment", house: "Ravenclaw" },
      { text: "Alert the prefects and guard the group", house: "Hufflepuff" },
      { text: "Slip away quietly and find an advantage", house: "Slytherin" }
    ]
  }
];

const houseThemes = {
  Gryffindor: { seal: "G", color: "#740001" },
  Slytherin: { seal: "S", color: "#1a472a" },
  Ravenclaw: { seal: "R", color: "#0e1a40" },
  Hufflepuff: { seal: "H", color: "#8f6b14" }
};

let currentQuestion = 0;
let scores = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };

const startBtn = document.getElementById("start-quiz-btn");
const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const resultEl = document.getElementById("sorting-result");
const badgeEl = document.getElementById("house-badge");
const sealEl = document.getElementById("house-seal");

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
    btn.className = "ink-btn";
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
  questionEl.textContent = "“Ah, right then... hmm... right. Okay... better be:”";

  const sortedHouse = Object.keys(scores).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );

  resultEl.textContent = `— ${sortedHouse.toUpperCase()} —`;
  resultEl.classList.remove("hidden");

  badgeEl.textContent = `Sorted into ${sortedHouse}`;
  sealEl.textContent = houseThemes[sortedHouse].seal;
  sealEl.style.background = houseThemes[sortedHouse].color;

  startBtn.textContent = "Try the Hat Again";
  startBtn.classList.remove("hidden");
}

function castSpell(spellName) {
  const cleanSpell = spellName.trim().toLowerCase();
  const feedback = document.getElementById("spell-feedback");
  const feather = document.getElementById("feather");
  const chest = document.getElementById("locked-chest");

  if (cleanSpell === "lumos") {
    document.body.classList.add("lumos-active");
    feedback.textContent = "A warm, silvery light blooms from the tip of your wand.";
  } else if (cleanSpell === "nox") {
    document.body.classList.remove("lumos-active");
    feedback.textContent = "The glow fades, leaving the room bathed in candlelight once more.";
  } else if (cleanSpell === "wingardium leviosa" || cleanSpell === "leviosa") {
    feather.classList.add("floating");
    feedback.textContent = "With a clean swish and flick, the feather rises effortlessly off the desk.";
    setTimeout(() => feather.classList.remove("floating"), 2600);
  } else if (cleanSpell === "alohomora") {
    chest.textContent = "Heavy Oak Door [Unlocked]";
    feedback.textContent = "A soft metallic click echoes through the corridor — the lock gives way.";
  } else {
    feedback.textContent = "A few harmless red sparks fizzle from your wand. Try Lumos, Nox, Wingardium Leviosa, or Alohomora.";
  }
}

function castTypedSpell() {
  const input = document.getElementById("spell-input");
  castSpell(input.value);
  input.value = "";
}

document.getElementById("spell-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") castTypedSpell();
});

function revealDesire() {
  const badgeText = badgeEl.textContent;
  const mirrorText = document.getElementById("mirror-text");
  if (badgeText.includes("Sorted into")) {
    const house = badgeText.replace("Sorted into ", "");
    mirrorText.textContent = `“You see yourself standing in the Great Hall, lifting the House Cup for ${house}.”`;
  } else {
    mirrorText.textContent = "“You see yourself reaching into your pocket and feeling the weight of the Philosopher’s Stone.”";
  }
}

function hideDesire() {
  document.getElementById("mirror-text").textContent =
    "Step closer and gaze into the golden-framed glass...";
}

document.getElementById("secret-brick").addEventListener("click", () => {
  const brick = document.getElementById("secret-brick");
  brick.textContent = "Platform 9¾ — The Hogwarts Express departs at 11 o'clock!";
});