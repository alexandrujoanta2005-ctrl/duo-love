// Schimbă data asta cu data voastră reală
const relationshipStart = new Date("2025-08-17T00:00:00");

function updateCounter() {
  const now = new Date();

  let difference = now - relationshipStart;

  if (difference < 0) {
    difference = 0;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = days;

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCounter();

setInterval(updateCounter, 1000);


// inimioare în fundal

function createHeart() {
  const heart = document.createElement("div");

  const symbols = ["♡", "♥", "💕"];

  heart.className = "floating-heart";
  heart.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  heart.style.left = Math.random() * 100 + "vw";

  heart.style.fontSize =
    Math.random() * 12 + 12 + "px";

  heart.style.animationDuration =
    Math.random() * 4 + 6 + "s";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 10000);
}

setInterval(createHeart, 900);