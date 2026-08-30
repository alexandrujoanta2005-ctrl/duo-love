/* =========================================================
   URSULEȚUL IUBIRII
   SALVARE LOCALĂ + SUPABASE
========================================================= */


/* =========================================================
   ELEMENTE
========================================================= */

const bearWrap =
  document.getElementById(
    "loveBear"
  );


const realBear =
  document.getElementById(
    "realBear"
  );


const petBearButton =
  document.getElementById(
    "petBear"
  );


const changeBearItemButton =
  document.getElementById(
    "changeBearItem"
  );


const bearMessage =
  document.getElementById(
    "bearMessage"
  );


const bearLevel =
  document.getElementById(
    "bearLevel"
  );


const bearAge =
  document.getElementById(
    "bearAge"
  );


const bearProgress =
  document.getElementById(
    "bearProgress"
  );


const bearAccessory =
  document.getElementById(
    "bearAccessory"
  );



/* =========================================================
   DATE URSULEȚ
========================================================= */

let happiness = 25;

let level = 1;

let accessoryIndex = 0;



/* =========================================================
   ACCESORII
========================================================= */

const accessories = [
  "",
  "🎀",
  "👑",
  "🌹",
  "⭐",
  "💝",
  "🧢"
];



/* =========================================================
   MESAJE
========================================================= */

const messages = [

  "Ursulețul e fericit să te vadă. 🧸❤️",

  "Îți trimite o îmbrățișare mare. 🤗",

  "Te iubește și el puțin. 💕",

  "Azi pare foarte fericit. ✨",

  "Așteaptă să-l mai mângâi. 🧸",

  "Povestea voastră îl face fericit. ❤️"

];



/* =========================================================
   CITEȘTE DATELE SALVATE
========================================================= */

function loadBearState() {

  const savedHappiness =
    Number(
      localStorage.getItem(
        "bearHappiness"
      )
    );


  const savedLevel =
    Number(
      localStorage.getItem(
        "bearLevel"
      )
    );


  const savedAccessory =
    Number(
      localStorage.getItem(
        "bearAccessory"
      )
    );


  happiness =
    Number.isFinite(
      savedHappiness
    ) &&
    savedHappiness >= 0
      ? savedHappiness
      : 25;


  level =
    Number.isFinite(
      savedLevel
    ) &&
    savedLevel >= 1
      ? savedLevel
      : 1;


  accessoryIndex =
    Number.isFinite(
      savedAccessory
    ) &&
    savedAccessory >= 0
      ? savedAccessory
      : 0;


  if (
    accessoryIndex >=
    accessories.length
  ) {

    accessoryIndex = 0;

  }

}



/* =========================================================
   SALVEAZĂ LOCAL + CLOUD
========================================================= */

function saveBearState() {

  /*
    Dacă există cloud-sync.js,
    salvăm automat și pe cont.
  */

  if (
    typeof window.saveSetting ===
    "function"
  ) {

    window.saveSetting(
      "bearHappiness",
      happiness
    );


    window.saveSetting(
      "bearLevel",
      level
    );


    window.saveSetting(
      "bearAccessory",
      accessoryIndex
    );

  } else {

    /*
      Fallback dacă Supabase
      nu este încărcat.
    */

    localStorage.setItem(
      "bearHappiness",
      happiness
    );


    localStorage.setItem(
      "bearLevel",
      level
    );


    localStorage.setItem(
      "bearAccessory",
      accessoryIndex
    );

  }

}



/* =========================================================
   ACTUALIZEAZĂ URSULEȚUL
========================================================= */

function updateBearUI(
  save = true
) {

  happiness =
    Math.max(
      0,
      Math.min(
        100,
        happiness
      )
    );


  /*
    LEVEL UP
  */

  if (
    happiness >= 100
  ) {

    level++;

    happiness = 25;


    if (
      bearMessage
    ) {

      bearMessage.textContent =
        "🎉 Ursulețul a crescut! Acum este nivelul " +
        level +
        ". ❤️";

    }

  }


  /*
    BARĂ FERICIRE
  */

  if (
    bearProgress
  ) {

    bearProgress.style.width =
      happiness +
      "%";

  }


  /*
    NIVEL
  */

  if (
    bearLevel
  ) {

    bearLevel.textContent =
      "Nivel " +
      level;

  }


  /*
    VÂRSTĂ / STARE
  */

  if (
    bearAge
  ) {

    if (
      level <= 2
    ) {

      bearAge.textContent =
        "Pui de urs";

    }

    else if (
      level <= 5
    ) {

      bearAge.textContent =
        "Ursuleț iubitor";

    }

    else if (
      level <= 10
    ) {

      bearAge.textContent =
        "Ursuleț fericit";

    }

    else {

      bearAge.textContent =
        "Ursul iubirii ❤️";

    }

  }


  /*
    ACCESORIU
  */

  if (
    bearAccessory
  ) {

    bearAccessory.textContent =
      accessories[
        accessoryIndex
      ] ||
      "";

  }


  /*
    SALVARE
  */

  if (
    save
  ) {

    saveBearState();

  }

}



