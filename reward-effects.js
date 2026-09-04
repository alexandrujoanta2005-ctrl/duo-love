/* =========================================================
   DUO LOVE ❤️ - RECOMPENSE ANIMATE
   v35

   Deblocări:
   100 XP  - Inimi Animate
   150 XP  - Muzică Ambientală
   200 XP  - Touch Sparkles
   300 XP  - Love Pulse
   400 XP  - Stele Căzătoare
   450 XP  - Amândoi Aici
========================================================= */

(function () {

  "use strict";


  const EFFECTS = [
    {
      id: "hearts",
      storageKey: "rewardEffectHearts",
      xp: 100,
      icon: "🎆",
      title: "Inimi Animate",
      description: "Inimioare animate apar discret în aplicație."
    },
    {
      id: "music",
      storageKey: "rewardAmbientMusic",
      xp: 150,
      icon: "🎵",
      title: "Muzică Ambientală",
      description: "Muzică instrumentală discretă, cu volum reglabil."
    },
    {
      id: "sparkles",
      storageKey: "rewardEffectSparkles",
      xp: 200,
      icon: "✨",
      title: "Touch Sparkles",
      description: "Scântei și inimioare apar unde atingi ecranul."
    },
    {
      id: "pulse",
      storageKey: "rewardEffectPulse",
      xp: 300,
      icon: "💞",
      title: "Love Pulse",
      description: "Poza voastră pulsează discret cu un glow romantic."
    },
    {
      id: "stars",
      storageKey: "rewardEffectStars",
      xp: 400,
      icon: "🌠",
      title: "Stele Căzătoare",
      description: "Stele căzătoare apar din când în când."
    },
    {
      id: "together",
      storageKey: "rewardEffectTogether",
      xp: 450,
      icon: "💗",
      title: "Amândoi Aici",
      description: "Celebrare cu inimioare când ați intrat amândoi în aceeași zi."
    }
  ];


  let xpInfo = {
    totalXP: 0,
    availableXP: 0,
    usersToday: 0
  };


  let heartsTimer = null;
  let starsTimer = null;
  let touchBound = false;
  let togetherShownThisRun = false;

  let ambientAudioContext = null;
  let ambientMasterGain = null;
  let ambientTimer = null;
  let ambientChordIndex = 0;
  let ambientGestureBound = false;

  const AMBIENT_CHORDS = [
    [220.00, 261.63, 329.63],
    [196.00, 246.94, 293.66],
    [174.61, 220.00, 261.63],
    [196.00, 246.94, 329.63]
  ];


  function getPreference(
    effect
  ) {

    const value =
      localStorage.getItem(
        effect.storageKey
      );


    /*
      Deblocările sunt pornite implicit.
      Utilizatorul le poate opri din Setări.
    */

    return value !== "false";

  }


  function setPreference(
    effect,
    enabled
  ) {

    localStorage.setItem(
      effect.storageKey,
      enabled
        ? "true"
        : "false"
    );

  }


  function isUnlocked(
    effect
  ) {

    return (
      Number(
        xpInfo.totalXP
      ) || 0
    ) >= effect.xp;

  }


  function isEnabled(
    effect
  ) {

    return (
      isUnlocked(
        effect
      ) &&
      getPreference(
        effect
      )
    );

  }


  function getEffect(
    id
  ) {

    return EFFECTS.find(
      effect =>
        effect.id === id
    );

  }


  function ensureStyles() {

    if (
      document.getElementById(
        "duoRewardEffectsStyles"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "duoRewardEffectsStyles";


    style.textContent = `

      #duoRewardFxLayer {
        position: fixed;
        inset: 0;
        z-index: 2500000;
        overflow: hidden;
        pointer-events: none;
      }


      .duo-floating-heart {
        position: absolute;
        bottom: -40px;
        opacity: 0;
        font-size: 20px;
        filter:
          drop-shadow(
            0 4px 12px
            rgba(255, 90, 150, .30)
          );
        animation:
          duoHeartFloat
          5.6s
          ease-in
          forwards;
      }


      @keyframes duoHeartFloat {
        0% {
          opacity: 0;
          transform:
            translate3d(0, 25px, 0)
            scale(.75)
            rotate(-8deg);
        }

        12% {
          opacity: .72;
        }

        75% {
          opacity: .45;
        }

        100% {
          opacity: 0;
          transform:
            translate3d(
              var(--drift, 20px),
              -108vh,
              0
            )
            scale(1.25)
            rotate(18deg);
        }
      }


      .duo-touch-spark {
        position: fixed;
        z-index: 2600000;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation:
          duoSparkPop
          .72s
          ease-out
          forwards;
      }


      @keyframes duoSparkPop {
        0% {
          opacity: 0;
          transform:
            translate(-50%, -50%)
            translate(0, 0)
            scale(.4);
        }

        20% {
          opacity: 1;
        }

        100% {
          opacity: 0;
          transform:
            translate(-50%, -50%)
            translate(
              var(--sx),
              var(--sy)
            )
            scale(1.15);
        }
      }


      .duo-love-pulse {
        animation:
          duoLovePulse
          2.8s
          ease-in-out
          infinite !important;
        transform-origin: center center;
      }


      @keyframes duoLovePulse {
        0%,
        100% {
          transform: scale(1);
          filter:
            drop-shadow(
              0 0 0
              rgba(255, 104, 168, 0)
            );
        }

        50% {
          transform: scale(1.025);
          filter:
            drop-shadow(
              0 0 16px
              rgba(255, 104, 168, .42)
            );
        }
      }


      .duo-shooting-star {
        position: absolute;
        top: var(--star-top);
        left: -90px;
        width: 82px;
        height: 2px;
        border-radius: 999px;
        opacity: 0;
        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.95)
          );
        box-shadow:
          28px 0 16px
          rgba(210, 184, 255, .55);
        transform: rotate(-18deg);
        animation:
          duoShootingStar
          1.25s
          ease-out
          forwards;
      }


      .duo-shooting-star::after {
        content: "✦";
        position: absolute;
        right: -4px;
        top: -9px;
        color: white;
        font-size: 15px;
      }


      @keyframes duoShootingStar {
        0% {
          opacity: 0;
          transform:
            translate3d(0,0,0)
            rotate(-18deg);
        }

        12% {
          opacity: .9;
        }

        100% {
          opacity: 0;
          transform:
            translate3d(
              calc(100vw + 180px),
              210px,
              0
            )
            rotate(-18deg);
        }
      }


      .duo-together-celebration {
        position: fixed;
        inset: 0;
        z-index: 5000000;
        display: grid;
        place-items: center;
        pointer-events: none;
        background:
          radial-gradient(
            circle at center,
            rgba(205, 92, 148, .22),
            rgba(7, 7, 13, 0) 62%
          );
        animation:
          duoTogetherFade
          2.8s
          ease
          forwards;
      }


      .duo-together-card {
        padding: 22px 25px;
        border:
          1px solid
          rgba(255,255,255,.14);
        border-radius: 24px;
        background:
          rgba(15, 9, 20, .94);
        color: white;
        text-align: center;
        box-shadow:
          0 20px 60px
          rgba(0,0,0,.40);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        animation:
          duoTogetherCard
          2.8s
          ease
          forwards;
      }


      .duo-together-card strong {
        display: block;
        font-size: 24px;
      }


      .duo-together-card span {
        display: block;
        margin-top: 7px;
        color:
          rgba(255,255,255,.72);
        font-size: 13px;
      }


      @keyframes duoTogetherFade {
        0%,
        100% {
          opacity: 0;
        }

        12%,
        78% {
          opacity: 1;
        }
      }


      @keyframes duoTogetherCard {
        0% {
          opacity: 0;
          transform: scale(.76);
        }

        18% {
          opacity: 1;
          transform: scale(1.04);
        }

        28%,
        78% {
          opacity: 1;
          transform: scale(1);
        }

        100% {
          opacity: 0;
          transform: scale(.94);
        }
      }


      .reward-effects-xp {
        margin:
          -5px 0 14px;
        padding: 11px 13px;
        border-radius: 15px;
        background:
          rgba(255,255,255,.05);
        color:
          rgba(255,255,255,.72);
        font-size: 13px;
      }


      .reward-effect-list {
        display: grid;
        gap: 9px;
      }


      .reward-effect-row {
        display: grid;
        grid-template-columns:
          auto
          minmax(0, 1fr)
          auto;
        align-items: center;
        gap: 11px;
        padding: 12px;
        border:
          1px solid
          rgba(255,255,255,.08);
        border-radius: 17px;
        background:
          rgba(255,255,255,.04);
      }


      .reward-effect-row.locked {
        opacity: .58;
      }


      .reward-effect-icon {
        display: grid;
        place-items: center;
        width: 43px;
        height: 43px;
        border-radius: 14px;
        background:
          rgba(255,255,255,.06);
        font-size: 21px;
      }


      .reward-effect-copy {
        min-width: 0;
      }


      .reward-effect-copy strong,
      .reward-effect-copy span,
      .reward-effect-copy small {
        display: block;
      }


      .reward-effect-copy strong {
        color: white;
        font-size: 13px;
      }


      .reward-effect-copy span {
        margin-top: 3px;
        color:
          rgba(255,255,255,.55);
        font-size: 11px;
        line-height: 1.35;
      }


      .reward-effect-copy small {
        margin-top: 5px;
        color: #ef93bd;
        font-size: 10px;
        font-weight: 700;
      }


      .reward-effect-switch {
        position: relative;
        width: 48px;
        height: 28px;
      }


      .reward-effect-switch input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }


      .reward-effect-slider {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background:
          rgba(255,255,255,.12);
        transition:
          .2s ease;
        cursor: pointer;
      }


      .reward-effect-slider::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 4px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        transition:
          .2s ease;
      }


      .reward-effect-switch
      input:checked +
      .reward-effect-slider {
        background:
          linear-gradient(
            135deg,
            #c95887,
            #993f6b
          );
      }


      .reward-effect-switch
      input:checked +
      .reward-effect-slider::after {
        transform: translateX(20px);
      }


      .reward-effect-switch
      input:disabled +
      .reward-effect-slider {
        cursor: default;
        opacity: .45;
      }


      .reward-music-controls {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns:
          minmax(0, 1fr)
          auto;
        align-items: center;
        gap: 9px;
        margin-top: 3px;
        padding-top: 10px;
        border-top:
          1px solid
          rgba(255,255,255,.07);
      }


      .reward-music-volume {
        display: grid;
        grid-template-columns:
          auto
          minmax(0, 1fr)
          auto;
        align-items: center;
        gap: 8px;
        color:
          rgba(255,255,255,.62);
        font-size: 10px;
        font-weight: 700;
      }


      .reward-music-volume input {
        width: 100%;
        accent-color: #d56191;
      }


      .reward-music-button {
        min-height: 36px;
        padding:
          8px 11px;
        border: 0;
        border-radius: 12px;
        background:
          rgba(201,88,135,.20);
        color: white;
        font: inherit;
        font-size: 10px;
        font-weight: 800;
        cursor: pointer;
      }


      .reward-music-button:disabled {
        opacity: .45;
        cursor: default;
      }


      @media (
        prefers-reduced-motion:
        reduce
      ) {

        .duo-floating-heart,
        .duo-touch-spark,
        .duo-love-pulse,
        .duo-shooting-star,
        .duo-together-celebration,
        .duo-together-card {
          animation: none !important;
        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  function ensureLayer() {

    let layer =
      document.getElementById(
        "duoRewardFxLayer"
      );


    if (
      layer
    ) {

      return layer;

    }


    layer =
      document.createElement(
        "div"
      );


    layer.id =
      "duoRewardFxLayer";


    layer.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.appendChild(
      layer
    );


    return layer;

  }


  function getAmbientMusicVolume() {

    const saved =
      Number(
        localStorage.getItem(
          "rewardAmbientMusicVolume"
        )
      );


    if (
      Number.isFinite(
        saved
      )
    ) {

      return Math.min(
        1,
        Math.max(
          0.05,
          saved
        )
      );

    }


    return 0.35;

  }


  function setAmbientMusicVolume(
    value
  ) {

    const safe =
      Math.min(
        1,
        Math.max(
          0.05,
          Number(
            value
          ) || 0.35
        )
      );


    localStorage.setItem(
      "rewardAmbientMusicVolume",
      String(
        safe
      )
    );


    if (
      ambientMasterGain &&
      ambientAudioContext
    ) {

      const now =
        ambientAudioContext
          .currentTime;


      ambientMasterGain
        .gain
        .cancelScheduledValues(
          now
        );


      ambientMasterGain
        .gain
        .setTargetAtTime(
          safe * 0.30,
          now,
          0.08
        );

    }


    renderSettingsCard();

  }


  function getAudioContextClass() {

    return (
      window.AudioContext ||
      window.webkitAudioContext ||
      null
    );

  }


  function ensureAmbientAudioContext() {

    if (
      ambientAudioContext
    ) {

      return ambientAudioContext;

    }


    const AudioContextClass =
      getAudioContextClass();


    if (
      !AudioContextClass
    ) {

      return null;

    }


    ambientAudioContext =
      new AudioContextClass();


    ambientMasterGain =
      ambientAudioContext
        .createGain();


    ambientMasterGain
      .gain
      .value =
      getAmbientMusicVolume() *
      0.30;


    ambientMasterGain
      .connect(
        ambientAudioContext.destination
      );


    return ambientAudioContext;

  }


  function playAmbientChord() {

    const effect =
      getEffect(
        "music"
      );


    if (
      !effect ||
      !isEnabled(
        effect
      ) ||
      !ambientAudioContext ||
      ambientAudioContext.state !==
        "running" ||
      !ambientMasterGain
    ) {

      return;

    }


    const chord =
      AMBIENT_CHORDS[
        ambientChordIndex %
        AMBIENT_CHORDS.length
      ];


    ambientChordIndex++;


    const now =
      ambientAudioContext
        .currentTime;


    chord.forEach(
      function (
        frequency,
        index
      ) {

        const oscillator =
          ambientAudioContext
            .createOscillator();


        const gain =
          ambientAudioContext
            .createGain();


        oscillator.type =
          index === 0
            ? "sine"
            : "triangle";


        oscillator.frequency
          .setValueAtTime(
            frequency,
            now
          );


        gain.gain
          .setValueAtTime(
            0.0001,
            now
          );


        gain.gain
          .exponentialRampToValueAtTime(
            index === 0
              ? 0.12
              : 0.07,
            now + 0.9
          );


        gain.gain
          .setValueAtTime(
            index === 0
              ? 0.12
              : 0.07,
            now + 2.1
          );


        gain.gain
          .exponentialRampToValueAtTime(
            0.0001,
            now + 3.5
          );


        oscillator
          .connect(
            gain
          );


        gain
          .connect(
            ambientMasterGain
          );


        oscillator
          .start(
            now
          );


        oscillator
          .stop(
            now + 3.6
          );

      }
    );

  }


  function bindAmbientGestureResume() {

    if (
      ambientGestureBound
    ) {

      return;

    }


    ambientGestureBound =
      true;


    const resume =
      async function () {

        const effect =
          getEffect(
            "music"
          );


        if (
          !effect ||
          !isEnabled(
            effect
          )
        ) {

          return;

        }


        await startAmbientMusic(
          true
        );


        if (
          ambientAudioContext &&
          ambientAudioContext.state ===
            "running"
        ) {

          document.removeEventListener(
            "pointerdown",
            resume
          );


          document.removeEventListener(
            "touchend",
            resume
          );


          ambientGestureBound =
            false;

        }

      };


    document.addEventListener(
      "pointerdown",
      resume,
      {
        passive:
          true
      }
    );


    document.addEventListener(
      "touchend",
      resume,
      {
        passive:
          true
      }
    );

  }


  async function startAmbientMusic(
    fromUserGesture = false
  ) {

    const effect =
      getEffect(
        "music"
      );


    if (
      !effect ||
      !isEnabled(
        effect
      )
    ) {

      stopAmbientMusic();

      return false;

    }


    const context =
      ensureAmbientAudioContext();


    if (
      !context
    ) {

      return false;

    }


    if (
      context.state ===
        "suspended"
    ) {

      try {

        await context.resume();

      } catch (error) {
      }

    }


    if (
      context.state !==
        "running"
    ) {

      bindAmbientGestureResume();

      return false;

    }


    if (
      ambientTimer
    ) {

      return true;

    }


    playAmbientChord();


    ambientTimer =
      setInterval(
        playAmbientChord,
        3300
      );


    return true;

  }


  function stopAmbientMusic() {

    if (
      ambientTimer
    ) {

      clearInterval(
        ambientTimer
      );


      ambientTimer =
        null;

    }


    if (
      ambientMasterGain &&
      ambientAudioContext
    ) {

      const now =
        ambientAudioContext
          .currentTime;


      ambientMasterGain
        .gain
        .cancelScheduledValues(
          now
        );


      ambientMasterGain
        .gain
        .setTargetAtTime(
          0.0001,
          now,
          0.05
        );

    }

  }


  function updateAmbientMusic() {

    const effect =
      getEffect(
        "music"
      );


    if (
      effect &&
      isEnabled(
        effect
      )
    ) {

      startAmbientMusic(
        false
      );


      return;

    }


    stopAmbientMusic();

  }


  function startHearts() {

    const effect =
      getEffect(
        "hearts"
      );


    if (
      !effect ||
      !isEnabled(
        effect
      )
    ) {

      stopHearts();

      return;

    }


    if (
      heartsTimer
    ) {

      return;

    }


    const spawn =
      function () {

        if (
          !isEnabled(
            effect
          ) ||
          document.visibilityState !==
            "visible"
        ) {

          return;

        }


        const layer =
          ensureLayer();


        const heart =
          document.createElement(
            "span"
          );


        const hearts =
          [
            "❤️",
            "💕",
            "💗",
            "💖"
          ];


        heart.className =
          "duo-floating-heart";


        heart.textContent =
          hearts[
            Math.floor(
              Math.random() *
              hearts.length
            )
          ];


        heart.style.left =
          (
            6 +
            Math.random() *
            88
          ) +
          "%";


        heart.style.setProperty(
          "--drift",
          (
            -45 +
            Math.random() *
            90
          ) +
          "px"
        );


        heart.style.fontSize =
          (
            15 +
            Math.random() *
            12
          ) +
          "px";


        layer.appendChild(
          heart
        );


        setTimeout(
          function () {

            heart.remove();

          },
          5900
        );

      };


    spawn();


    heartsTimer =
      setInterval(
        spawn,
        1450
      );

  }


  function stopHearts() {

    if (
      heartsTimer
    ) {

      clearInterval(
        heartsTimer
      );


      heartsTimer =
        null;

    }


    document
      .querySelectorAll(
        ".duo-floating-heart"
      )
      .forEach(
        element =>
          element.remove()
      );

  }


  function handleTouchSparkles(
    event
  ) {

    const effect =
      getEffect(
        "sparkles"
      );


    if (
      !effect ||
      !isEnabled(
        effect
      )
    ) {

      return;

    }


    const x =
      Number(
        event.clientX
      );


    const y =
      Number(
        event.clientY
      );


    if (
      !Number.isFinite(
        x
      ) ||
      !Number.isFinite(
        y
      )
    ) {

      return;

    }


    const symbols =
      [
        "✨",
        "✦",
        "💕",
        "⋆"
      ];


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      const spark =
        document.createElement(
          "span"
        );


      const angle =
        (
          Math.PI *
          2 *
          i /
          6
        ) +
        Math.random() *
        .45;


      const distance =
        25 +
        Math.random() *
        34;


      spark.className =
        "duo-touch-spark";


      spark.textContent =
        symbols[
          Math.floor(
            Math.random() *
            symbols.length
          )
        ];


      spark.style.left =
        x +
        "px";


      spark.style.top =
        y +
        "px";


      spark.style.setProperty(
        "--sx",
        (
          Math.cos(
            angle
          ) *
          distance
        ) +
        "px"
      );


      spark.style.setProperty(
        "--sy",
        (
          Math.sin(
            angle
          ) *
          distance
        ) +
        "px"
      );


      document.body.appendChild(
        spark
      );


      setTimeout(
        function () {

          spark.remove();

        },
        780
      );

    }

  }


  function updateTouchSparkles() {

    const effect =
      getEffect(
        "sparkles"
      );


    const shouldBind =
      effect &&
      isEnabled(
        effect
      );


    if (
      shouldBind &&
      !touchBound
    ) {

      document.addEventListener(
        "pointerdown",
        handleTouchSparkles,
        {
          passive:
            true
        }
      );


      touchBound =
        true;

    }


    if (
      !shouldBind &&
      touchBound
    ) {

      document.removeEventListener(
        "pointerdown",
        handleTouchSparkles
      );


      touchBound =
        false;

    }

  }


  function findPulseTarget() {

    return (
      document.getElementById(
        "couplePhoto"
      ) ||
      document.querySelector(
        ".settings-photo img"
      ) ||
      document.querySelector(
        ".couple-photo img"
      ) ||
      document.querySelector(
        ".home-couple-photo img"
      ) ||
      document.querySelector(
        ".main-photo img"
      )
    );

  }


  function updateLovePulse() {

    document
      .querySelectorAll(
        ".duo-love-pulse"
      )
      .forEach(
        element =>
          element.classList.remove(
            "duo-love-pulse"
          )
      );


    const effect =
      getEffect(
        "pulse"
      );


    if (
      !effect ||
      !isEnabled(
        effect
      )
    ) {

      return;

    }


    const target =
      findPulseTarget();


    if (
      target
    ) {

      target.classList.add(
        "duo-love-pulse"
      );

    }

  }


  function startStars() {

    const effect =
      getEffect(
        "stars"
      );


    if (
      !effect ||
      !isEnabled(
        effect
      )
    ) {

      stopStars();

      return;

    }


    if (
      starsTimer
    ) {

      return;

    }


    const spawn =
      function () {

        if (
          !isEnabled(
            effect
          ) ||
          document.visibilityState !==
            "visible"
        ) {

          return;

        }


        const layer =
          ensureLayer();


        const star =
          document.createElement(
            "span"
          );


        star.className =
          "duo-shooting-star";


        star.style.setProperty(
          "--star-top",
          (
            8 +
            Math.random() *
            45
          ) +
          "vh"
        );


        layer.appendChild(
          star
        );


        setTimeout(
          function () {

            star.remove();

          },
          1500
        );

      };


    setTimeout(
      spawn,
      900
    );


    starsTimer =
      setInterval(
        spawn,
        4800
      );

  }


  function stopStars() {

    if (
      starsTimer
    ) {

      clearInterval(
        starsTimer
      );


      starsTimer =
        null;

    }


    document
      .querySelectorAll(
        ".duo-shooting-star"
      )
      .forEach(
        element =>
          element.remove()
      );

  }


  function getRomaniaDateKey() {

    try {

      const parts =
        new Intl.DateTimeFormat(
          "en-CA",
          {
            timeZone:
              "Europe/Bucharest",

            year:
              "numeric",

            month:
              "2-digit",

            day:
              "2-digit"
          }
        )
          .formatToParts(
            new Date()
          );


      const get =
        type =>
          parts.find(
            part =>
              part.type === type
          )?.value || "";


      return (
        get(
          "year"
        ) +
        "-" +
        get(
          "month"
        ) +
        "-" +
        get(
          "day"
        )
      );

    } catch (error) {

      return new Date()
        .toISOString()
        .slice(
          0,
          10
        );

    }

  }


  function maybeShowTogetherCelebration() {

    const effect =
      getEffect(
        "together"
      );


    if (
      togetherShownThisRun ||
      !effect ||
      !isEnabled(
        effect
      ) ||
      Number(
        xpInfo.usersToday
      ) < 2
    ) {

      return;

    }


    const today =
      getRomaniaDateKey();


    const key =
      "duoTogetherCelebration:" +
      today;


    if (
      localStorage.getItem(
        key
      ) === "shown"
    ) {

      return;

    }


    togetherShownThisRun =
      true;


    localStorage.setItem(
      key,
      "shown"
    );


    const overlay =
      document.createElement(
        "div"
      );


    overlay.className =
      "duo-together-celebration";


    overlay.innerHTML = `

      <div class="duo-together-card">
        <strong>
          💗 Amândoi sunteți aici!
        </strong>

        <span>
          2/2 azi · 50 XP din intrările zilnice ❤️
        </span>
      </div>

    `;


    document.body.appendChild(
      overlay
    );


    /*
      Inimioare scurte pentru celebrare.
    */

    const layer =
      ensureLayer();


    for (
      let i = 0;
      i < 14;
      i++
    ) {

      setTimeout(
        function () {

          const heart =
            document.createElement(
              "span"
            );


          heart.className =
            "duo-floating-heart";


          heart.textContent =
            i % 3 === 0
              ? "💗"
              : "❤️";


          heart.style.left =
            (
              8 +
              Math.random() *
              84
            ) +
            "%";


          heart.style.setProperty(
            "--drift",
            (
              -60 +
              Math.random() *
              120
            ) +
            "px"
          );


          layer.appendChild(
            heart
          );


          setTimeout(
            function () {

              heart.remove();

            },
            5900
          );

        },
        i * 80
      );

    }


    setTimeout(
      function () {

        overlay.remove();

      },
      2900
    );

  }


  function applyEffects() {

    ensureStyles();

    startHearts();

    updateAmbientMusic();

    updateTouchSparkles();

    updateLovePulse();

    startStars();

    maybeShowTogetherCelebration();

    renderSettingsCard();

  }


  function createSettingsCard() {

    if (
      document.getElementById(
        "rewardEffectsSettings"
      )
    ) {

      return document.getElementById(
        "rewardEffectsSettings"
      );

    }


    /*
      Inserăm doar pe pagina Setări.
    */

    if (
      !document.body.classList.contains(
        "settings-page"
      ) &&
      !document.getElementById(
        "notificationCard"
      )
    ) {

      return null;

    }


    const card =
      document.createElement(
        "section"
      );


    card.id =
      "rewardEffectsSettings";


    card.className =
      "settings-card";


    card.innerHTML = `

      <span class="settings-small">
        ✨ RECOMPENSE ANIMATE
      </span>

      <h2>
        Efecte deblocate
      </h2>

      <p class="settings-card-description">
        Efectele apar pe măsură ce crește XP-ul total.
        Le poți porni sau opri separat.
      </p>

      <div
        id="rewardEffectsXP"
        class="reward-effects-xp"
      >
        Se verifică XP-ul...
      </div>

      <div
        id="rewardEffectsList"
        class="reward-effect-list"
      ></div>

    `;


    const notificationCard =
      document.getElementById(
        "notificationCard"
      );


    if (
      notificationCard &&
      notificationCard.parentNode
    ) {

      notificationCard.parentNode
        .insertBefore(
          card,
          notificationCard.nextSibling
        );

    } else {

      const main =
        document.querySelector(
          "main.app"
        ) ||
        document.querySelector(
          "main"
        );


      main?.appendChild(
        card
      );

    }


    return card;

  }


  function renderSettingsCard() {

    const card =
      createSettingsCard();


    if (
      !card
    ) {

      return;

    }


    const xpLabel =
      document.getElementById(
        "rewardEffectsXP"
      );


    if (
      xpLabel
    ) {

      xpLabel.textContent =
        "⭐ " +
        (
          Number(
            xpInfo.totalXP
          ) || 0
        ) +
        " XP total · efectele deblocate rămân disponibile permanent.";

    }


    const list =
      document.getElementById(
        "rewardEffectsList"
      );


    if (
      !list
    ) {

      return;

    }


    list.innerHTML =
      EFFECTS
        .map(
          function (
            effect
          ) {

            const unlocked =
              isUnlocked(
                effect
              );


            const checked =
              unlocked &&
              getPreference(
                effect
              );


            return `

              <div
                class="
                  reward-effect-row
                  ${unlocked ? "" : "locked"}
                "
              >

                <div class="reward-effect-icon">
                  ${unlocked ? effect.icon : "🔒"}
                </div>


                <div class="reward-effect-copy">

                  <strong>
                    ${effect.title}
                  </strong>

                  <span>
                    ${effect.description}
                  </span>

                  <small>
                    ${
                      unlocked
                        ? "✅ Deblocat la " +
                          effect.xp +
                          " XP"
                        : "Se deblochează la " +
                          effect.xp +
                          " XP"
                    }
                  </small>

                </div>


                <label
                  class="reward-effect-switch"
                  aria-label="${effect.title}"
                >

                  <input
                    type="checkbox"
                    data-reward-effect="${effect.id}"
                    ${checked ? "checked" : ""}
                    ${unlocked ? "" : "disabled"}
                  >

                  <span
                    class="reward-effect-slider"
                  ></span>

                </label>


                ${
                  effect.id === "music"
                    ? `

                      <div class="reward-music-controls">

                        <label class="reward-music-volume">
                          <span>🔉</span>

                          <input
                            type="range"
                            min="5"
                            max="100"
                            step="5"
                            value="${Math.round(
                              getAmbientMusicVolume() *
                              100
                            )}"
                            data-reward-music-volume
                            ${unlocked ? "" : "disabled"}
                          >

                          <span>
                            ${Math.round(
                              getAmbientMusicVolume() *
                              100
                            )}%
                          </span>
                        </label>


                        <button
                          type="button"
                          class="reward-music-button"
                          data-reward-music-start
                          ${unlocked && checked ? "" : "disabled"}
                        >
                          ▶️ Pornește
                        </button>

                      </div>

                    `
                    : ""
                }

              </div>

            `;

          }
        )
        .join(
          ""
        );


    list
      .querySelectorAll(
        "input[data-reward-effect]"
      )
      .forEach(
        function (
          input
        ) {

          input.addEventListener(
            "change",
            function () {

              const effect =
                getEffect(
                  this.dataset.rewardEffect
                );


              if (
                !effect ||
                !isUnlocked(
                  effect
                )
              ) {

                return;

              }


              setPreference(
                effect,
                this.checked
              );


              if (
                effect.id ===
                  "music"
              ) {

                if (
                  this.checked
                ) {

                  startAmbientMusic(
                    true
                  );

                } else {

                  stopAmbientMusic();

                }

              }


              applyEffects();

            }
          );

        }
      );


    list
      .querySelectorAll(
        "input[data-reward-music-volume]"
      )
      .forEach(
        function (
          input
        ) {

          input.addEventListener(
            "input",
            function () {

              setAmbientMusicVolume(
                Number(
                  this.value
                ) /
                100
              );

            }
          );

        }
      );


    list
      .querySelectorAll(
        "button[data-reward-music-start]"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(
            "click",
            async function () {

              const started =
                await startAmbientMusic(
                  true
                );


              this.textContent =
                started
                  ? "🎵 Pornește muzica"
                  : "▶️ Pornește";

            }
          );

        }
      );

  }


  async function refreshXP(
    suppliedInfo = null
  ) {

    if (
      suppliedInfo &&
      typeof suppliedInfo ===
        "object"
    ) {

      xpInfo = {

        totalXP:
          Math.max(
            0,
            Number(
              suppliedInfo.totalXP ??
              suppliedInfo.total_xp
            ) || 0
          ),

        availableXP:
          Math.max(
            0,
            Number(
              suppliedInfo.availableXP ??
              suppliedInfo.available_xp
            ) || 0
          ),

        usersToday:
          Math.max(
            0,
            Math.min(
              2,
              Number(
                suppliedInfo.usersToday ??
                suppliedInfo.users_today
              ) || 0
            )
          )

      };


      applyEffects();

      return;

    }


    if (
      typeof window.getCoupleXP ===
        "function"
    ) {

      try {

        const result =
          await window
            .getCoupleXP();


        if (
          result &&
          result.success
        ) {

          await refreshXP(
            result
          );

          return;

        }

      } catch (error) {

        console.warn(
          "Recompense animate - XP cloud:",
          error
        );

      }

    }


    if (
      typeof window.getCachedCoupleXP ===
        "function"
    ) {

      await refreshXP(
        window
          .getCachedCoupleXP()
      );


      return;

    }


    await refreshXP(
      {
        totalXP:
          Number(
            localStorage.getItem(
              "coupleTotalXP"
            )
          ) || 0,

        availableXP:
          Number(
            localStorage.getItem(
              "coupleAvailableXP"
            )
          ) || 0,

        usersToday:
          Number(
            localStorage.getItem(
              "coupleXPUsersToday"
            )
          ) || 0
      }
    );

  }


  function start() {

    ensureStyles();

    refreshXP();


    /*
      Home acordă XP după încărcarea cloud.
      Mai verificăm încă o dată după câteva secunde.
    */

    setTimeout(
      function () {

        refreshXP();

      },
      2500
    );


    window.addEventListener(
      "duolove:xp-updated",
      function (
        event
      ) {

        refreshXP(
          event.detail
        );

      }
    );


    document.addEventListener(
      "visibilitychange",
      function () {

        if (
          document.visibilityState ===
            "visible"
        ) {

          refreshXP();

        }

      }
    );

  }


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once:
          true
      }
    );

  } else {

    start();

  }


  window.DuoLoveRewardEffects = {

    refreshXP:
      refreshXP,

    applyEffects:
      applyEffects,

    effects:
      EFFECTS.slice()

  };

})();


/* =========================================================
   v76 · TOATE FUNCȚIILE XP ÎN SETĂRI
========================================================= */
(function () {
  "use strict";

  const TIER_LABELS = [
    [0, 10000, "💎 Până la 10.000 XP"],
    [10001, 100000, "🌟 10.000 — 100.000 XP"],
    [100001, 1000000, "💠 100.000 — 1.000.000 XP"],
    [1000001, 10000000, "🚀 1.000.000 — 10.000.000 XP"],
    [10000001, 100000000, "🌌 10.000.000 — 100.000.000 XP"],
    [100000001, 1000000000, "♾️ 100.000.000 — 1.000.000.000 XP"]
  ];

  function esc(v) {
    return String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  }

  function formatXP(v) {
    return new Intl.NumberFormat("ro-RO").format(Number(v) || 0) + " XP";
  }

  function ensureStyles() {
    if (document.getElementById("xpFeatureCatalogStyles")) return;
    const style = document.createElement("style");
    style.id = "xpFeatureCatalogStyles";
    style.textContent = `
      .xp-feature-catalog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:11px}
      .xp-feature-current{flex:0 0 auto;padding:7px 10px;border-radius:999px;background:rgba(255,225,124,.10);color:#ffe17c;font-size:10px;font-weight:850}
      .xp-feature-search{width:100%;box-sizing:border-box;margin:2px 0 12px;padding:11px 12px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(255,255,255,.05);color:#fff;font:inherit;font-size:12px;outline:none}
      .xp-feature-search::placeholder{color:rgba(255,255,255,.34)}
      .xp-feature-tier{margin-top:9px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden}
      .xp-feature-tier summary{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px;cursor:pointer;color:#fff;font-size:11px;font-weight:850;list-style:none}
      .xp-feature-tier summary::-webkit-details-marker{display:none}
      .xp-feature-tier summary span:last-child{color:rgba(255,255,255,.45);font-size:9px}
      .xp-feature-tier-list{display:grid;gap:7px;padding:0 9px 10px}
      .xp-feature-item{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.055)}
      .xp-feature-item.locked{opacity:.64}
      .xp-feature-item-icon{display:grid;place-items:center;width:37px;height:37px;border-radius:12px;background:rgba(255,255,255,.06);font-size:18px}
      .xp-feature-item strong,.xp-feature-item small{display:block}
      .xp-feature-item strong{font-size:11px;color:#fff}
      .xp-feature-item small{margin-top:2px;color:rgba(255,255,255,.45);font-size:9px;line-height:1.3}
      .xp-feature-status{font-size:9px;font-weight:850;text-align:right;color:rgba(255,255,255,.52)}
      .xp-feature-status.ok{color:#7ee7aa}
      .xp-feature-open{display:block;width:100%;margin-top:12px;padding:11px 12px;border:0;border-radius:14px;background:linear-gradient(135deg,#c95887,#993f6b);color:#fff;text-align:center;text-decoration:none;font-size:11px;font-weight:850}
    `;
    document.head.appendChild(style);
  }

  function createCard() {
    if (document.getElementById("xpFeatureCatalogSettings")) return document.getElementById("xpFeatureCatalogSettings");
    if (!document.body.classList.contains("settings-page") && !document.getElementById("notificationCard")) return null;
    const card = document.createElement("section");
    card.id = "xpFeatureCatalogSettings";
    card.className = "settings-card";
    card.innerHTML = `
      <div class="xp-feature-catalog-head">
        <div>
          <span class="settings-small">🛍️ FUNCȚII XP</span>
          <h2>Toate funcțiile de deblocat</h2>
        </div>
        <span id="xpFeatureCurrent" class="xp-feature-current">0 XP</span>
      </div>
      <p class="settings-card-description">Aici vezi toate funcțiile care se deblochează pe măsură ce crește XP-ul vostru, până la 1.000.000.000 XP.</p>
      <input id="xpFeatureSearch" class="xp-feature-search" type="search" placeholder="Caută o funcție..." autocomplete="off">
      <div id="xpFeatureCatalogList"></div>
      <a class="xp-feature-open" href="./recompense.html">⭐ Deschide Recompense & Misiuni</a>
    `;
    const after = document.getElementById("rewardEffectsSettings");
    if (after?.parentNode) after.parentNode.insertBefore(card, after.nextSibling);
    else (document.querySelector("main.app") || document.querySelector("main"))?.appendChild(card);
    return card;
  }

  function getXP() {
    return Math.max(0, Number(localStorage.getItem("coupleTotalXP")) || 0);
  }

  function render() {
    ensureStyles();
    const card = createCard();
    if (!card) return;
    const features = Array.isArray(window.DUO_SETTINGS_XP_FEATURES) ? window.DUO_SETTINGS_XP_FEATURES : [];
    const xp = getXP();
    const label = document.getElementById("xpFeatureCurrent");
    if (label) label.textContent = formatXP(xp);
    const query = (document.getElementById("xpFeatureSearch")?.value || "").trim().toLowerCase();
    const list = document.getElementById("xpFeatureCatalogList");
    if (!list) return;
    list.innerHTML = TIER_LABELS.map(([min,max,title], tierIndex) => {
      const items = features.filter(item => {
        const n = Number(item.xp) || 0;
        const matchesTier = n >= min && n <= max;
        const hay = `${item.title || ""} ${item.summary || ""} ${item.category || ""}`.toLowerCase();
        return matchesTier && (!query || hay.includes(query));
      });
      if (!items.length) return "";
      const unlockedCount = items.filter(item => xp >= Number(item.xp || 0)).length;
      return `
        <details class="xp-feature-tier" ${tierIndex === 0 || query ? "open" : ""}>
          <summary><span>${title}</span><span>${unlockedCount}/${items.length} deblocate</span></summary>
          <div class="xp-feature-tier-list">
            ${items.map(item => {
              const unlocked = xp >= Number(item.xp || 0);
              return `
                <div class="xp-feature-item ${unlocked ? "" : "locked"}">
                  <div class="xp-feature-item-icon">${unlocked ? esc(item.icon || "⭐") : "🔒"}</div>
                  <div><strong>${esc(item.title)}</strong><small>${esc(item.summary || item.category || "Funcție DUO LOVE")}</small></div>
                  <div class="xp-feature-status ${unlocked ? "ok" : ""}">${unlocked ? "✅ DEBLOCAT" : formatXP(item.xp)}</div>
                </div>`;
            }).join("")}
          </div>
        </details>`;
    }).join("") || `<p class="settings-card-description">Nu am găsit nicio funcție.</p>`;
  }

  function bind() {
    render();
    const input = document.getElementById("xpFeatureSearch");
    if (input && !input.dataset.bound) {
      input.dataset.bound = "1";
      input.addEventListener("input", render);
    }
  }

  window.addEventListener("duolove:xp-updated", bind);
  document.addEventListener("DOMContentLoaded", () => setTimeout(bind, 120));
  setTimeout(bind, 900);
})();
