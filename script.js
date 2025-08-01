let candleCount = 0;
const candleContainer = document.getElementById("candles");
const cake = document.getElementById("cake");

// Add candle based on count
function addCandle() {
  const candle = document.createElement("div");
  candle.classList.add("candle");
  candle.style.left = `${50 + candleCount * 20}px`;
  candleContainer.appendChild(candle);
  candleCount++;
}

// On load: check if there's a ?candles= in URL
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const count = parseInt(params.get("candles"));
  if (!isNaN(count)) {
    for (let i = 0; i < count; i++) {
      addCandle();
    }
  }
};

// Generate shareable URL
function generateLink() {
  const baseUrl = window.location.origin + window.location.pathname;
  const shareURL = `${baseUrl}?candles=${candleCount}`;
  const linkEl = document.getElementById("share-link");
  linkEl.innerHTML = `Share this link: <a href="${shareURL}" target="_blank">${shareURL}</a>`;
}
