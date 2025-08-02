const candlesDiv = document.getElementById('candles');

// Create a custom 2 and 9
const positions = [100, 160]; // adjust depending on cake width
const digits = ['2', '9'];

digits.forEach((digit, i) => {
  const candle = document.createElement('div');
  candle.classList.add('candle', 'digit-candle');
  candle.style.left = `${positions[i]}px`;

  const number = document.createElement('div');
  number.classList.add('digit');
  number.textContent = digit;

  const flame = document.createElement('div');
  flame.classList.add('flame', 'big');

  candle.appendChild(flame);
  candle.appendChild(number);
  candlesDiv.appendChild(candle);
});

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
