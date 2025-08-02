// Select elements
const addModeBtn = document.getElementById('add-mode-btn');
const blowModeBtn = document.getElementById('blow-mode-btn');
const candlesContainer = document.getElementById('candles-container');
const shareContainer = document.getElementById('share-container');
const shareLinkInput = document.getElementById('share-link');
const audio = document.getElementById('happy-audio');
const balloonsContainer = document.getElementById('balloons-container');
const confettiCanvas = document.getElementById('confetti-canvas');

let mode = 'add';
let candles = [];

const cake = document.getElementById('cake');

// --- Candle placement (Add Mode) ---
cake.addEventListener('click', (e) => {
  if (mode !== 'add') return;

  const rect = cake.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const candle = document.createElement('div');
  candle.className = 'candle';
  candle.style.left = `${x - 5}px`;
  candle.style.top = `${y - 30}px`;

  candlesContainer.appendChild(candle);
  candles.push({ x: x / rect.width, y: y / rect.height }); // normalize
  updateShareLink();
});

// --- Generate sharable URL ---
function updateShareLink() {
  const url = new URL(window.location.href);
  url.searchParams.set('candles', JSON.stringify(candles));
  shareLinkInput.value = url.toString();
  shareContainer.style.display = 'block';
}

// --- Load candle positions from URL ---
function loadCandlesFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get('candles');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      const rect = cake.getBoundingClientRect();
      parsed.forEach(pos => {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.style.left = `${pos.x * rect.width - 5}px`;
        candle.style.top = `${pos.y * rect.height - 30}px`;
        candlesContainer.appendChild(candle);
      });
      candles = parsed;
    } catch (e) {
      console.error('Failed to load candles:', e);
    }
  }
}

// --- Switch Modes ---
addModeBtn.addEventListener('click', () => {
  mode = 'add';
  shareContainer.style.display = 'block';
});

blowModeBtn.addEventListener('click', () => {
  mode = 'blow';
  shareContainer.style.display = 'none';
  detectBlow();
});

// --- Detect Microphone Blow ---
function detectBlow() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const context = new AudioContext();
    const mic = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    const data = new Uint8Array(analyser.frequencyBinCount);

    mic.connect(analyser);

    const check = () => {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a, b) => a + b) / data.length;

      if (volume > 40) {
        blowOutCandles();
        stream.getTracks().forEach(track => track.stop());
      } else {
        requestAnimationFrame(check);
      }
    };

    check();
  }).catch(err => {
    alert("Microphone access is required to blow the candles.");
    console.error(err);
  });
}

// --- Blow out candles, play music, confetti, balloons ---
function blowOutCandles() {
  const flames = document.querySelectorAll('.candle::after');
  document.querySelectorAll('.candle').forEach(c => {
    c.style.opacity = '0.3';
    c.style.transition = 'opacity 0.3s ease-out';
    c.innerHTML = ''; // remove flame
  });

  // Play music
  audio.play();

  // Launch confetti
  launchConfetti();

  // Float balloons
  for (let i = 0; i < 10; i++) {
    createBalloon();
  }
}

// --- Confetti animation ---
function launchConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confettiCanvas.getContext('2d').clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// --- Create a balloon ---
function createBalloon() {
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  balloon.style.left = Math.random() * 100 + 'vw';
  balloon.style.animationDuration = `${4 + Math.random() * 2}s`;
  balloonsContainer.appendChild(balloon);

  setTimeout(() => balloon.remove(), 7000);
}

// --- Resize confetti canvas ---
window.addEventListener('resize', () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// --- Load initial state ---
window.onload = () => {
  if (window.location.search.includes('candles=')) {
    mode = 'blow';
    loadCandlesFromURL();
    blowModeBtn.click();
  } else {
    mode = 'add';
    shareContainer.style.display = 'block';
  }
};
