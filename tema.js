/* =========================================================
   TEMA GLOBALĂ + FONT + NAVIGARE PWA + BLOCARE ZOOM
========================================================= */

(function () {

  const THEMES = [
    "aurora",
    "mesh",
    "starlight",
    "silk",
    "plain",
    "nature",
    "stars",
    "moon",
    "clouds",
    "cozy",
    "pastel",
    "dark",
    "custom"
  ];


  /* =========================================================
     ȘTERGE TEMELE VECHI
  ========================================================= */

  function clearThemes() {

    THEMES.forEach(function (theme) {

      document.body.classList.remove(
        "bg-" + theme
      );

      document.body.classList.remove(
        "theme-" + theme
      );

    });


    document.body.style.removeProperty(
      "background-image"
    );

    document.body.style.removeProperty(
      "background-size"
    );

    document.body.style.removeProperty(
      "background-position"
    );

    document.body.style.removeProperty(
      "background-repeat"
    );

    document.body.style.removeProperty(
      "background-attachment"
    );

  }


  /* =========================================================
     FUNDAL GLOBAL
  ========================================================= */

  function applyGlobalBackground() {

    if (!document.body) {
      return;
    }


    let selectedTheme =
      localStorage.getItem(
        "selectedTheme"
      ) || "dark";


    const customBackground =
      localStorage.getItem(
        "customBackground"
      );


    clearThemes();


    if (
      selectedTheme === "custom" &&
      customBackground
    ) {

      document.body.classList.add(
        "bg-custom"
      );


      document.body.style.setProperty(
        "background-image",
        "linear-gradient(rgba(5,5,10,.25), rgba(5,5,10,.45)), url('" +
          customBackground +
          "')",
        "important"
      );


      document.body.style.setProperty(
        "background-size",
        "cover",
        "important"
      );


      document.body.style.setProperty(
        "background-position",
        "center center",
        "important"
      );


      document.body.style.setProperty(
        "background-repeat",
        "no-repeat",
        "important"
      );


      document.body.style.setProperty(
        "background-attachment",
        "fixed",
        "important"
      );


      return;
    }


    if (
      selectedTheme === "custom" &&
      !customBackground
    ) {

      selectedTheme = "dark";

      localStorage.setItem(
        "selectedTheme",
        "dark"
      );

    }


    document.body.classList.add(
      "bg-" + selectedTheme
    );

  }


  /* =========================================================
     FONT GLOBAL
  ========================================================= */

  function applyGlobalFont() {

    if (!document.body) {
      return;
    }


    const savedFont =
      localStorage.getItem(
        "appFont"
      ) || "system";


    const savedSize =
      Number(
        localStorage.getItem(
          "appFontSize"
        ) || "100"
      );


    const fontClasses = [
      "font-system",
      "font-serif",
      "font-rounded",
      "font-classic",
      "font-romantic"
    ];


    fontClasses.forEach(
      function (fontClass) {

        document.body.classList.remove(
          fontClass
        );

      }
    );


    document.body.classList.add(
      "font-" + savedFont
    );


    document.body.style.setProperty(
      "--app-font-scale",
      savedSize / 100
    );

  }


  /* =========================================================
     MENIU PWA
     ÎNLOCUIEȘTE AUTOMAT BARA DE JOS
  ========================================================= */

  function createPWANavigation() {

    const nav =
      document.querySelector(
        ".bottom-nav"
      );


    if (!nav) {
      return;
    }


    let currentPage =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    if (
      !currentPage ||
      currentPage === "/"
    ) {
      currentPage = "index.html";
    }


    const pages = [
      {
        file: "index.html",
        icon: "🏠",
        name: "Acasă"
      },

      {
        file: "chat.html",
        icon: "💬",
        name: "Chat"
      },

      {
        file: "amintiri.html",
        icon: "📸",
        name: "Amintiri"
      },

      {
        file: "evenimente.html",
        icon: "📅",
        name: "Evenimente"
      },

      {
        file: "setari.html",
        icon: "⚙️",
        name: "Setări"
      }
    ];


    nav.innerHTML = "";


    pages.forEach(
      function (page) {

        const button =
          document.createElement(
            "button"
          );


        button.type = "button";


        button.className =
          "nav-item";


        if (
          currentPage === page.file
        ) {

          button.classList.add(
            "active"
          );

        }


        button.innerHTML =
          '<span class="nav-icon">' +
          page.icon +
          "</span>" +
          "<span>" +
          page.name +
          "</span>";


        button.addEventListener(
          "click",
          function (event) {

            event.preventDefault();

            event.stopPropagation();


            /*
              IMPORTANT:
              folosim aceeași origine,
              același IP și același port.
            */

            const currentURL =
              new URL(
                window.location.href
              );


            let path =
              currentURL.pathname;


            const lastSlash =
              path.lastIndexOf("/");


            const folder =
              path.substring(
                0,
                lastSlash + 1
              );


            const destination =
              currentURL.origin +
              folder +
              page.file;


            window.location.replace(
              destination
            );

          }
        );


        nav.appendChild(
          button
        );

      }
    );

  }


  /* =========================================================
     ELIMINĂ TARGET BLANK
  ========================================================= */

  function removeExternalTargets() {

    document
      .querySelectorAll(
        'a[target="_blank"]'
      )
      .forEach(
        function (link) {

          link.removeAttribute(
            "target"
          );

        }
      );

  }


  /* =========================================================
     BLOCARE PINCH ZOOM / DOUBLE TAP
  ========================================================= */

  function disableZoom() {

    let lastTouchEnd = 0;


    document.addEventListener(
      "touchend",
      function (event) {

        const now =
          Date.now();


        if (
          now -
          lastTouchEnd <=
          300
        ) {

          event.preventDefault();

        }


        lastTouchEnd =
          now;

      },
      {
        passive: false
      }
    );


    document.addEventListener(
      "gesturestart",
      function (event) {

        event.preventDefault();

      },
      {
        passive: false
      }
    );


    document.addEventListener(
      "gesturechange",
      function (event) {

        event.preventDefault();

      },
      {
        passive: false
      }
    );


    document.addEventListener(
      "gestureend",
      function (event) {

        event.preventDefault();

      },
      {
        passive: false
      }
    );


    document.addEventListener(
      "touchmove",
      function (event) {

        if (
          event.touches &&
          event.touches.length > 1
        ) {

          event.preventDefault();

        }

      },
      {
        passive: false
      }
    );

  }


  /* =========================================================
     PORNIRE
  ========================================================= */

  function startAppGlobal() {

    applyGlobalBackground();

    applyGlobalFont();

    removeExternalTargets();

    createPWANavigation();

    disableZoom();

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startAppGlobal
    );

  } else {

    startAppGlobal();

  }


  window.applyGlobalBackground =
    applyGlobalBackground;


  window.applyGlobalFont =
    applyGlobalFont;

})();
/* =========================================================
   MENIU PWA LIPIT DE ECRAN
========================================================= */

function fixBottomNavigation() {

  const nav =
    document.querySelector(".bottom-nav");

  if (!nav) {
    return;
  }

  /*
    Mutăm meniul direct în BODY.
    Astfel position:fixed este raportat
    la ecranul telefonului.
  */
  if (nav.parentElement !== document.body) {
    document.body.appendChild(nav);
  }

}


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    fixBottomNavigation
  );

} else {

  fixBottomNavigation();

}
/* MENIUL ESTE MUTAT DIRECT ÎN BODY */

function moveBottomNavToScreen() {

  const nav =
    document.querySelector(".bottom-nav");

  if (!nav) return;

  if (nav.parentElement !== document.body) {
    document.body.appendChild(nav);
  }

}


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    moveBottomNavToScreen
  );

} else {

  moveBottomNavToScreen();

}