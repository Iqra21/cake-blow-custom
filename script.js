const song = document.getElementById('song');
const candlesDiv = document.getElementById('candles');

// Add two candles for 29
const positions = [110, 160];
positions.forEach(pos => {
  const candle = document.createElement('div');
  candle.classList.add('candle');
  candle.style.left = `${pos}px`;
  candle.style.top = `-60px`;

  const flame = document.createElement('div');
  flame.classList.add('flame');
  flame.classList.add('on');

  candle.appendChild(flame);
  candlesDiv.appendChild(candle);
});

// Microphone detection
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

  // Start music
  song.play();

  // Confetti
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });

  // After 3s, show balloons
  setTimeout(showBalloons, 3000);
}

function showBalloons() {
  const container = document.getElementById('balloon-container');
  for (let i = 0; i < 10; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.backgroundColor = randomColor();
    balloon.onclick = () => balloon.remove(); // Pop on click
    container.appendChild(balloon);
  }

  // After 6s, show message
  setTimeout(showMessage, 6000);
}

function showMessage() {
  document.getElementById('popup').style.display = 'block';
  song.volume = 0.1;
}

function randomColor() {
  const colors = ['#ff3399', '#66ccff', '#ffcc00', '#ccff66', '#ff6666'];
  return colors[Math.floor(Math.random() * colors.length)];
}
