const NUM_CANDLES = 5;
const candlesDiv = document.getElementById('candles');

// Add candles with flames
for (let i = 0; i < NUM_CANDLES; i++) {
  const candle = document.createElement('div');
  candle.classList.add('candle');
  candle.style.left = `${60 + i * 30}px`; // Spread across the cake

  const flame = document.createElement('div');
  flame.classList.add('flame');
  flame.classList.add('on');

  candle.appendChild(flame);
  candlesDiv.appendChild(candle);
}

// Audio
const song = document.getElementById('song');

// Microphone-based blowing detection
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const context = new AudioContext();
  const mic = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  mic.connect(analyser);
  analyser.fftSize = 512;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function checkVolume() {
    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

    if (volume > 60) {
      blowOutCandles();
    } else {
      requestAnimationFrame(checkVolume);
    }
  }

  checkVolume();
});

function blowOutCandles() {
  document.querySelectorAll('.flame').forEach(f => f.style.display = 'none');
  song.play();
  startConfetti();
}

// Optional confetti
function startConfetti() {
  if (window.confetti) {
    confetti();
    setTimeout(() => confetti.reset(), 5000);
  }
}
