const song = document.getElementById('song');
const candlesDiv = document.getElementById('candles');

// Create candles: digit 2 and 9
['2', '9'].forEach(digit => {
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
  confetti({
    particleCount: 200,
    spread: 80,
    origin: { y: 0.6 }
  });

  setTimeout(showBalloons, 2000);
}

function showBalloons() {
  const container = document.getElementById('balloon-container');
  for (let i = 0; i < 7; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = `${Math.random() * 90}%`;
    balloon.style.setProperty('--color', randomColor());

    // Add curled silver string
    const string = document.createElement('div');
    string.classList.add('string');
    balloon.appendChild(string);

    container.appendChild(balloon);
  }
}


  setTimeout(showMessage, 8000);
}

function showMessage() {
  document.getElementById('popup').style.display = 'block';
  song.volume = 0.1;
}

function randomColor() {
  const colors = ['#f06292', '#4dd0e1', '#ffd54f', '#81c784', '#ba68c8'];
  return colors[Math.floor(Math.random() * colors.length)];
}
