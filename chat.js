const chatMessages =
  document.getElementById("chatMessages");

const chatInput =
  document.getElementById("chatInput");

const sendChat =
  document.getElementById("sendChat");

const quickButtons =
  document.querySelectorAll(".chat-quick button");


function addBubble(text, type) {

  const bubble =
    document.createElement("div");

  bubble.className =
    type === "user"
      ? "user-bubble"
      : "ai-bubble";

  bubble.textContent = text;

  chatMessages.appendChild(bubble);

  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


function localAI(text) {

  const lower =
    text.toLowerCase();


  if (
    lower.includes("mesaj") ||
    lower.includes("romantic")
  ) {

    return "Poți să-i scrii: «Poate că nu îți spun în fiecare clipă, dar prezența ta face zilele mele mai frumoase. Te aleg pe tine, iar și iar. ❤️»";

  }


  if (
    lower.includes("surpriz")
  ) {

    return "Pregătește o seară simplă doar pentru voi: melodia voastră, câteva poze cu amintiri, ceva ce îi place să mănânce și o scrisoare scurtă scrisă de tine. ❤️";

  }


  if (
    lower.includes("scuz") ||
    lower.includes("împăcare")
  ) {

    return "Încearcă ceva sincer: «Îmi pare rău pentru ce s-a întâmplat. Nu vreau să câștig o ceartă, vreau să fim bine. Îmi pasă de tine și vreau să repar lucrurile.»";

  }


  if (
    lower.includes("ziua")
  ) {

    return "Pentru ziua ei poți combina un mesaj personal, o poză preferată cu voi și un mic moment-surpriză. Dacă îmi spui ce îi place, îți pot da idei mai potrivite.";

  }


  return "Pot să te ajut cu mesaje romantice, idei pentru ziua ei, surprize, aniversări sau mesaje de împăcare. ❤️";

}


function sendMessage() {

  const text =
    chatInput.value.trim();

  if (!text) {
    return;
  }


  addBubble(text, "user");

  chatInput.value = "";


  setTimeout(() => {

    addBubble(
      localAI(text),
      "ai"
    );

  }, 350);

}


sendChat.addEventListener(
  "click",
  sendMessage
);


quickButtons.forEach(button => {

  button.addEventListener(
    "click",
    function () {

      const prompt =
        this.dataset.prompt;

      chatInput.value = prompt;

      sendMessage();

    }
  );

});