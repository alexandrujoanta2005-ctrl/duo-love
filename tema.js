/* =========================================================
   TEMA GLOBALĂ + FONT + ACCENT + MENIU PWA + BLOCARE ZOOM
   VARIANTĂ FINALĂ
========================================================= */

(function () {

  if (window.__loveAppThemeStarted) {
    return;
  }

  window.__loveAppThemeStarted = true;


  /* =========================================================
     TEME
  ========================================================= */

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
     PAGINI MENIU
  ========================================================= */

  const PAGES = [
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
      file: "love-studio.html",
      icon: "✨",
      name: "Love AI"
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


  /* =========================================================
     FONTURI
  ========================================================= */

  const FONT_MAP = {

    "romantic-serif":
      'Georgia, "Times New Roman", serif',

    "editorial":
      '"Times New Roman", Times, serif',

    "refined":
      'Baskerville, "Palatino Linotype", Palatino, serif',

    "modern":
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',

    "classic":
      'Garamond, Georgia, "Times New Roman", serif',

    "handwritten":
      '"Snell Roundhand", "Segoe Script", "Brush Script MT", cursive',


    /* compatibilitate cu valorile vechi */

    "system":
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',

    "serif":
      'Georgia, "Times New Roman", serif',

    "rounded":
      '"Arial Rounded MT Bold", Arial, sans-serif',

    "romantic":
      'Georgia, "Times New Roman", serif'

  };


  /* =========================================================
     CULORI ACCENT
  ========================================================= */

  const ACCENTS = {

    rose: {
      hex: "#d96898",
      rgb: "217,104,152"
    },

    coral: {
      hex: "#df716b",
      rgb: "223,113,107"
    },

    lavender: {
      hex: "#8b72d8",
      rgb: "139,114,216"
    },

    ocean: {
      hex: "#2f97ad",
      rgb: "47,151,173"
    },

    champagne: {
      hex: "#c79b32",
      rgb: "199,155,50"
    },

    evergreen: {
      hex: "#419171",
      rgb: "65,145,113"
    }

  };


  let navigationLocked = false;


  /* =========================================================
     ȘTERGE TEME VECHI
  ========================================================= */

  function clearThemes() {

    if (!document.body) {
      return;
    }


    THEMES.forEach(
      function (theme) {

        document.body.classList.remove(
          "bg-" + theme
        );

        document.body.classList.remove(
          "theme-" + theme
        );

      }
    );


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


    /* FUNDAL DIN GALERIE */

    if (
      selectedTheme === "custom" &&
      customBackground
    ) {

      document.body.classList.add(
        "bg-custom"
      );


      document.body.style.setProperty(
        "background-image",
        "linear-gradient(" +
          "rgba(5,5,10,.25)," +
          "rgba(5,5,10,.45)" +
        "), url('" +
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


    /* DACĂ FUNDALUL CUSTOM NU MAI EXISTĂ */

    if (
      selectedTheme === "custom" &&
      !customBackground
    ) {

      selectedTheme =
        "dark";


      localStorage.setItem(
        "selectedTheme",
        "dark"
      );

    }


    /* VERIFICĂ TEMA */

    if (
      !THEMES.includes(
        selectedTheme
      )
    ) {

      selectedTheme =
        "dark";


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
     NORMALIZEAZĂ FONT VECHI
  ========================================================= */

  function normalizeFont(
    font
  ) {

    const aliases = {

      system:
        "modern",

      serif:
        "romantic-serif",

      rounded:
        "modern",

      romantic:
        "romantic-serif"

    };


    const candidate =
      aliases[font] ||
      font;


    if (
      FONT_MAP[candidate]
    ) {

      return candidate;

    }


    return "modern";

  }


  /* =========================================================
     FONT GLOBAL
  ========================================================= */

  function applyGlobalFont() {

    if (!document.body) {
      return;
    }


    const savedFont =
      normalizeFont(
        localStorage.getItem(
          "appFont"
        ) ||
        "romantic-serif"
      );


    let savedSize =
      Number(
        localStorage.getItem(
          "appFontSize"
        ) ||
        "100"
      );


    if (
      !Number.isFinite(
        savedSize
      )
    ) {

      savedSize =
        100;

    }


    savedSize =
      Math.max(
        85,
        Math.min(
          130,
          savedSize
        )
      );


    const classes = [

      "font-romantic-serif",
      "font-editorial",
      "font-refined",
      "font-modern",
      "font-classic",
      "font-handwritten",

      "font-system",
      "font-serif",
      "font-rounded",
      "font-romantic"

    ];


    classes.forEach(
      function (className) {

        document.body.classList.remove(
          className
        );

      }
    );


    document.body.classList.add(
      "font-" + savedFont
    );


    document.body.style.setProperty(
      "--app-font-family",
      FONT_MAP[savedFont]
    );


    document.body.style.setProperty(
      "--app-font-scale",
      String(
        savedSize /
        100
      )
    );

  }


  /* =========================================================
     ACCENT GLOBAL
  ========================================================= */

  function applyGlobalAccent() {

    if (!document.body) {
      return;
    }


    let accent =
      localStorage.getItem(
        "appAccent"
      ) ||
      "rose";


    if (
      !ACCENTS[accent]
    ) {

      accent =
        "rose";


      localStorage.setItem(
        "appAccent",
        accent
      );

    }


    const value =
      ACCENTS[accent];


    document.body.dataset.accent =
      accent;


    document.body.style.setProperty(
      "--app-accent",
      value.hex
    );


    document.body.style.setProperty(
      "--app-accent-rgb",
      value.rgb
    );


    document.body.style.setProperty(
      "--app-accent-soft",
      "rgba(" +
        value.rgb +
        ", .22)"
    );

  }


  /* =========================================================
     PAGINA CURENTĂ
  ========================================================= */

  function getCurrentPage() {

    let currentPage =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    if (
      !currentPage ||
      currentPage === "/"
    ) {

      currentPage =
        "index.html";

    }


    return currentPage;

  }


  /* =========================================================
     MUTĂ MENIUL DIRECT ÎN BODY
  ========================================================= */

  function moveNavigationToBody() {

    const nav =
      document.querySelector(
        ".bottom-nav"
      );


    if (!nav) {
      return null;
    }


    if (
      nav.parentElement !==
      document.body
    ) {

      document.body.appendChild(
        nav
      );

    }


    return nav;

  }


  /* =========================================================
     MENIU GLOBAL
  ========================================================= */

  function createPWANavigation() {

    const nav =
      moveNavigationToBody();


    if (!nav) {
      return;
    }


    const currentPage =
      getCurrentPage();


    nav.innerHTML =
      "";


    PAGES.forEach(
      function (page) {


        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "nav-item";


        button.dataset.page =
          page.file;


        button.setAttribute(
          "aria-label",
          page.name
        );


        /* ACTIV */

        if (
          currentPage ===
          page.file
        ) {

          button.classList.add(
            "active"
          );


          button.setAttribute(
            "aria-current",
            "page"
          );

        }


        button.innerHTML =
          '<span class="nav-icon">' +
            page.icon +
          "</span>" +

          "<span>" +
            page.name +
          "</span>";


        /* CLICK */

        button.addEventListener(
          "click",
          function (event) {


            event.preventDefault();

            event.stopPropagation();


            const actualPage =
              getCurrentPage();


            /* DACĂ EȘTI DEJA PE PAGINA ASTA,
               NU MAI DĂ RELOAD */

            if (
              actualPage ===
              page.file
            ) {

              return;

            }


            /* BLOCARE CLICKURI FOARTE RAPIDE */

            if (
              navigationLocked
            ) {

              return;

            }


            navigationLocked =
              true;


            const currentURL =
              new URL(
                window.location.href
              );


            const currentPath =
              currentURL.pathname;


            const lastSlash =
              currentPath.lastIndexOf(
                "/"
              );


            const folder =
              currentPath.substring(
                0,
                lastSlash + 1
              );


            const destination =
              currentURL.origin +
              folder +
              page.file;


            window.location.href =
              destination;


            setTimeout(
              function () {

                navigationLocked =
                  false;

              },
              700
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
     ȘTERGE TARGET BLANK
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
     BLOCARE ZOOM
  ========================================================= */

  function disableZoom() {


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
          event.touches.length >
          1
        ) {

          event.preventDefault();

        }

      },
      {
        passive: false
      }
    );


    document.addEventListener(
      "dblclick",
      function (event) {

        event.preventDefault();

      },
      {
        passive: false
      }
    );

  }


  /* =========================================================
     FIX TAP IPHONE
  ========================================================= */

  function fixNavigationTap() {

    const nav =
      document.querySelector(
        ".bottom-nav"
      );


    if (!nav) {
      return;
    }


    nav.style.setProperty(
      "-webkit-tap-highlight-color",
      "transparent",
      "important"
    );


    nav.style.setProperty(
      "-webkit-user-select",
      "none",
      "important"
    );


    nav.style.setProperty(
      "user-select",
      "none",
      "important"
    );


    nav
      .querySelectorAll(
        ".nav-item"
      )
      .forEach(
        function (button) {


          button.style.setProperty(
            "-webkit-tap-highlight-color",
            "transparent",
            "important"
          );


          button.style.setProperty(
            "touch-action",
            "manipulation",
            "important"
          );

        }
      );

  }


  /* =========================================================
     BUTON ACTIV
  ========================================================= */

  function updateActiveNavigation() {

    const currentPage =
      getCurrentPage();


    document
      .querySelectorAll(
        ".bottom-nav .nav-item"
      )
      .forEach(
        function (button) {


          const page =
            (
              button.dataset.page ||
              ""
            ).toLowerCase();


          const active =
            page ===
            currentPage;


          button.classList.toggle(
            "active",
            active
          );


          if (
            active
          ) {

            button.setAttribute(
              "aria-current",
              "page"
            );

          }

          else {

            button.removeAttribute(
              "aria-current"
            );

          }

        }
      );

  }


  /* =========================================================
     PORNIRE
  ========================================================= */

  function startAppGlobal() {

    applyGlobalBackground();

    applyGlobalFont();

    applyGlobalAccent();

    removeExternalTargets();

    createPWANavigation();

    fixNavigationTap();

    disableZoom();

    updateActiveNavigation();

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startAppGlobal,
      {
        once: true
      }
    );

  }

  else {

    startAppGlobal();

  }


  /* =========================================================
     IOS CACHE
  ========================================================= */

  window.addEventListener(
    "pageshow",
    function () {


      navigationLocked =
        false;


      applyGlobalBackground();

      applyGlobalFont();

      applyGlobalAccent();

      updateActiveNavigation();

      fixNavigationTap();

    }
  );


  /* =========================================================
     FUNCȚII PUBLICE
  ========================================================= */

  window.applyGlobalBackground =
    applyGlobalBackground;


  window.applyGlobalFont =
    applyGlobalFont;


  window.applyGlobalAccent =
    applyGlobalAccent;


  window.updateActiveNavigation =
    updateActiveNavigation;

})();