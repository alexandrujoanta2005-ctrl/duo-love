// ================================
// ELEMENTELE PAGINII
// ================================

const addMessageButton =
  document.getElementById("addMessageButton");

const aiMessageButton =
  document.getElementById("aiMessageButton");

const messageModal =
  document.getElementById("messageModal");

const aiModal =
  document.getElementById("aiModal");

const closeModal =
  document.getElementById("closeModal");

const closeAiModal =
  document.getElementById("closeAiModal");

const saveMessageButton =
  document.getElementById("saveMessage");

const messageTitle =
  document.getElementById("messageTitle");

const messageText =
  document.getElementById("messageText");

const messagesList =
  document.getElementById("messagesList");

const partnerName =
  document.getElementById("partnerName");

const aiDetails =
  document.getElementById("aiDetails");

const generateMessageButton =
  document.getElementById("generateMessage");

const regenerateMessageButton =
  document.getElementById("regenerateMessage");

const useMessageButton =
  document.getElementById("useMessage");

const generatedArea =
  document.getElementById("generatedArea");

const generatedMessage =
  document.getElementById("generatedMessage");

const aiOptions =
  document.querySelectorAll(".ai-option");


// ================================
// MESAJE SALVATE
// ================================

let messages =
  JSON.parse(localStorage.getItem("loveMessages")) || [];

let selectedType = "romantic";


// ================================
// SALVARE
// ================================

function saveMessages() {

  localStorage.setItem(
    "loveMessages",
    JSON.stringify(messages)
  );

}


// ================================
// PROTECȚIE TEXT
// ================================

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


// ================================
// AFIȘARE MESAJE
// ================================

function showMessages() {

  messagesList.innerHTML = "";

  if (messages.length === 0) {

    messagesList.innerHTML = `
      <div class="empty-memories">

        <span>💌</span>

        <p>
          Încă nu ai salvat niciun mesaj.
        </p>

      </div>
    `;

    return;

  }


  messages.forEach((message, index) => {

    const card =
      document.createElement("article");

    card.className =
      "love-message-card";

    card.innerHTML = `

      <div class="message-heart">
        ♡
      </div>

      <h2>
        ${escapeHTML(message.title)}
      </h2>

      <p>
        ${escapeHTML(message.text)}
      </p>

      <small>
        ${escapeHTML(message.date)}
      </small>

      <button
        class="delete-message"
        data-index="${index}">
        🗑️ Șterge
      </button>

    `;

    messagesList.appendChild(card);

  });


  document
    .querySelectorAll(".delete-message")
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const index =
            Number(this.dataset.index);

          messages.splice(index, 1);

          saveMessages();

          showMessages();

        }
      );

    });

}


// ================================
// DESCHIDE MESAJ NORMAL
// ================================

addMessageButton.addEventListener(
  "click",
  function () {

    messageModal.classList.remove("hidden");

  }
);


// ================================
// ÎNCHIDE MESAJ NORMAL
// ================================

closeModal.addEventListener(
  "click",
  function () {

    messageModal.classList.add("hidden");

  }
);


// ================================
// DESCHIDE BOT
// ================================

aiMessageButton.addEventListener(
  "click",
  function () {

    aiModal.classList.remove("hidden");

  }
);


// ================================
// ÎNCHIDE BOT
// ================================

closeAiModal.addEventListener(
  "click",
  function () {

    aiModal.classList.add("hidden");

  }
);


// ================================
// SELECTARE TIP MESAJ
// ================================

aiOptions.forEach(option => {

  option.addEventListener(
    "click",
    function () {

      aiOptions.forEach(button => {
        button.classList.remove("active");
      });

      this.classList.add("active");

      selectedType =
        this.dataset.type;

    }
  );

});


// ================================
// MESAJELE BOTULUI
// ================================

