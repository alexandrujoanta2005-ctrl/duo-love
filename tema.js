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
     FUNDALURI CANONICE
     Aceleași valori sunt aplicate inline pe fiecare pagină,
     ca CSS-ul local să nu schimbe aspectul temei.
  ========================================================= */

  const THEME_BACKGROUNDS = {

    dark:
      "radial-gradient(circle at 20% 0%, rgba(120,61,38,.34), transparent 36%), linear-gradient(180deg, #24110d, #140a0e 50%, #07070d)",

    aurora:
      "radial-gradient(circle at 15% 20%, rgba(35,100,170,.5), transparent 35%), radial-gradient(circle at 80% 70%, rgba(170,55,100,.4), transparent 40%), #080810",

    mesh:
      "radial-gradient(circle at 20% 20%, #20375a, transparent 30%), radial-gradient(circle at 80% 40%, #4d1e42, transparent 35%), radial-gradient(circle at 40% 85%, #301c4b, transparent 40%), #0b0b14",

    starlight:
      "radial-gradient(circle at 15% 15%, rgba(255,255,255,.9) 0 1px, transparent 2px), radial-gradient(circle at 70% 30%, rgba(255,255,255,.7) 0 1px, transparent 2px), radial-gradient(circle at 35% 70%, rgba(255,255,255,.65) 0 1px, transparent 2px), linear-gradient(#0b0d20, #191026)",

    silk:
      "linear-gradient(145deg, #130d19, #442139, #1d1930, #130d19)",

    plain:
      "#18151d",

    nature:
      "radial-gradient(circle at top left, rgba(57,112,71,.55), transparent 40%), radial-gradient(circle at bottom right, rgba(90,53,62,.35), transparent 42%), #0e1713",

    stars:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,.9) 0 1px, transparent 2px), radial-gradient(circle at 65% 45%, rgba(255,255,255,.8) 0 1px, transparent 2px), radial-gradient(circle at 80% 80%, rgba(255,255,255,.55) 0 1px, transparent 2px), linear-gradient(#060711, #16132a)",

    moon:
      "radial-gradient(circle at 80% 15%, rgba(220,224,255,.35), transparent 13%), linear-gradient(#07101d, #121323, #170e1c)",

    clouds:
      "radial-gradient(ellipse at 20% 25%, rgba(255,255,255,.15), transparent 30%), radial-gradient(ellipse at 75% 50%, rgba(255,255,255,.10), transparent 35%), linear-gradient(#142032, #1b1a2d, #170f19)",

    cozy:
      "radial-gradient(circle at 70% 70%, rgba(255,150,90,.30), transparent 35%), linear-gradient(#160e12, #281519, #130e17)",

    pastel:
      "radial-gradient(circle at 15% 20%, rgba(199,153,222,.35), transparent 35%), radial-gradient(circle at 80% 65%, rgba(244,150,180,.30), transparent 40%), linear-gradient(#201728, #29172a)"

  };


  /* =========================================================
     TEME SEZONIERE
     Se aplică PESTE fundalul ales, fără să îl înlocuiască.
  ========================================================= */

  const SEASONAL_THEMES = {

    off: {
      label: "Fără efect sezonier",
      emojis: [],
      glow: "transparent"
    },

    valentine: {
      label: "Valentine's 💘",
      emojis: ["💗", "💕", "🌹", "✨"],
      glow: "radial-gradient(circle at 15% 10%, rgba(255,88,154,.22), transparent 34%), radial-gradient(circle at 85% 75%, rgba(255,128,178,.16), transparent 38%)"
    },

    spring: {
      label: "Primăvară 🌸",
      emojis: ["🌸", "🌷", "🌼", "✨"],
      glow: "radial-gradient(circle at 15% 15%, rgba(255,171,210,.16), transparent 34%), radial-gradient(circle at 82% 72%, rgba(128,220,153,.15), transparent 40%)"
    },

    summer: {
      label: "Vară ☀️",
      emojis: ["☀️", "🌻", "✨", "🫧"],
      glow: "radial-gradient(circle at 18% 12%, rgba(255,211,94,.17), transparent 34%), radial-gradient(circle at 82% 78%, rgba(75,190,255,.13), transparent 40%)"
    },

    autumn: {
      label: "Toamnă 🍂",
      emojis: ["🍂", "🍁", "✨", "🤎"],
      glow: "radial-gradient(circle at 15% 15%, rgba(219,132,65,.18), transparent 36%), radial-gradient(circle at 85% 78%, rgba(148,71,50,.15), transparent 42%)"
    },

    halloween: {
      label: "Halloween 🎃",
      emojis: ["🎃", "👻", "🦇", "✨"],
      glow: "radial-gradient(circle at 18% 12%, rgba(255,126,35,.18), transparent 34%), radial-gradient(circle at 82% 74%, rgba(124,71,205,.17), transparent 42%)"
    },

    christmas: {
      label: "Crăciun 🎄",
      emojis: ["❄️", "🎄", "✨", "🎁"],
      glow: "radial-gradient(circle at 16% 12%, rgba(218,54,72,.15), transparent 34%), radial-gradient(circle at 84% 76%, rgba(46,158,106,.16), transparent 42%)"
    },

    winter: {
      label: "Iarnă ❄️",
      emojis: ["❄️", "✨", "🤍", "🫧"],
      glow: "radial-gradient(circle at 15% 12%, rgba(146,195,255,.16), transparent 35%), radial-gradient(circle at 82% 76%, rgba(218,231,255,.12), transparent 42%)"
    },

    newyear: {
      label: "Anul Nou 🎆",
      emojis: ["✨", "🎆", "⭐", "🥂"],
      glow: "radial-gradient(circle at 18% 12%, rgba(255,206,82,.18), transparent 34%), radial-gradient(circle at 82% 74%, rgba(147,93,255,.18), transparent 42%)"
    }

  };


  function getAutomaticSeasonalTheme(
    date = new Date()
  ) {

    const month =
      date.getMonth() + 1;

    const day =
      date.getDate();


    if (
      (month === 12 && day >= 27) ||
      (month === 1 && day <= 7)
    ) {
      return "newyear";
    }


    if (
      month === 12
    ) {
      return "christmas";
    }


    if (
      month === 2 &&
      day <= 16
    ) {
      return "valentine";
    }


    if (
      month === 1 ||
      month === 2
    ) {
      return "winter";
    }


    if (
      month >= 3 &&
      month <= 5
    ) {
      return "spring";
    }


    if (
      month >= 6 &&
      month <= 8
    ) {
      return "summer";
    }


    if (
      month === 10 &&
      day >= 21 ||
      month === 11 &&
      day <= 3
    ) {
      return "halloween";
    }


    return "autumn";

  }


  function getSeasonalSelection() {

    const saved =
      localStorage.getItem(
        "duoSeasonalTheme"
      ) ||
      "auto";


    if (
      saved === "auto" ||
      Object.prototype.hasOwnProperty.call(
        SEASONAL_THEMES,
        saved
      )
    ) {
      return saved;
    }


    return "auto";

  }


  function getResolvedSeasonalTheme() {

    const selected =
      getSeasonalSelection();


    return selected === "auto"
      ? getAutomaticSeasonalTheme()
      : selected;

  }


  function ensureSeasonalStyle() {

    if (
      document.getElementById(
        "duoSeasonalStyle"
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "duoSeasonalStyle";


    style.textContent = `
      #duoSeasonalOverlay{
        position:fixed;
        inset:0;
        z-index:40;
        overflow:hidden;
        pointer-events:none!important;
        background:var(--duo-season-glow,transparent);
        opacity:.58;
        transition:opacity .3s ease;
      }

      #duoSeasonalOverlay[hidden]{
        display:none!important;
      }

      #duoSeasonalOverlay .duo-season-particle{
        position:absolute;
        top:-12vh;
        display:block;
        opacity:.22;
        font-size:var(--duo-season-size,20px);
        line-height:1;
        filter:drop-shadow(0 4px 10px rgba(0,0,0,.18));
        animation:duoSeasonFall var(--duo-season-duration,15s) linear infinite;
        animation-delay:var(--duo-season-delay,0s);
        will-change:transform;
      }

      @keyframes duoSeasonFall{
        from{transform:translate3d(0,-12vh,0) rotate(0deg)}
        to{transform:translate3d(var(--duo-season-drift,20px),118vh,0) rotate(330deg)}
      }

      @media (prefers-reduced-motion:reduce){
        #duoSeasonalOverlay .duo-season-particle{
          animation:none!important;
          display:none!important;
        }
      }
    `;


    document.head.appendChild(
      style
    );

  }


  function ensureSeasonalOverlay() {

    let overlay =
      document.getElementById(
        "duoSeasonalOverlay"
      );


    if (
      overlay
    ) {
      return overlay;
    }


    overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      "duoSeasonalOverlay";


    overlay.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.appendChild(
      overlay
    );


    return overlay;

  }


  function applySeasonalTheme() {

    if (
      !document.body
    ) {
      return;
    }


    ensureSeasonalStyle();


    const selection =
      getSeasonalSelection();


    const resolved =
      getResolvedSeasonalTheme();


    const meta =
      SEASONAL_THEMES[resolved] ||
      SEASONAL_THEMES.off;


    document.body.dataset.duoSeasonSelection =
      selection;


    document.body.dataset.duoSeason =
      resolved;


    const overlay =
      ensureSeasonalOverlay();


    overlay.innerHTML =
      "";


    overlay.style.setProperty(
      "--duo-season-glow",
      meta.glow || "transparent"
    );


    if (
      resolved === "off" ||
      !meta.emojis.length
    ) {

      overlay.hidden =
        true;

    } else {

      overlay.hidden =
        false;


      for (
        let index = 0;
        index < 14;
        index++
      ) {

        const particle =
          document.createElement(
            "span"
          );


        particle.className =
          "duo-season-particle";


        particle.textContent =
          meta.emojis[
            index %
            meta.emojis.length
          ];


        particle.style.left =
          (
            3 +
            (index * 7.1) % 94
          ) +
          "%";


        particle.style.setProperty(
          "--duo-season-size",
          (
            15 +
            (index % 5) * 3
          ) +
          "px"
        );


        particle.style.setProperty(
          "--duo-season-duration",
          (
            13 +
            (index % 6) * 2.2
          ) +
          "s"
        );


        particle.style.setProperty(
          "--duo-season-delay",
          (-index * 1.7) +
          "s"
        );


        particle.style.setProperty(
          "--duo-season-drift",
          (
            index % 2 === 0
              ? 26
              : -22
          ) +
          "px"
        );


        overlay.appendChild(
          particle
        );

      }

    }


    try {

      window.dispatchEvent(
        new CustomEvent(
          "duo-season-change",
          {
            detail: {
              selected:
                selection,
              resolved:
                resolved,
              label:
                meta.label
            }
          }
        )
      );

    } catch (error) {
    }

  }


  function getDuoSeasonInfo() {

    const selected =
      getSeasonalSelection();


    const resolved =
      getResolvedSeasonalTheme();


    const meta =
      SEASONAL_THEMES[resolved] ||
      SEASONAL_THEMES.off;


    return {
      selected,
      resolved,
      label:
        meta.label,
      automatic:
        selected === "auto"
    };

  }


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
      file: "harta.html",
      icon: "📍",
      name: "Harta noastră"
    },

    {
      file: "love-ai/index.html",
      icon: "💖",
      name: "Love AI",
      external: true
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
      "background"
    );

    document.body.style.removeProperty(
      "background-color"
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
        "background-color",
        "#07070d",
        "important"
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


    const canonicalBackground =
      THEME_BACKGROUNDS[selectedTheme] ||
      THEME_BACKGROUNDS.dark;


    document.body.style.setProperty(
      "background",
      canonicalBackground,
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


    if (
      nav.dataset.preserveLinks ===
      "true"
    ) {
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
              page.external
                ? page.file
                : currentURL.origin +
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
     ACTUALIZARE PWA - EVITĂ RĂMÂNEREA PE CACHE VECHI
  ========================================================= */

  function setupPWAControllerRefresh() {

    if (
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      function () {

        const reloadKey =
          "__duoLoveSwReloadV60";

        try {
          if (sessionStorage.getItem(reloadKey)) return;
          sessionStorage.setItem(reloadKey, "1");
        } catch (error) {
        }

        window.location.reload();
      }
    );

  }


  setupPWAControllerRefresh();


  /* =========================================================
     PORNIRE
  ========================================================= */

  function startAppGlobal() {

    applyGlobalBackground();

    applyGlobalFont();

    applyGlobalAccent();

    applySeasonalTheme();

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

      applySeasonalTheme();

      updateActiveNavigation();

      fixNavigationTap();

    }
  );


  /* =========================================================
     SINCRONIZARE TEMĂ ÎNTRE PAGINI / TAB-URI
  ========================================================= */

  window.addEventListener(
    "storage",
    function (event) {

      if (
        event.key === "selectedTheme" ||
        event.key === "customBackground" ||
        event.key === "appFont" ||
        event.key === "appFontSize" ||
        event.key === "appAccent" ||
        event.key === "duoSeasonalTheme" ||
        event.key === null
      ) {

        applyGlobalBackground();
        applyGlobalFont();
        applyGlobalAccent();
        applySeasonalTheme();

      }

    }
  );


  window.addEventListener(
    "duo-theme-change",
    function () {

      applyGlobalBackground();
      applyGlobalFont();
      applyGlobalAccent();
      applySeasonalTheme();

    }
  );


  window.addEventListener(
    "duolove:setting-changed",
    function (event) {

      if (
        event &&
        event.detail &&
        event.detail.key === "duoSeasonalTheme"
      ) {
        applySeasonalTheme();
      }

    }
  );


  window.addEventListener(
    "duolove:cloud-applied",
    function () {
      applyGlobalBackground();
      applyGlobalFont();
      applyGlobalAccent();
      applySeasonalTheme();
    }
  );


  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        document.visibilityState ===
        "visible"
      ) {

        applyGlobalBackground();
        applyGlobalFont();
        applyGlobalAccent();
        applySeasonalTheme();

      }

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


  window.applySeasonalTheme =
    applySeasonalTheme;


  window.getDuoSeasonInfo =
    getDuoSeasonInfo;


  window.updateActiveNavigation =
    updateActiveNavigation;

})();