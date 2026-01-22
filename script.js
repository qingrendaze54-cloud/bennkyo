let words = JSON.parse(localStorage.getItem("words")) || [
  { en: "apple", jp: "りんご", status: "new" },
  { en: "study", jp: "勉強する", status: "new" }
];

let index = 0;
let correctCount = 0;
let reviewMode = false;
let fillMode = false;

const meaning = document.getElementById("meaning");
const answer = document.getElementById("answer");
const judge = document.getElementById("judge");
const correctCountEl = document.getElementById("correctCount");
const totalCountEl = document.getElementById("totalCount");
const wordListEl = document.getElementById("wordList");
const reviewListEl = document.getElementById("reviewList");

function save() {
  localStorage.setItem("words", JSON.stringify(words));
}

function currentWords() {
  return reviewMode
    ? words.filter(w => w.status === "review")
    : words;
}

// 単語表示
function showWord() {
  const list = currentWords();
  if (list.length === 0) {
    meaning.textContent = "単語がありません";
    return;
  }
  index %= list.length;
  const word = list[index];

  if (fillMode) {
    const len = word.en.length;
    const hideIndex = Math.floor(Math.random() * len);
    let display = word.en.split("");
    display[hideIndex] = "＿";
    meaning.textContent = `${word.jp} (${display.join("")})`;
  } else {
    meaning.textContent = word.jp;
  }

  answer.value = "";
  judge.textContent = "";
  totalCountEl.textContent = list.length;
}

// 正誤判定
document.getElementById("checkBtn").onclick = () => {
  const list = currentWords();
  if (!list[index]) return;

  const correct = list[index].en.toLowerCase();
  if (answer.value.trim().toLowerCase() === correct) {
    judge.textContent = "⭕ 正解";
    judge.style.color = "green";
    correctCount++;
  } else {
    judge.textContent = `❌ 正解：${list[index].en}`;
    judge.style.color = "red";
  }
  correctCountEl.textContent = correctCount;
};

// 覚えた
document.getElementById("knownBtn").onclick = () => {
  currentWords()[index].status = "known";
  save();
  updateWordList();
};

// 復習
document.getElementById("reviewBtn").onclick = () => {
  currentWords()[index].status = "review";
  save();
  updateWordList();
  updateReviewList();
};

// 次の単語
document.getElementById("nextBtn").onclick = () => {
  index++;
  showWord();
};

// 単語追加
document.getElementById("addBtn").onclick = () => {
  const en = document.getElementById("newEn").value;
  const jp = document.getElementById("newJp").value;
  if (!en || !jp) return;

  words.push({ en, jp, status: "new" });
  save();
  updateWordList();
  showWord();
};

// 単語リスト表示（編集ボタン付き）
function updateWordList() {
  wordListEl.innerHTML = "";
  words.forEach((w, i) => {
    const li = document.createElement("li");
    li.className = "word-item";
    li.innerHTML = `<span>${w.en} - ${w.jp}</span>`;
    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.onclick = () => editWord(i);
    li.appendChild(editBtn);
    wordListEl.appendChild(li);
  });
}

// 単語編集
function editWord(i) {
  const newEn = prompt("英単語を修正", words[i].en);
  if (newEn !== null) words[i].en = newEn;
  const newJp = prompt("意味を修正", words[i].jp);
  if (newJp !== null) words[i].jp = newJp;
  save();
  updateWordList();
  showWord();
}

// シャッフル
document.getElementById("shuffleBtn").onclick = () => {
  for (let i = words.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  index = 0;
  showWord();
};

// 復習モード
document.getElementById("reviewModeBtn").onclick = () => {
  reviewMode = !reviewMode;
  index = 0;
  showWord();
};

// 穴埋めモード
document.getElementById("fillBtn").onclick = () => {
  fillMode = !fillMode;
  showWord();
};

// 復習リスト
function updateReviewList() {
  reviewListEl.innerHTML = "";
  words.filter(w => w.status === "review").forEach(w => {
    const li = document.createElement("li");
    li.textContent = w.en;
    reviewListEl.appendChild(li);
  });
}

updateWordList();
updateReviewList();
showWord();