/* =========================================================
   INIMIOARE
========================================================= */

function createHearts() {

  if (
    !realBear
  ) {
    return;
  }


  const rect =
    realBear
      .getBoundingClientRect();


  const heartTypes = [
    "❤️",
    "💕",
    "💗",
    "💖",
    "💞"
  ];


  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const heart =
      document.createElement(
        "span"
      );


    heart.className =
      "bear-heart";


    heart.textContent =
      heartTypes[
        Math.floor(
          Math.random() *
          heartTypes.length
        )
      ];


    heart.style.left =
      rect.left +
      rect.width / 2 +
      (
        Math.random() *
        100 -
        50
      ) +
      "px";


    heart.style.top =
      rect.top +
      rect.height *
      0.55 +
      "px";


    heart.style.animationDelay =
      i *
      0.06 +
      "s";


    document.body.appendChild(
      heart
    );


    setTimeout(
      function () {

        heart.remove();

      },
      1800
    );

  }

}



/* =========================================================
   ANIMAȚIE
========================================================= */

function animateBear() {

  if (
    !bearWrap
  ) {
    return;
  }


  bearWrap.classList.remove(
    "bear-jump"
  );


  void bearWrap.offsetWidth;


  bearWrap.classList.add(
    "bear-jump"
  );


  setTimeout(
    function () {

      bearWrap.classList.remove(
        "bear-jump"
      );

    },
    700
  );

}



/* =========================================================
   MÂNGÂIE URSULEȚUL
========================================================= */

function petBear() {

  animateBear();

  createHearts();


  happiness += 8;


  const randomMessage =
    messages[
      Math.floor(
        Math.random() *
        messages.length
      )
    ];


  if (
    bearMessage
  ) {

    bearMessage.textContent =
      randomMessage;

  }


  /*
    updateBearUI salvează automat
    și în Supabase.
  */

  updateBearUI();

}



/* =========================================================
   CLICK PE URSULEȚ
========================================================= */

if (
  realBear
) {

  realBear.addEventListener(
    "click",
    petBear
  );

}



/* =========================================================
   BUTON MÂNGÂIE
========================================================= */

if (
  petBearButton
) {

  petBearButton.addEventListener(
    "click",
    petBear
  );

}



/* =========================================================
   SCHIMBĂ ACCESORIUL
========================================================= */

if (
  changeBearItemButton
) {

  changeBearItemButton
    .addEventListener(
      "click",
      function () {

        accessoryIndex++;


        if (
          accessoryIndex >=
          accessories.length
        ) {

          accessoryIndex = 0;

        }


        if (
          bearAccessory
        ) {

          bearAccessory.textContent =
            accessories[
              accessoryIndex
            ];

        }


        animateBear();


        if (
          bearMessage
        ) {

          bearMessage.textContent =
            accessoryIndex === 0
              ? "Ursulețul nu mai poartă nimic. 🧸"
              : "Ursulețul are un obiect nou. ❤️";

        }


        /*
          Salvăm accesoriul
          și pe cont.
        */

        saveBearState();

      }
    );

}



/* =========================================================
   REÎNCARCĂ URSULEȚUL DIN CONT
========================================================= */

async function reloadBearFromCloud() {

  /*
    Descărcăm ultimele date
    ale contului.
  */

  if (
    typeof window.loadAppDataFromCloud ===
    "function"
  ) {

    await window
      .loadAppDataFromCloud();

  }


  /*
    După sincronizare,
    citim valorile noi.
  */

  loadBearState();


  /*
    Actualizăm fără să retrimitem
    imediat aceleași date.
  */

  updateBearUI(
    false
  );

}



/* =========================================================
   EXPORT
========================================================= */

window.reloadBearFromCloud =
  reloadBearFromCloud;


window.reloadBearFromStorage =
  function () {

    loadBearState();

    updateBearUI(
      false
    );

  };



/* =========================================================
   START
========================================================= */

async function startBear() {

  /*
    Dacă suntem conectați,
    luăm întâi progresul din cont.
  */

  if (
    typeof window.loadAppDataFromCloud ===
    "function"
  ) {

    await window
      .loadAppDataFromCloud();

  }


  loadBearState();


  updateBearUI(
    false
  );

}


startBear();