/* =========================================================
   URSULEȚ AI - ASISTENT FLOTANT
========================================================= */

(function () {

  /* =======================================================
     NU ÎL PUNEM DECÂT PE HOME
  ======================================================= */

  let currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();


  if (!currentPage) {
    currentPage = "index.html";
  }


  if (
    currentPage !== "index.html"
  ) {
    return;
  }



  /* =======================================================
     STIL
  ======================================================= */

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

    /* ================================
       CERC URSULEȚ AI
    ================================= */

    .bear-ai-floating {
      position: fixed !important;

      right: 16px !important;

      bottom:
        calc(
          96px +
          env(safe-area-inset-bottom)
        ) !important;

      z-index: 2147483000 !important;

      display: flex !important;
      flex-direction: column !important;

      align-items: center !important;

      gap: 5px !important;
    }


    .bear-ai-button {
      position: relative !important;

      width: 68px !important;
      height: 68px !important;

      padding: 0 !important;

      overflow: hidden !important;

      border:
        2px solid
        rgba(
          255,
          190,
          218,
          .75
        ) !important;

      border-radius: 50% !important;

      background:
        rgba(
          14,
          9,
          18,
          .92
        ) !important;

      box-shadow:
        0 8px 28px
        rgba(
          0,
          0,
          0,
          .40
        ) !important;

      cursor: pointer !important;

      -webkit-tap-highlight-color:
        transparent !important;
    }


    .bear-ai-button img {
      width: 100% !important;
      height: 100% !important;

      display: block !important;

      object-fit: cover !important;

      pointer-events: none !important;
    }


    .bear-ai-online {
      position: absolute !important;

      right: 2px !important;
      bottom: 3px !important;

      width: 14px !important;
      height: 14px !important;

      border:
        2px solid
        #120b16 !important;

      border-radius: 50% !important;

      background:
        #55d887 !important;
    }


    .bear-ai-name-label {
      max-width: 90px !important;

      overflow: hidden !important;

      padding:
        4px 8px !important;

      border-radius: 10px !important;

      background:
        rgba(
          10,
          7,
          15,
          .88
        ) !important;

      color: white !important;

      font-size: 11px !important;
      font-weight: 700 !important;

      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }



    /* ================================
       FEREASTRĂ AI
    ================================= */

    .bear-ai-panel {
      position: fixed !important;

      right: 12px !important;

      bottom:
        calc(
          178px +
          env(safe-area-inset-bottom)
        ) !important;

      z-index: 2147482999 !important;

      width:
        min(
          calc(100% - 24px),
          360px
        ) !important;

      height: 430px !important;

      max-height:
        calc(
          100dvh -
          220px
        ) !important;

      display: none !important;

      flex-direction: column !important;

      overflow: hidden !important;

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          .12
        ) !important;

      border-radius: 24px !important;

      background:
        rgba(
          12,
          8,
          17,
          .97
        ) !important;

      box-shadow:
        0 15px 45px
        rgba(
          0,
          0,
          0,
          .50
        ) !important;

      backdrop-filter:
        blur(22px) !important;

      -webkit-backdrop-filter:
        blur(22px) !important;
    }


    .bear-ai-panel.open {
      display: flex !important;
    }



    /* HEADER */

    .bear-ai-header {
      flex: 0 0 auto !important;

      display: flex !important;

      align-items: center !important;

      gap: 10px !important;

      padding:
        13px !important;

      border-bottom:
        1px solid
        rgba(
          255,
          255,
          255,
          .08
        ) !important;
    }


    .bear-ai-header-photo {
      width: 44px !important;
      height: 44px !important;

      overflow: hidden !important;

      border-radius: 50% !important;

      background:
        rgba(
          255,
          255,
          255,
          .08
        ) !important;
    }


    .bear-ai-header-photo img {
      width: 100% !important;
      height: 100% !important;

      object-fit: cover !important;
    }


    .bear-ai-header-text {
      flex: 1 1 auto !important;

      min-width: 0 !important;
    }


    .bear-ai-header-text strong {
      display: block !important;

      color: white !important;

      font-size: 16px !important;
    }


    .bear-ai-header-text span {
      color:
        rgba(
          255,
          255,
          255,
          .58
        ) !important;

      font-size: 11px !important;
    }


    .bear-ai-close {
      width: 38px !important;
      height: 38px !important;

      border: 0 !important;

      border-radius: 50% !important;

      background:
        rgba(
          255,
          255,
          255,
          .08
        ) !important;

      color: white !important;

      font-size: 21px !important;
    }



    /* MESAJE */

    .bear-ai-messages {
      flex: 1 1 0 !important;

      min-height: 0 !important;

      overflow-y: auto !important;

      padding: 13px !important;

      -webkit-overflow-scrolling:
        touch !important;

      scrollbar-width:
        none !important;
    }


    .bear-ai-messages::-webkit-scrollbar {
      display: none !important;
    }


    .bear-ai-message {
      width: fit-content !important;

      max-width: 82% !important;

      margin-bottom: 9px !important;

      padding:
        10px
        13px !important;

      border-radius: 17px !important;

      color: white !important;

      font-size: 14px !important;

      line-height: 1.45 !important;

      white-space: pre-wrap !important;

      word-break: break-word !important;
    }


    .bear-ai-message.ai {
      margin-right: auto !important;

      border-bottom-left-radius:
        5px !important;

      background:
        rgba(
          255,
          255,
          255,
          .09
        ) !important;
    }


    .bear-ai-message.user {
      margin-left: auto !important;

      border-bottom-right-radius:
        5px !important;

      background:
        rgba(
          155,
          61,
          104,
          .78
        ) !important;
    }



    /* INPUT */

    .bear-ai-input-row {
      flex: 0 0 auto !important;

      display: flex !important;

      gap: 7px !important;

      padding: 10px !important;

      border-top:
        1px solid
        rgba(
          255,
          255,
          255,
          .08
        ) !important;
    }


    .bear-ai-input {
      flex: 1 1 auto !important;

      min-width: 0 !important;

      height: 48px !important;

      box-sizing: border-box !important;

      padding:
        0
        13px !important;

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          .10
        ) !important;

      border-radius: 16px !important;

      outline: 0 !important;

      background:
        rgba(
          255,
          255,
          255,
          .08
        ) !important;

      color: white !important;

      font-size: 16px !important;
    }


    .bear-ai-send {
      flex:
        0 0
        48px !important;

      width: 48px !important;
      height: 48px !important;

      border: 0 !important;

      border-radius: 16px !important;

      background:
        #c95887 !important;

      color: white !important;

      font-size: 19px !important;
    }


    @media (max-width: 360px) {

      .bear-ai-panel {
        right: 8px !important;

        width:
          calc(
            100% -
            16px
          ) !important;
      }

    }

  `;


  document.head.appendChild(
    style
  );



  /* =======================================================
     NUME
  ======================================================= */

  function getBearAIName() {

    return (
      localStorage.getItem(
        "bearAIName"
      ) ||
      "Teddy"
    ).trim() || "Teddy";

  }



  /* =======================================================
     HTML
  ======================================================= */

  const floating =
    document.createElement(
      "div"
    );


  floating.className =
    "bear-ai-floating";


  floating.innerHTML = `

    <button
      type="button"
      class="bear-ai-button"
      id="bearAIButton"
      aria-label="Deschide Ursulețul AI"
    >

      <img
        src="./ursulet.png"
        alt="Ursuleț AI"
        draggable="false"
      >

      <span
        class="bear-ai-online"
      ></span>

    </button>


    <span
      id="bearAINameLabel"
      class="bear-ai-name-label"
    >
      ${getBearAIName()}
    </span>

  `;


  document.body.appendChild(
    floating
  );



  const panel =
    document.createElement(
      "section"
    );


  panel.className =
    "bear-ai-panel";


  panel.id =
    "bearAIPanel";


  panel.innerHTML = `

    <div class="bear-ai-header">

      <div
        class="bear-ai-header-photo"
      >

        <img
          src="./ursulet.png"
          alt="Ursuleț AI"
        >

      </div>


      <div
        class="bear-ai-header-text"
      >

        <strong
          id="bearAITitle"
        >
          ${getBearAIName()} 🧸
        </strong>

        <span>
          Ursulețul vostru AI ❤️
        </span>

      </div>


      <button
        type="button"
        id="bearAIClose"
        class="bear-ai-close"
      >
        ×
      </button>

    </div>


    <div
      id="bearAIMessages"
      class="bear-ai-messages"
    ></div>


    <div
      class="bear-ai-input-row"
    >

      <input
        id="bearAIInput"
        class="bear-ai-input"
        type="text"
        placeholder="Vorbește cu ursulețul..."
      >


      <button
        id="bearAISend"
        class="bear-ai-send"
        type="button"
      >
        ➤
      </button>

    </div>

  `;


  document.body.appendChild(
    panel
  );



  /* =======================================================
     ELEMENTE
  ======================================================= */

  const button =
    document.getElementById(
      "bearAIButton"
    );


  const close =
    document.getElementById(
      "bearAIClose"
    );


  const messagesBox =
    document.getElementById(
      "bearAIMessages"
    );


  const input =
    document.getElementById(
      "bearAIInput"
    );


  const send =
    document.getElementById(
      "bearAISend"
    );


  const title =
    document.getElementById(
      "bearAITitle"
    );


  const nameLabel =
    document.getElementById(
      "bearAINameLabel"
    );



  /* =======================================================
     MESAJE
  ======================================================= */

  let chatMessages = [];


  function loadAIChat() {

    try {

      chatMessages =
        JSON.parse(
          localStorage.getItem(
            "bearAIChatMessages"
          ) ||
          "[]"
        );

    } catch (error) {

      chatMessages = [];

    }


    if (
      !Array.isArray(
        chatMessages
      )
    ) {

      chatMessages = [];

    }


    if (
      !chatMessages.length
    ) {

      chatMessages.push({

        role:
          "ai",

        text:
          "Hei! 🧸❤️ Eu sunt " +
          getBearAIName() +
          ". Sunt ursulețul vostru și sunt aici când ai nevoie să vorbești cu cineva. 💕"

      });

    }

  }



  function saveAIChat() {

    if (
      chatMessages.length >
      60
    ) {

      chatMessages =
        chatMessages.slice(
          -60
        );

    }


    if (
      typeof window.saveJSON ===
      "function"
    ) {

      window.saveJSON(
        "bearAIChatMessages",
        chatMessages
      );

    } else {

      localStorage.setItem(
        "bearAIChatMessages",
        JSON.stringify(
          chatMessages
        )
      );

    }

  }



  function renderAIChat() {

    messagesBox.innerHTML =
      "";


    chatMessages.forEach(
      function (message) {

        const bubble =
          document.createElement(
            "div"
          );


        bubble.className =
          "bear-ai-message " +
          (
            message.role ===
            "user"
              ? "user"
              : "ai"
          );


        bubble.textContent =
          message.text;


        messagesBox.appendChild(
          bubble
        );

      }
    );


    requestAnimationFrame(
      function () {

        messagesBox.scrollTop =
          messagesBox.scrollHeight;

      }
    );

  }



  /* =======================================================
     RĂSPUNSURI URSULEȚ AI
  ======================================================= */

  function normalize(
    text
  ) {

    return text
      .toLowerCase()
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  }



  function random(
    values
  ) {

    return values[
      Math.floor(
        Math.random() *
        values.length
      )
    ];

  }



  function getAIReply(
    userText
  ) {

    const text =
      normalize(
        userText
      );


    const bearName =
      getBearAIName();


    if (
      text.includes(
        "cum te cheama"
      ) ||
      text.includes(
        "numele tau"
      )
    ) {

      return (
        "Eu sunt " +
        bearName +
        " 🧸❤️ Numele meu poate fi schimbat oricând din Setări."
      );

    }


    if (
      text.includes(
        "trist"
      ) ||
      text.includes(
        "suparat"
      ) ||
      text.includes(
        "rau"
      )
    ) {

      return random([
        "Vin lângă tine cu o îmbrățișare mare de urs. 🧸🤍 Uneori ajută doar să spui ce ai pe suflet. Eu te ascult.",
        "Sunt aici. ❤️ Poți să-mi spui ce s-a întâmplat și vorbim puțin.",
        "Îți trimit o îmbrățișare virtuală. 🫂🧸 Spune-mi ce te apasă."
      ]);

    }


    if (
      text.includes(
        "iubesc"
      ) ||
      text.includes(
        "iubire"
      )
    ) {

      return random([
        "Iubirea voastră îmi umple și mie inimioara de urs. 🧸❤️",
        "Atunci să nu uiți să-i spui și persoanei iubite. 🥹💕 Uneori un simplu «te iubesc» valorează enorm.",
        "Aww... 🧸❤️ Eu sunt ursulețul oficial al poveștii voastre."
      ]);

    }


    if (
      text.includes(
        "dor"
      )
    ) {

      return (
        "Dorul apare când cineva înseamnă mult pentru tine. 🥹❤️ Poți să-i trimiți chiar acum un mesaj simplu: «Mi-e dor de tine și abia aștept să te văd.»"
      );

    }


    if (
      text.includes(
        "ce faci"
      )
    ) {

      return (
        "Stau aici în colțul aplicației și am grijă de povestea voastră. 🧸❤️"
      );

    }


    if (
      text.includes(
        "salut"
      ) ||
      text.includes(
        "buna"
      ) ||
      text.includes(
        "hei"
      )
    ) {

      return (
        "Hei! 🧸💕 Eu sunt " +
        bearName +
        ". Cum ești azi?"
      );

    }


    return random([
      "Te ascult. 🧸❤️ Spune-mi mai multe.",
      "Hmm... ursulețul se gândește. 🧸💭 Povestește-mi puțin mai mult.",
      "Sunt aici cu tine. ❤️ Ce ai vrea să facem?",
      "Aww 🧸💕 continuă, vreau să aud.",
      "Poți să-mi spui orice. Sunt ursulețul vostru. 🧸❤️"
    ]);

  }



  /* =======================================================
     TRIMITERE
  ======================================================= */

  function sendMessage() {

    const value =
      input.value
        .trim();


    if (
      !value
    ) {
      return;
    }


    chatMessages.push({

      role:
        "user",

      text:
        value

    });


    input.value =
      "";


    saveAIChat();

    renderAIChat();


    const typing =
      document.createElement(
        "div"
      );


    typing.className =
      "bear-ai-message ai";


    typing.textContent =
      getBearAIName() +
      " se gândește... 🧸";


    messagesBox.appendChild(
      typing
    );


    messagesBox.scrollTop =
      messagesBox.scrollHeight;


    setTimeout(
      function () {

        typing.remove();


        chatMessages.push({

          role:
            "ai",

          text:
            getAIReply(
              value
            )

        });


        saveAIChat();

        renderAIChat();

      },
      550
    );

  }



  /* =======================================================
     DESCHIDE / ÎNCHIDE
  ======================================================= */

  button.addEventListener(
    "click",
    function () {

      panel.classList.toggle(
        "open"
      );


      if (
        panel.classList.contains(
          "open"
        )
      ) {

        const name =
          getBearAIName();


        title.textContent =
          name +
          " 🧸";


        nameLabel.textContent =
          name;


        renderAIChat();


        setTimeout(
          function () {

            input.focus();

          },
          100
        );

      }

    }
  );


  close.addEventListener(
    "click",
    function () {

      panel.classList.remove(
        "open"
      );

    }
  );


  send.addEventListener(
    "click",
    sendMessage
  );


  input.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        sendMessage();

      }

    }
  );



  /* =======================================================
     ACTUALIZEAZĂ NUMELE
  ======================================================= */

  window.updateBearAIName =
    function () {

      const name =
        getBearAIName();


      nameLabel.textContent =
        name;


      title.textContent =
        name +
        " 🧸";

    };



  /* =======================================================
     START
  ======================================================= */

  loadAIChat();

  saveAIChat();

  renderAIChat();

})();