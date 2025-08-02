let candleCount = 0;
const candleContainer = document.getElementById("candles");
const cake = document.getElementById("cake");
const linkEl = document.getElementById("share-link");

function addCandle() {
  const candle = document.createElement("div");
  candle.classList.add("candle");
  candle.style.left = `${50 + candleCount * 20}px`;
  candle.dataset.lit = "true"; // Track if it's still burning
  candleContainer.appendChild(candle);
  candleCount++;
}

// Read from URL on load
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const count = parseInt(params.get("candles"));
  if (!isNaN(count)) {
    for (let i = 0; i < count; i++) {
      addCandle();
    }
  }
  startMicListening(); // Start mic on page load
  // Play music on user interaction
document.body.addEventListener("click", function playMusicOnce() {
  const audio = document.getElementById("birthday-audio");
  audio.play().catch((e) => {
    console.log("Autoplay blocked until user interacts");
  });
  // Remove listener so it plays only once
  document.body.removeEventListener("click", playMusicOnce);
});
};

// Generate sharable URL
function generateLink() {
  const baseUrl = window.location.origin + window.location.pathname;
  const shareURL = `${baseUrl}?candles=${candleCount}`;
  linkEl.innerHTML = `Share this link: <a href="${shareURL}" target="_blank">${shareURL}</a>`;
}

// 🎤 Microphone input
function startMicListening() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Microphone not supported");
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const context = new AudioContext();
      const mic = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      mic.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function detectBlow() {
        analyser.getByteFrequencyData(dataArray);
        let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume > 60) {
          blowOutOneCandle();
        }

        requestAnimationFrame(detectBlow);
      }

      detectBlow();
    })
    .catch((err) => {
      console.error("Mic error:", err);
      alert("Microphone access is required to blow out candles.");
    });
}

// 🕯️ Candle extinguishing
function blowOutOneCandle() {
  const candles = document.querySelectorAll(".candle[data-lit='true']");
  if (candles.length === 0) return;

  const candle = candles[candles.length - 1]; // Blow out last one
  candle.style.opacity = 0.2;
  candle.dataset.lit = "false";

  if (candles.length === 1) {
    launchConfetti();
  }
}

// 🎊 Confetti animation
function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.6 },
  });
}
