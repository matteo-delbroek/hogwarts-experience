// Game State
const state = {
  house: "Unsorted",
  points: 0,
  galleons: 50,
  cauldron: [],
  inventory: ["Hogwarts Acceptance Letter", "Pewter Cauldron (Size 2)"],
  lastMirrorIndex: -1
};

const houseConfig = {
  Gryffindor: { initial: "G", color: "#740001" },
  Slytherin: { initial: "S", color: "#1a472a" },
  Ravenclaw: { initial: "R", color: "#0e1a40" },
  Hufflepuff: { initial: "H", color: "#9a7414" }
};

// Enter Castle transition
document.getElementById("enter-castle-btn").addEventListener("click", () => {
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  renderShop();
  renderTrunk();
});

// Medallion Navigation (Single Unified Screen)
document.querySelectorAll(".medallion").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".medallion").forEach((m) => m.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.room;
    document.querySelectorAll(".room-scene").forEach((room) => {
      room.classList.remove("active-room");
    });
    document.getElementById(`room-${target}`).classList.add("active-room");
  });
});

function updateHUD() {
  document.getElementById("points-count").textContent = state.points;
  document.getElementById("galleons-count").textContent = state.galleons;
  document.getElementById("house-name-label").textContent = state.house;
}

// 1. SORTING CEREMONY
const sortingQuestions = [
  {
    prompt: "“Which path calls to you when night falls over Hogwarts?”",
    choices: [
      { label: "A secret passage behind a tapestry", house: "Gryffindor" },
      { label: "The quiet upper balconies of the library", house: "Ravenclaw" },
      { label: "The warm kitchens near the Great Hall", house: "Hufflepuff" },
      { label: "The torch-lit corridors beneath the lake", house: "Slytherin" }
    ]
  },
  {
    prompt: "“Before the Mirror of Erised, what would you refuse to do?”",
    choices: [
      { label: "Abandon a friend in danger", house: "Gryffindor" },
      { label: "Leave a riddle unsolved", house: "Ravenclaw" },
      { label: "Break a promise you made", house: "Hufflepuff" },
      { label: "Settle for second place", house: "Slytherin" }
    ]
  },
  {
    prompt: "“Which artefact from the Philosopher’s Stone trials fascinates you?”",
    choices: [
      { label: "The giant Wizard’s Chessboard", house: "Gryffindor" },
      { label: "Snape’s logic bottle riddle", house: "Ravenclaw" },
      { label: "Sprout’s Devil’s Snare", house: "Hufflepuff" },
      { label: "The Stone of Immortality itself", house: "Slytherin" }
    ]
  }
];

let qIndex = 0;
let houseTally = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };

document.getElementById("begin-sorting-btn").addEventListener("click", () => {
  qIndex = 0;
  houseTally = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  document.getElementById("begin-sorting-btn").classList.add("hidden");
  renderQuestion();
});

function renderQuestion() {
  const current = sortingQuestions[qIndex];
  document.getElementById("hat-dialogue").textContent = current.prompt;
  const box = document.getElementById("quiz-choices");
  box.innerHTML = "";

  current.choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "choice-tile";
    btn.textContent = c.label;
    btn.onclick = () => {
      houseTally[c.house]++;
      qIndex++;
      if (qIndex < sortingQuestions.length) renderQuestion();
      else completeSorting();
    };
    box.appendChild(btn);
  });
}

function completeSorting() {
  const chosen = Object.keys(houseTally).reduce((a, b) =>
    houseTally[a] >= houseTally[b] ? a : b
  );
  state.house = chosen;
  state.points += 25;

  document.getElementById("quiz-choices").innerHTML = "";
  document.getElementById("hat-dialogue").textContent =
    `“Right then... better be ${chosen.toUpperCase()}!” (+25 House Points awarded)`;

  const shield = document.getElementById("crest-shield");
  shield.style.background = houseConfig[chosen].color;
  document.getElementById("crest-initial").textContent = houseConfig[chosen].initial;

  const btn = document.getElementById("begin-sorting-btn");
  btn.textContent = "Re-take the Ceremony";
  btn.classList.remove("hidden");
  updateHUD();
}

// 2. POTIONS DUNGEON
function addIngredient(name) {
  if (state.cauldron.length >= 3) return;
  state.cauldron.push(name);
  document.getElementById("cauldron-slots").textContent = state.cauldron.join(" + ");

  const liquid = document.getElementById("cauldron-liquid");
  const colors = ["#38bdf8", "#a855f7", "#10b981"];
  liquid.style.background = colors[state.cauldron.length - 1];
}

function clearCauldron() {
  state.cauldron = [];
  document.getElementById("cauldron-slots").textContent = "Empty Cauldron (0/3)";
  document.getElementById("cauldron-liquid").style.background = "#1e293b";
  document.getElementById("potion-result").textContent = "Your pewter cauldron is clean and ready.";
}

function brewCauldron() {
  if (state.cauldron.length < 3) {
    document.getElementById("potion-result").textContent = "Add three ingredients before stirring!";
    return;
  }

  const mix = [...state.cauldron].sort().join("|");
  const liquid = document.getElementById("cauldron-liquid");
  const out = document.getElementById("potion-result");

  if (mix === "Asphodel|Bezoar|Unicorn Hair") {
    liquid.style.background = "#fbbf24";
    liquid.style.boxShadow = "0 0 25px #fbbf24";
    out.textContent = "Success! You brewed a shimmering Draught of Living Death (+20 House Points).";
    state.points += 20;
  } else if (mix === "Boomslang Skin|Dragon Liver|Phoenix Tear") {
    liquid.style.background = "#34d399";
    liquid.style.boxShadow = "0 0 25px #34d399";
    out.textContent = "Brilliant! Liquid Luck (Felix Felicis) swirls in the cauldron (+30 House Points).";
    state.points += 30;
  } else {
    liquid.style.background = "#ef4444";
    liquid.style.boxShadow = "0 0 25px #ef4444";
    out.textContent = "Thick purple smoke erupts from the cauldron! Try combining Bezoar, Asphodel & Unicorn Hair.";
  }

  state.cauldron = [];
  document.getElementById("cauldron-slots").textContent = "Brew Complete";
  updateHUD();
}

