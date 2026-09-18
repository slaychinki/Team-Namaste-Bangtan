// Register Service Worker using relative scope for GitHub Pages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('TNB Service Worker active'))
    .catch((err) => console.log('SW Registration error:', err));
}

// 1. Korea Standard Time Clock (Auto Updates)
function updateKSTClock() {
  try {
    const kstString = new Intl.DateTimeFormat([], {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
    document.getElementById('kstClock').textContent = `KST ${kstString}`;
  } catch (e) {
    document.getElementById('kstClock').textContent = 'KST Live';
  }
}
setInterval(updateKSTClock, 1000);
updateKSTClock();

// 2. Voting Feed Data (Team Namaste Bangtan Central Links)
const votingFeed = [
  {
    title: "MAMA Awards: Worldwide Fans' Choice",
    platform: "Mnet Plus",
    deadline: "Daily Reset 00:00 KST",
    isUrgent: true,
    url: "https://www.mnetplus.world"
  },
  {
    title: "Idol Champ: Monthly Global K-Pop Group",
    platform: "Idol Champ App",
    deadline: "Collect Chamsims Daily",
    isUrgent: false,
    url: "https://play.google.com/store/apps/details?id=com.nwz.ichamp"
  },
  {
    title: "Choeaedol: Member Charity & Birthday Polls",
    platform: "Choeaedol",
    deadline: "Drop Daily Hearts Before Reset",
    isUrgent: true,
    url: "https://play.google.com/store/apps/details?id=net.ib.mn"
  }
];

function renderVotingFeed() {
  const container = document.getElementById('votingList');
  container.innerHTML = votingFeed.map(vote => `
    <div class="vote-card">
      <div class="vote-top">
        <span class="badge-platform">${vote.platform}</span>
        ${vote.isUrgent ? '<span class="badge-urgent">🚨 PRIORITY</span>' : ''}
      </div>
      <div class="vote-title">${vote.title}</div>
      <div class="vote-meta">⏳ ${vote.deadline}</div>
      <a href="${vote.url}" target="_blank" rel="noopener noreferrer" class="vote-action-btn">
        Open & Cast Vote ↗
      </a>
    </div>
  `).join('');
}
renderVotingFeed();

// 3. Korean Kira-Style Flashcards
const koreanDeck = [
  {
    cat: "BTS Slang",
    kr: "보라해",
    rom: "[Borahae]",
    en: "I purple you (I trust and love you)",
    hi: "हमेशा प्यार और भरोसा निभाना",
    context: "Coined by V (Kim Taehyung) at the 3rd Muster in 2016."
  },
  {
    cat: "Fandom Core",
    kr: "아미",
    rom: "[A-mi]",
    en: "ARMY (BTS Fandom)",
    hi: "आर्मी (बीटीएस का फैन्डम)",
    context: "Adorable Representative M.C. for Youth."
  },
  {
    cat: "Lyric Essential",
    kr: "보고싶다",
    rom: "[Bogo sipda]",
    en: "I miss you",
    hi: "मुझे आपकी याद आती है",
    context: "The iconic opening line of BTS's Spring Day (봄날)."
  },
  {
    cat: "Run BTS Slang",
    kr: "대박",
    rom: "[Daebak]",
    en: "Jackpot / Awesome / Huge success",
    hi: "कमाल का / ज़बरदस्त",
    context: "Constantly used by members during games and awards."
  },
  {
    cat: "Award Speech",
    kr: "감사합니다",
    rom: "[Gamsahamnida]",
    en: "Thank you (Polite / Formal)",
    hi: "धन्यवाद / शुक्रिया",
    context: "Used in every Daesang and award acceptance speech."
  }
];

let deckIndex = 0;

function updateFlashcard() {
  const item = koreanDeck[deckIndex];
  document.getElementById('cardCategory').textContent = item.cat;
  document.getElementById('cardHangul').textContent = item.kr;
  document.getElementById('cardRom').textContent = item.rom;
  document.getElementById('cardEn').textContent = item.en;
  document.getElementById('cardHi').textContent = item.hi;
  document.getElementById('cardContext').textContent = item.context;
  document.getElementById('cardCounter').textContent = `${deckIndex + 1} / ${koreanDeck.length}`;
}

function nextCard() {
  deckIndex = (deckIndex + 1) % koreanDeck.length;
  updateFlashcard();
}

function prevCard() {
  deckIndex = (deckIndex - 1 + koreanDeck.length) % koreanDeck.length;
  updateFlashcard();
}

function playAudio() {
  const text = koreanDeck[deckIndex].kr;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Audio is not supported by your browser.");
  }
}
updateFlashcard();

// 4. Daily Routine Tasks (Saved on Phone)
let userTasks = JSON.parse(localStorage.getItem('tnb_tasks_v2')) || [
  { text: "Cast MAMA daily votes", done: false },
  { text: "Collect Choeaedol daily hearts", done: false },
  { text: "Stream targeted MV on YouTube", done: false },
  { text: "Learn 3 new Korean words", done: false }
];

function renderTasks() {
  localStorage.setItem('tnb_tasks_v2', JSON.stringify(userTasks));
  const list = document.getElementById('taskList');
  list.innerHTML = userTasks.map((t, idx) => `
    <li class="task-item ${t.done ? 'done' : ''}">
      <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${idx})">
      <span>${t.text}</span>
    </li>
  `).join('');
}

function toggleTask(i) {
  userTasks[i].done = !userTasks[i].done;
  renderTasks();
}

function addTask() {
  const input = document.getElementById('taskInput');
  const txt = input.value.trim();
  if (!txt) return;
  userTasks.push({ text: txt, done: false });
  input.value = '';
  renderTasks();
}
renderTasks();

// 5. Navigation Tab Switcher
function switchTab(tabKey, btnElement) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn-bar').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tabKey}`).classList.add('active');
  btnElement.classList.add('active');
}
