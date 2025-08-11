const song = document.getElementById('song');
const candlesDiv = document.getElementById('candles');

// Create candles: digit 2 and 4
['2', '4'].forEach(digit => {
  const candle = document.createElement('div');
  candle.classList.add('candle');

  const flame = document.createElement('div');
  flame.classList.add('flame');

  const number = document.createElement('div');
  number.classList.add('digit');
  number.textContent = digit;

  candle.appendChild(flame);
  candle.appendChild(number);
  candlesDiv.appendChild(candle);
});

// Microphone logic
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const context = new AudioContext();
  const mic = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  mic.connect(analyser);
  analyser.fftSize = 512;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function checkVolume() {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
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

  // Keep firing confetti until banner appears
  const confettiInterval = setInterval(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 500);

  setTimeout(() => {
    showBalloons();
    clearInterval(confettiInterval);
  }, 4000);

  setTimeout(showMessage, 8000);
}

function showBalloons() {
  const container = document.getElementById('balloon-container');
  for (let i = 0; i < 7; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = `calc(${Math.random() * 90}% - 200px)`; // half width offset
    balloon.style.setProperty('--color', randomColor());

    const string = document.createElement('div');
    string.classList.add('string');
    balloon.appendChild(string);

    container.appendChild(balloon);
  }
}

function showMessage() {
  const banner = document.getElementById('banner');
  banner.classList.add('show');
  song.volume = 0.1;
}

function randomColor() {
  const colors = ['#f06292', '#4dd0e1', '#ffd54f', '#81c784', '#ba68c8'];
  return colors[Math.floor(Math.random() * colors.length)];
}