const botMessages = {

  romantic: [

    "Uneori mă uit la tine și mă întreb cum am avut atât de mult noroc să te întâlnesc. Ești persoana care face zilele mele mai frumoase și motivul pentru care zâmbesc fără să-mi dau seama. Te iubesc enorm. ❤️",

    "Dacă aș putea alege din nou persoana alături de care să-mi trăiesc toate momentele frumoase, te-aș alege tot pe tine. Astăzi, mâine și de fiecare dată. 💗",

    "Nu am nevoie de o zi specială ca să-ți spun cât de importantă ești pentru mine. Faptul că te am în viața mea este deja ceva special. ❤️",

    "Povestea mea preferată este cea pe care o scriem împreună, zi după zi. Și sper să avem încă foarte multe capitole de scris. 💕"

  ],


  emotional: [

    "Poate că nu reușesc întotdeauna să spun tot ce simt, dar vreau să știi că ai devenit o parte foarte importantă din viața mea. Îți mulțumesc pentru fiecare moment în care ai fost lângă mine. ❤️",

    "Sunt oameni pe care îi întâlnești și apoi sunt oameni care îți schimbă lumea. Pentru mine, tu ești unul dintre acei oameni. 🥺❤️",

    "Dacă într-o zi vei uita cât de mult însemni pentru mine, vreau să te întorci la mesajul acesta și să-ți amintești: te-am ales cu toată inima mea. 💗",

    "Nu știu ce ne rezervă viitorul, dar știu că fiecare amintire pe care o construiesc cu tine devine o parte din mine. ❤️"

  ],


  funny: [

    "Te iubesc chiar și atunci când îmi furi pătura, mâncarea și probabil jumătate din răbdare. 😂❤️ Tot pe tine te-aș alege.",

    "Cred că avem o problemă serioasă: m-am obișnuit prea mult cu tine și acum nu mai accept retururi. 😂💕",

    "Ești persoana mea preferată. Felicitări! Premiul este să mă suporți în continuare. 😂❤️",

    "Voiam să-ți scriu ceva extrem de romantic, dar m-am gândit că simplul fapt că mă ai pe mine este deja destul de romantic. 😂💗"

  ],


  morning: [

    "Bună dimineața, iubire! ☀️❤️ Sper să începi ziua cu un zâmbet și să nu uiți că undeva există cineva care se gândește deja la tine.",

    "Neața, suflet frumos. 💗 Îți doresc o zi liniștită, frumoasă și plină de motive să zâmbești. Abia aștept să vorbesc cu tine.",

    "Bună dimineața! ☀️ Dacă primul tău gând de azi nu am fost eu, mai ai timp să corectezi greșeala. 😂❤️",

    "Sper ca ziua ta să fie la fel de frumoasă precum zâmbetul tău. Bună dimineața, iubirea mea. 💕"

  ],


  night: [

    "Noapte bună, iubirea mea. 🌙❤️ Închide ochii și odihnește-te. Mâine avem încă o zi în care să ne iubim.",

    "Înainte să adormi, vreau doar să-ți amintesc că ești ultimul meu gând din seara asta. Somn ușor. 💗",

    "Mi-aș dori să fiu lângă tine acum, să te țin în brațe și să-ți spun noapte bună. Până atunci, îți trimit toată iubirea mea. 🌙💕",

    "Noapte bună, sufletul meu. Să ai cele mai frumoase vise și poate să-mi faci și mie puțin loc prin ele. ❤️"

  ],


  miss: [

    "Mi-e dor de tine într-un mod pe care mesajele nu prea știu să-l explice. Abia aștept momentul în care o să te văd din nou. ❤️",

    "Astăzi parcă lipsește ceva din ziua mea și știu exact ce: tu. Mi-e dor de tine. 🫶",

    "Distanța dintre noi poate fi măsurată în kilometri, dar dorul meu de tine nu prea încape în nicio unitate de măsură. ❤️",

    "Aș putea să-ți scriu un mesaj foarte lung despre cât de mult îmi lipsești, dar cred că trei cuvinte spun tot: vino la mine. 🥺❤️"

  ]

};


// ================================
// GENERARE MESAJ
// ================================

function createBotMessage() {

  const availableMessages =
    botMessages[selectedType];

  const randomIndex =
    Math.floor(
      Math.random() *
      availableMessages.length
    );

  let text =
    availableMessages[randomIndex];

  const name =
    partnerName.value.trim();

  const details =
    aiDetails.value.trim();


  if (name) {

    text =
      `${name}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;

  }


  if (details) {

    text += `\n\nȘi mai vreau să știi ceva: ${details} ❤️`;

  }


  generatedMessage.textContent = text;

  generatedArea.classList.remove("hidden");

}


// ================================
// BUTON GENERARE
// ================================

generateMessageButton.addEventListener(
  "click",
  createBotMessage
);


// ================================
// ALT MESAJ
// ================================

regenerateMessageButton.addEventListener(
  "click",
  createBotMessage
);


// ================================
// FOLOSEȘTE MESAJUL
// ================================

useMessageButton.addEventListener(
  "click",
  function () {

    const text =
      generatedMessage.textContent;

    messageTitle.value =
      "Pentru tine ❤️";

    messageText.value =
      text;

    aiModal.classList.add("hidden");

    messageModal.classList.remove("hidden");

  }
);


// ================================
// SALVARE MESAJ
// ================================

saveMessageButton.addEventListener(
  "click",
  function () {

    const title =
      messageTitle.value.trim();

    const text =
      messageText.value.trim();


    if (!title || !text) {

      alert(
        "Scrie titlul și mesajul ❤️"
      );

      return;

    }


    const date =
      new Date().toLocaleDateString(
        "ro-RO",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );


    messages.unshift({

      title: title,

      text: text,

      date: date

    });


    saveMessages();

    showMessages();


    messageTitle.value = "";

    messageText.value = "";


    messageModal.classList.add(
      "hidden"
    );

  }
);


// ================================
// ÎNCHIDERE CÂND APEȘI PE FUNDAL
// ================================

messageModal.addEventListener(
  "click",
  function (event) {

    if (event.target === messageModal) {

      messageModal.classList.add("hidden");

    }

  }
);


aiModal.addEventListener(
  "click",
  function (event) {

    if (event.target === aiModal) {

      aiModal.classList.add("hidden");

    }

  }
);


// ================================
// PORNIRE
// ================================

showMessages();