// 3. CHARMS CLASS
function castSpell(raw) {
  const spell = raw.trim().toLowerCase();
  const feedback = document.getElementById("spell-feedback");
  const feather = document.getElementById("feather-object");
  const lock = document.getElementById("corridor-lock");
  const flame = document.getElementById("brazier-flame");

  if (spell === "lumos") {
    document.body.classList.add("lumos-lit");
    feedback.textContent = "Lumos! Silvery light illuminates the entire classroom (+5 House Points).";
    state.points += 5;
  } else if (spell === "nox") {
    document.body.classList.remove("lumos-lit");
    feedback.textContent = "Nox! The light extinguishes cleanly.";
  } else if (spell === "wingardium leviosa" || spell === "leviosa") {
    feather.classList.add("levitating");
    feedback.textContent = "Swish and flick! The feather floats gracefully above the desk (+10 House Points).";
    state.points += 10;
    setTimeout(() => feather.classList.remove("levitating"), 2600);
  } else if (spell === "alohomora") {
    lock.textContent = "UNLOCKED";
    lock.style.color = "#4ade80";
    feedback.textContent = "Alohomora! The lock to the third-floor corridor clicks open (+10 House Points).";
    state.points += 10;
  } else if (spell === "incendio") {
    flame.textContent = "BLAZING";
    flame.classList.add("ignited");
    feedback.textContent = "Incendio! Warm golden flames roar to life in the brass brazier (+10 House Points).";
    state.points += 10;
  } else {
    feedback.textContent = "Harmless sparks shoot from your wand. Try Lumos, Nox, Wingardium Leviosa, Alohomora, or Incendio.";
  }
  updateHUD();
}

function castTypedSpell() {
  const input = document.getElementById("spell-input");
  castSpell(input.value);
  input.value = "";
}

document.getElementById("spell-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") castTypedSpell();
});

// 4. MIRROR OF ERISED (RANDOM VISIONS)
const erisedVisions = [
  "You see yourself holding the Philosopher’s Stone—and feel it drop quietly into your trouser pocket.",
  "You are standing in the Great Hall while banners in your House colors rain down from the enchanted ceiling.",
  "You see yourself holding a pair of thick, hand-knitted woolen socks. One can never have enough socks.",
  "You are flying high above the pitch on a Nimbus 2000, the Golden Snitch gleaming in your raised hand.",
  "You see yourself surrounded by every rare Chocolate Frog card in existence—including Nicolas Flamel.",
  "You are shaking hands with Albus Dumbledore as the House Cup is awarded to your House."
];

function gazeIntoMirror() {
  let idx;
  do {
    idx = Math.floor(Math.random() * erisedVisions.length);
  } while (idx === state.lastMirrorIndex);

  state.lastMirrorIndex = idx;
  document.getElementById("mirror-vision").textContent = `“${erisedVisions[idx]}”`;
}

// 5. DIAGON ALLEY SHOP & TRUNK
const shopItems = [
  { name: "Holly & Phoenix Wand", price: 15, desc: "11 inches, supple. Shares a core with a famous wand." },
  { name: "Snowy Owl", price: 20, desc: "Carries post across Britain in all weathers." },
  { name: "Nimbus 2000", price: 30, desc: "The fastest racing broomstick in Diagon Alley." },
  { name: "Chocolate Frog Box", price: 5, desc: "Includes a collectible Dumbledore wizard card." }
];

function renderShop() {
  const grid = document.getElementById("diagon-shop");
  grid.innerHTML = "";
  shopItems.forEach((item) => {
    const owned = state.inventory.includes(item.name);
    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <button class="royal-pill-btn" ${owned ? "disabled" : ""} onclick="buyItem('${item.name}', ${item.price})">
        ${owned ? "In Trunk" : `${item.price} Galleons`}
      </button>
    `;
    grid.appendChild(card);
  });
}

function buyItem(name, price) {
  if (state.galleons < price || state.inventory.includes(name)) return;
  state.galleons -= price;
  state.inventory.push(name);
  updateHUD();
  renderShop();
  renderTrunk();
}

function renderTrunk() {
  const list = document.getElementById("trunk-inventory");
  list.innerHTML = "";
  state.inventory.forEach((item) => {
    const div = document.createElement("div");
    div.className = "trunk-card";
    div.textContent = item;
    list.appendChild(div);
  });
}

function triggerPlatform() {
  const el = document.getElementById("platform-brick");
  el.textContent = "The archway opens onto Platform 9¾ — scarlet steam billows from the Hogwarts Express! (+15 House Points)";
  state.points += 15;
  updateHUD();
  el.onclick = null;
}

// WAND SPARK CURSOR TRAIL
const canvas = document.getElementById("wand-canvas");
const ctx = canvas.getContext("2d");
let sparks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

window.addEventListener("mousemove", (e) => {
  for (let i = 0; i < 2; i++) {
    sparks.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      life: 1
    });
  }
});

function animateSparks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparks.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.03;
    ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(p.life, 0)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2 * Math.max(p.life, 0), 0, Math.PI * 2);
    ctx.fill();
  });
  sparks = sparks.filter((p) => p.life > 0);
  requestAnimationFrame(animateSparks);
}
animateSparks();