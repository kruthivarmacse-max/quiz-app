

const quizData = [
  {
    question: "Which language runs in a browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correctIndex: 3
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style Syntax",
      "Colorful Style Sheets"
    ],
    correctIndex: 1
  },
  {
    question: "What year was JavaScript created?",
    options: ["1995", "2000", "1989", "2005"],
    correctIndex: 0
  },
  {
    question:"What does HTML stand form?",
    options:[
      "Hypertext Markup language",
      "Hypertext Market language",
      "hypertext Makeup language",
      "Hyperlevel Markup language"
    ],
    correctIndex:0
  },
  {
  question:"Which of the following is an example of an operating system?",
  options:[
    "MS Word",
    "Google Chrome",
    "Windows",
    "Python"
  ],
  correctIndex:2
  },
  {
    question:"What does CPU stands for?",
    options:[
      "Central Processing Unit",
      "Computer Processing Unit",
      "Central Program Unit",
      "Control Processing Unit"
    ],
    correctIndex:0
  },
  {
    question:" Which of the following is a relational database?",
    options:[
      "MongoDB",
      "MySQL",
      "Hadoop",
      "Redis"
    ],
    correctIndex:1
  },
  {
    question:"Which of the following is a volatile memory?",
    options:[
      "ROM",
      "SSD",
      "RAM",
      "hard Disk"
    ],
    correctIndex:2
  },
{
  question:"Which part of computer is called the “brain”?",
  options:[
    "RAM",
    "Hard Disk",
    "CPU",
    "Monitor"
  ],
  correctIndex:2
},
{
  question:"Which software is used to type protocol?",
  options:[
    "MS Word",
    "Paint",
    "Calculator",
    "Chrome"
  ],
  correctIndex:0
}
];

// DOM Elements
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.querySelector(".start-screen");
const quizScreen = document.querySelector(".quiz-screen");
const resultScreen = document.querySelector(".result-screen");

const usernameInput = document.getElementById("username");
const finalResult = document.getElementById("finalResult");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 60;

// Disable start initially
startBtn.disabled = true;

// Enable button only if name >= 3 characters
usernameInput.addEventListener("input", () => {
  let name = usernameInput.value.trim();
  startBtn.disabled = name.length < 3;
});

// Start Quiz
startBtn.addEventListener("click", () => {
  let name = usernameInput.value.trim();

  if (name.length < 3) {
    alert("Please enter your full name (minimum 3 characters).");
    return;
  }

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  currentQuestion = 0;
  score = 0;

  loadQuestion();
});

// Load Question
function loadQuestion() {

  clearInterval(timer);

  const question = quizData[currentQuestion];
  questionText.textContent = question.question;

  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");

    button.addEventListener("click", () => selectAnswer(index));

    optionsContainer.appendChild(button);
  });

  // Update Progress Bar
  if (progressBar) {
    let progressPercent = (currentQuestion / quizData.length) * 100;
    progressBar.style.width = progressPercent + "%";
  }

  startTimer();
}

// Timer
function startTimer() {

  timeLeft = 60;
  timerEl.textContent = "Time Left: " + timeLeft + "s";

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Time Left: " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// Select Answer
function selectAnswer(index) {

  clearInterval(timer);

  const correct = quizData[currentQuestion].correctIndex;
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;

    if (i === correct) btn.classList.add("correct");
    if (i === index && i !== correct) btn.classList.add("wrong");
  });

  if (index === correct) score++;

  setTimeout(() => {
    nextQuestion();
  }, 1000);
}

// Next Question
function nextQuestion() {

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

// Show Result
function showResult() {

  clearInterval(timer);

  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  let message = "";

  let percentage = (score / quizData.length) * 100;

  if (percentage === 100) {
    message = "Outstanding! Perfect Score! 🏆🔥";
  } else if (percentage >= 70) {
    message = "Great Job! Keep Improving! 🚀";
  } else if (percentage >= 40) {
    message = "Good Try! Practice More 👍";
  } else {
    message = "Don't Give Up! Try Again 💪";
  }

  finalResult.innerHTML = `
    <h2>Your Score: ${score}/${quizData.length}</h2>
    <p>${message}</p>
  `;

  updateLeaderboard(usernameInput.value.trim(), score);
}

// Restart Quiz
restartBtn.addEventListener("click", () => {

  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");

  currentQuestion = 0;
  score = 0;
});

// Leaderboard
function saveToLeaderboard() {

  let username = usernameInput.value.trim() || "Guest";

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.push({
    name: username,
    score: score
  });

  leaderboard.sort((a, b) => b.score - a.score);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  displayLeaderboard();
}

function displayLeaderboard() {

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  let boardHTML = "<h3>Leaderboard</h3>";

  leaderboard.slice(0, 5).forEach((player, index) => {
    boardHTML += `<p>${index + 1}. ${player.name} - ${player.score}</p>`;
  });

  document.getElementById("leaderboard").innerHTML = boardHTML;
}
function updateLeaderboard(name, score) {

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({ name: name, score: score });

    // Sort highest to lowest
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top 5 players
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    displayLeaderboard();
}


function displayLeaderboard() {

    const leaderboardDiv = document.getElementById("leaderboard");
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboardDiv.innerHTML = "<h3>🏆 Leaderboard</h3>";

    leaderboard.forEach((player, index) => {
        leaderboardDiv.innerHTML += `
            <p>${index + 1}. ${player.name} - ${player.score}</p>
        `;
    });
}
document.getElementById("clearLeaderboardBtn").addEventListener("click", function () {

    localStorage.clear();  // clears everything safely for testing

    document.getElementById("leaderboard").innerHTML = "<h3>🏆 Leaderboard</h3><p>Leaderboard Cleared ✅</p>";

});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("Service Worker Failed", err));
}