/* =========================================================
   DUO LOVE ❤️ - SECURITY v33
   - PIN 4, 5 sau 6 cifre
   - cere deblocare la intrarea în aplicație
   - Face ID / biometrie prin WebAuthn
   - recuperare PIN prin Magic Link Supabase
========================================================= */

(function () {
  "use strict";

  const INTERNAL_NAV_KEY = "duoLoveInternalNavUntil";
  const HIDDEN_AT_KEY = "duoLoveHiddenAt";
  const UNLOCK_KEY_PREFIX = "duoLoveUnlocked:";
  const FACE_ID_KEY_PREFIX = "duoLoveFaceCredential:";
  const RELOCK_AFTER_BACKGROUND_MS = 2500;

  let currentUser = null;
  let pinEnabled = false;
  let lockOpen = false;
  let pinBuffer = "";
  let verifying = false;

  function getSupabaseClient() {

    /*
      În unele versiuni de supabase.js clientul este declarat:
      const supabaseClient = ...
      și atunci NU apare ca window.supabaseClient.

      De aceea îl căutăm în ambele moduri.
    */

    if (
      window.supabaseClient
    ) {
      return window.supabaseClient;
    }


    try {

      if (
        typeof supabaseClient !==
        "undefined"
      ) {
        return supabaseClient;
      }

    } catch (_) {}


    return null;
  }

  function validPin(value) {
    return /^\d{4,6}$/.test(String(value || ""));
  }

  async function getUser() {
    const client = getSupabaseClient();

    if (!client) {
      return null;
    }

    try {
      const { data, error } =
        await client.auth.getSession();

      if (
        error ||
        !data ||
        !data.session ||
        !data.session.user
      ) {
        return null;
      }

      currentUser = data.session.user;

      return currentUser;

    } catch (error) {
      console.warn(
        "DUO LOVE Security: sesiunea nu poate fi citită.",
        error
      );

      return null;
    }
  }

  function unlockKey() {
    return currentUser
      ? UNLOCK_KEY_PREFIX + currentUser.id
      : "";
  }

  function faceKey() {
    return currentUser
      ? FACE_ID_KEY_PREFIX + currentUser.id
      : "";
  }

  function markUnlocked() {
    if (!currentUser) {
      return;
    }

    try {
      sessionStorage.setItem(
        unlockKey(),
        "1"
      );
    } catch (_) {}
  }

  function clearUnlocked() {
    if (!currentUser) {
      return;
    }

    try {
      sessionStorage.removeItem(
        unlockKey()
      );
    } catch (_) {}
  }

  async function hasPin() {
    const client = getSupabaseClient();

    if (!client) {
      return false;
    }

    try {
      const { data, error } =
        await client.rpc(
          "has_my_access_pin"
        );

      if (error) {
        console.warn(
          "DUO LOVE Security: rulează access-pin-v32.sql",
          error
        );

        /*
          Nu blocăm aplicația dacă SQL-ul nu există încă.
        */
        return false;
      }

      pinEnabled = data === true;

      return pinEnabled;

    } catch (error) {
      console.warn(
        "DUO LOVE Security: status PIN indisponibil.",
        error
      );

      return false;
    }
  }

  async function verifyPin(pin) {
    const client = getSupabaseClient();

    if (!client) {
      return {
        success: false,
        correct: false,
        error: "Supabase nu este disponibil."
      };
    }

    if (!validPin(pin)) {
      return {
        success: false,
        correct: false,
        error: "Introdu între 4 și 6 cifre."
      };
    }

    try {
      const { data, error } =
        await client.rpc(
          "verify_my_access_pin",
          {
            pin_value: String(pin)
          }
        );

      if (error) {
        return {
          success: false,
          correct: false,
          error:
            error.message ||
            "Codul nu a putut fi verificat."
        };
      }

      return {
        success: true,
        correct: data === true
      };

    } catch (error) {
      return {
        success: false,
        correct: false,
        error:
          error?.message ||
          "Codul nu a putut fi verificat."
      };
    }
  }

  async function setPin(pin) {
    const client = getSupabaseClient();

    if (!client) {
      return {
        success: false,
        error: "Supabase nu este disponibil."
      };
    }

    if (!validPin(pin)) {
      return {
        success: false,
        error: "Codul trebuie să aibă între 4 și 6 cifre."
      };
    }

    try {
      const { error } =
        await client.rpc(
          "set_my_access_pin",
          {
            pin_value: String(pin)
          }
        );

      if (error) {
        return {
          success: false,
          error:
            error.message ||
            "Codul nu a putut fi salvat."
        };
      }

      pinEnabled = true;

      markUnlocked();

      return {
        success: true
      };

    } catch (error) {
      return {
        success: false,
        error:
          error?.message ||
          "Codul nu a putut fi salvat."
      };
    }
  }

  async function disablePin() {
    const client = getSupabaseClient();

    if (!client) {
      return {
        success: false,
        error: "Supabase nu este disponibil."
      };
    }

    try {
      const { error } =
        await client.rpc(
          "disable_my_access_pin"
        );

      if (error) {
        return {
          success: false,
          error:
            error.message ||
            "Codul nu a putut fi dezactivat."
        };
      }

      pinEnabled = false;

      clearUnlocked();

      disableFaceIdLocal();

      hideLock();

      return {
        success: true
      };

    } catch (error) {
      return {
        success: false,
        error:
          error?.message ||
          "Codul nu a putut fi dezactivat."
      };
    }
  }

  function bytesToBase64Url(buffer) {
    const bytes =
      new Uint8Array(buffer);

    let binary = "";

    for (
      let i = 0;
      i < bytes.length;
      i++
    ) {
      binary +=
        String.fromCharCode(
          bytes[i]
        );
    }

    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function base64UrlToBytes(value) {
    const padded =
      value
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(
          Math.ceil(
            value.length / 4
          ) * 4,
          "="
        );

    const binary =
      atob(padded);

    const bytes =
      new Uint8Array(
        binary.length
      );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    return bytes;
  }

  function randomBytes(length = 32) {
    const bytes =
      new Uint8Array(length);

    crypto.getRandomValues(
      bytes
    );

    return bytes;
  }

  async function faceIdSupported() {
    if (
      !window.PublicKeyCredential ||
      !navigator.credentials
    ) {
      return false;
    }

    try {
      if (
        typeof PublicKeyCredential
          .isUserVerifyingPlatformAuthenticatorAvailable !==
        "function"
      ) {
        return true;
      }

      return await PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable();

    } catch (_) {
      return false;
    }
  }

  function faceIdEnabled() {
    if (!currentUser) {
      return false;
    }

    try {
      return Boolean(
        localStorage.getItem(
          faceKey()
        )
      );
    } catch (_) {
      return false;
    }
  }

  async function enableFaceId() {
    const user =
      await getUser();

    if (!user) {
      return {
        success: false,
        error: "Nu există un cont conectat."
      };
    }

    if (
      !(await hasPin())
    ) {
      return {
        success: false,
        error: "Activează mai întâi codul de acces."
      };
    }

    if (
      !(await faceIdSupported())
    ) {
      return {
        success: false,
        error: "Face ID / biometria nu este disponibilă pe acest dispozitiv."
      };
    }

    try {
      const userId =
        new TextEncoder()
          .encode(
            String(user.id)
          );

      const credential =
        await navigator.credentials.create(
          {
            publicKey: {
              challenge:
                randomBytes(32),

              rp: {
                name: "DUO LOVE"
              },

              user: {
                id:
                  userId,

                name:
                  user.email ||
                  "duo-love-user",

                displayName:
                  user.email ||
                  "DUO LOVE"
              },

              pubKeyCredParams: [
                {
                  type: "public-key",
                  alg: -7
                },
                {
                  type: "public-key",
                  alg: -257
                }
              ],

              authenticatorSelection: {
                authenticatorAttachment:
                  "platform",

                residentKey:
                  "discouraged",

                userVerification:
                  "required"
              },

              timeout:
                60000,

              attestation:
                "none"
            }
          }
        );

      if (
        !credential ||
        !credential.rawId
      ) {
        return {
          success: false,
          error: "Face ID nu a fost activat."
        };
      }

      localStorage.setItem(
        faceKey(),
        bytesToBase64Url(
          credential.rawId
        )
      );

      refreshFaceUi();

      return {
        success: true
      };

    } catch (error) {
      return {
        success: false,
        error:
          error?.name === "NotAllowedError"
            ? "Activarea Face ID a fost anulată."
            : (
                error?.message ||
                "Face ID nu a putut fi activat."
              )
      };
    }
  }

  function disableFaceIdLocal() {
    if (!currentUser) {
      return;
    }

    try {
      localStorage.removeItem(
        faceKey()
      );
    } catch (_) {}

    refreshFaceUi();
  }

  async function unlockWithFaceId() {
    const user =
      await getUser();

    if (!user) {
      return {
        success: false,
        error: "Nu există un cont conectat."
      };
    }

    const storedId =
      localStorage.getItem(
        faceKey()
      );

    if (!storedId) {
      return {
        success: false,
        error: "Face ID nu este activat."
      };
    }

    if (
      !(await faceIdSupported())
    ) {
      return {
        success: false,
        error: "Face ID nu este disponibil."
      };
    }

    try {
      const assertion =
        await navigator.credentials.get(
          {
            publicKey: {
              challenge:
                randomBytes(32),

              allowCredentials: [
                {
                  type:
                    "public-key",

                  id:
                    base64UrlToBytes(
                      storedId
                    ),

                  transports: [
                    "internal"
                  ]
                }
              ],

              userVerification:
                "required",

              timeout:
                60000
            }
          }
        );

      if (!assertion) {
        return {
          success: false,
          error: "Face ID nu a confirmat accesul."
        };
      }

      markUnlocked();

      hideLock();

      return {
        success: true
      };

    } catch (error) {
      return {
        success: false,
        error:
          error?.name === "NotAllowedError"
            ? "Face ID a fost anulat."
            : (
                error?.message ||
                "Face ID nu a putut fi verificat."
              )
      };
    }
  }

  async function getCurrentEmail() {
    const user =
      await getUser();

    return user?.email || "";
  }

  function maskEmail(email) {
    const value =
      String(email || "");

    const parts =
      value.split("@");

    if (
      parts.length !== 2
    ) {
      return value;
    }

    return (
      parts[0].slice(0, 2) +
      "••••@" +
      parts[1]
    );
  }

  async function sendRecoveryLink() {
    const client = getSupabaseClient();
    const user =
      await getUser();

    if (
      !client ||
      !user ||
      !user.email
    ) {
      return {
        success: false,
        error: "Nu am găsit emailul contului."
      };
    }

    const redirectUrl =
      new URL(
        "./reset-pin.html",
        window.location.href
      ).href;

    try {
      const { error } =
        await client.auth.signInWithOtp(
          {
            email:
              user.email,

            options: {
              shouldCreateUser:
                false,

              emailRedirectTo:
                redirectUrl
            }
          }
        );

      if (error) {
        return {
          success: false,
          error:
            error.message ||
            "Emailul nu a putut fi trimis."
        };
      }

      return {
        success: true,
        email: user.email
      };

    } catch (error) {
      return {
        success: false,
        error:
          error?.message ||
          "Emailul nu a putut fi trimis."
      };
    }
  }

  function injectStyles() {
    if (
      document.getElementById(
        "duoSecurityV32Styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "duoSecurityV32Styles";

    style.textContent = `
      #duoSecurityLock {
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;

        display: none !important;

        width: 100% !important;
        height: 100vh !important;
        height: 100dvh !important;

        box-sizing: border-box !important;

        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(env(safe-area-inset-bottom) + 18px) !important;

        align-items: center !important;
        justify-content: center !important;

        overflow-y: auto !important;

        background:
          radial-gradient(circle at 15% 15%, rgba(220,70,135,.30), transparent 35%),
          radial-gradient(circle at 85% 80%, rgba(95,65,210,.28), transparent 40%),
          linear-gradient(160deg, #07060c, #170b17 55%, #08070d) !important;

        color: white !important;

        font-family:
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif !important;
      }

      #duoSecurityLock.open {
        display: flex !important;
      }

      .duo-sec-card {
        width: min(100%, 390px) !important;

        padding: 24px 20px !important;

        box-sizing: border-box !important;

        border:
          1px solid
          rgba(255,255,255,.11) !important;

        border-radius: 28px !important;

        background:
          rgba(12,8,17,.91) !important;

        box-shadow:
          0 24px 65px
          rgba(0,0,0,.40) !important;

        backdrop-filter:
          blur(22px) !important;

        -webkit-backdrop-filter:
          blur(22px) !important;

        text-align: center !important;
      }

      .duo-sec-heart {
        margin-bottom: 8px !important;

        font-size: 48px !important;
        line-height: 1 !important;
      }

      .duo-sec-title {
        margin: 0 !important;

        color: white !important;

        font-family:
          Georgia,
          "Times New Roman",
          serif !important;

        font-size: 31px !important;
        font-weight: 500 !important;
      }

      .duo-sec-subtitle {
        margin:
          8px
          0
          18px !important;

        color:
          rgba(255,255,255,.62) !important;

        font-size: 14px !important;
      }

      .duo-sec-dots {
        display: flex !important;

        justify-content: center !important;

        gap: 11px !important;

        margin:
          19px
          0
          13px !important;
      }

      .duo-sec-dot {
        width: 13px !important;
        height: 13px !important;

        border:
          1px solid
          rgba(255,255,255,.34) !important;

        border-radius: 50% !important;

        background:
          rgba(255,255,255,.04) !important;
      }

      .duo-sec-dot.filled {
        border-color:
          #ee91ba !important;

        background:
          #ee91ba !important;

        box-shadow:
          0 0 13px
          rgba(238,145,186,.38) !important;
      }

      .duo-sec-message {
        min-height: 20px !important;

        margin:
          0
          0
          10px !important;

        color:
          #ffb4d2 !important;

        font-size: 13px !important;
        line-height: 1.4 !important;
      }

      .duo-sec-keypad {
        width: min(100%, 300px) !important;

        margin: 0 auto !important;

        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;

        gap: 9px !important;
      }

      .duo-sec-key {
        appearance: none !important;
        -webkit-appearance: none !important;

        min-height: 56px !important;

        border:
          1px solid
          rgba(255,255,255,.10) !important;

        border-radius: 18px !important;

        background:
          rgba(255,255,255,.07) !important;

        color: white !important;

        font: inherit !important;

        font-size: 22px !important;
        font-weight: 700 !important;

        cursor: pointer !important;

        -webkit-tap-highlight-color:
          transparent !important;
      }

      .duo-sec-key.empty {
        visibility: hidden !important;
      }

      .duo-sec-main-button {
        appearance: none !important;
        -webkit-appearance: none !important;

        width: min(100%, 300px) !important;

        min-height: 50px !important;

        margin-top: 11px !important;

        padding: 12px !important;

        border: 0 !important;

        border-radius: 16px !important;

        background:
          linear-gradient(135deg, #c95887, #993f6b) !important;

        color: white !important;

        font: inherit !important;
        font-weight: 800 !important;

        cursor: pointer !important;
      }

      .duo-sec-face {
        background:
          rgba(255,255,255,.09) !important;

        border:
          1px solid
          rgba(255,255,255,.10) !important;
      }

      .duo-sec-link {
        appearance: none !important;
        -webkit-appearance: none !important;

        margin-top: 11px !important;

        border: 0 !important;

        background:
          transparent !important;

        color:
          #f1a3c4 !important;

        font: inherit !important;
        font-size: 13px !important;
        font-weight: 700 !important;
      }

      .duo-sec-recovery {
        display: none !important;
      }

      .duo-sec-recovery.open {
        display: block !important;
      }

      .duo-sec-pin-panel.hidden {
        display: none !important;
      }

      .duo-sec-recovery p {
        color:
          rgba(255,255,255,.66) !important;

        font-size: 13px !important;
        line-height: 1.5 !important;
      }

      .duo-face-settings {
        margin-top: 15px !important;

        padding: 15px !important;

        border:
          1px solid
          rgba(255,255,255,.10) !important;

        border-radius: 18px !important;

        background:
          rgba(255,255,255,.04) !important;
      }

      .duo-face-settings strong {
        display: block !important;

        margin-bottom: 5px !important;

        color: white !important;
      }

      .duo-face-settings p {
        margin:
          0
          0
          10px !important;

        color:
          rgba(255,255,255,.58) !important;

        font-size: 12px !important;
        line-height: 1.45 !important;
      }

      .duo-face-settings button {
        width: 100% !important;

        min-height: 48px !important;

        border: 0 !important;

        border-radius: 15px !important;

        background:
          rgba(255,255,255,.09) !important;

        color: white !important;

        font: inherit !important;
        font-weight: 700 !important;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function createLock() {
    injectStyles();

    let lock =
      document.getElementById(
        "duoSecurityLock"
      );

    if (lock) {
      return lock;
    }

    lock =
      document.createElement(
        "div"
      );

    lock.id =
      "duoSecurityLock";

    lock.innerHTML = `
      <div class="duo-sec-card">

        <div class="duo-sec-heart">
          ❤️
        </div>

        <h2 class="duo-sec-title">
          DUO LOVE
        </h2>

        <div
          id="duoSecPinPanel"
          class="duo-sec-pin-panel"
        >

          <p class="duo-sec-subtitle">
            Deblochează aplicația
          </p>

          <div
            id="duoSecDots"
            class="duo-sec-dots"
          >
            <span class="duo-sec-dot"></span>
            <span class="duo-sec-dot"></span>
            <span class="duo-sec-dot"></span>
            <span class="duo-sec-dot"></span>
            <span class="duo-sec-dot"></span>
            <span class="duo-sec-dot"></span>
          </div>

          <p
            id="duoSecMessage"
            class="duo-sec-message"
          ></p>

          <div class="duo-sec-keypad">

            <button type="button" class="duo-sec-key" data-duo-digit="1">1</button>
            <button type="button" class="duo-sec-key" data-duo-digit="2">2</button>
            <button type="button" class="duo-sec-key" data-duo-digit="3">3</button>

            <button type="button" class="duo-sec-key" data-duo-digit="4">4</button>
            <button type="button" class="duo-sec-key" data-duo-digit="5">5</button>
            <button type="button" class="duo-sec-key" data-duo-digit="6">6</button>

            <button type="button" class="duo-sec-key" data-duo-digit="7">7</button>
            <button type="button" class="duo-sec-key" data-duo-digit="8">8</button>
            <button type="button" class="duo-sec-key" data-duo-digit="9">9</button>

            <button type="button" class="duo-sec-key empty" tabindex="-1">•</button>
            <button type="button" class="duo-sec-key" data-duo-digit="0">0</button>
            <button type="button" class="duo-sec-key" data-duo-delete="1">⌫</button>

          </div>

          <button
            id="duoSecUnlock"
            type="button"
            class="duo-sec-main-button"
          >
            Deblochează ❤️
          </button>

          <button
            id="duoSecFace"
            type="button"
            class="duo-sec-main-button duo-sec-face"
            hidden
          >
            👤 Deblochează cu Face ID
          </button>

          <button
            id="duoSecForgot"
            type="button"
            class="duo-sec-link"
          >
            Am uitat codul
          </button>

        </div>


        <div
          id="duoSecRecovery"
          class="duo-sec-recovery"
        >

          <p id="duoSecRecoveryText">
            Îți trimitem un link securizat pe email.
          </p>

          <p
            id="duoSecRecoveryMessage"
            class="duo-sec-message"
          ></p>

          <button
            id="duoSecSendRecovery"
            type="button"
            class="duo-sec-main-button"
          >
            📧 Trimite link pe email
          </button>

          <button
            id="duoSecRecoveryBack"
            type="button"
            class="duo-sec-main-button duo-sec-face"
          >
            Înapoi la cod
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(
      lock
    );

    bindLockEvents();

    return lock;
  }

  function setMessage(message) {
    const el =
      document.getElementById(
        "duoSecMessage"
      );

    if (el) {
      el.textContent =
        message || "";
    }
  }

  function updateDots() {
    const dots =
      document.querySelectorAll(
        "#duoSecDots .duo-sec-dot"
      );

    dots.forEach(
      function (dot, index) {
        dot.classList.toggle(
          "filled",
          index < pinBuffer.length
        );
      }
    );
  }

  async function submitPin() {
    if (
      verifying ||
      !validPin(pinBuffer)
    ) {
      setMessage(
        "Introdu între 4 și 6 cifre."
      );

      return;
    }

    verifying = true;

    setMessage(
      "Se verifică..."
    );

    const result =
      await verifyPin(
        pinBuffer
      );

    verifying = false;

    if (
      result.success &&
      result.correct
    ) {
      markUnlocked();

      setMessage(
        "Deblocat ❤️"
      );

      setTimeout(
        hideLock,
        130
      );

      return;
    }

    pinBuffer = "";

    updateDots();

    setMessage(
      result.error ||
      (
        result.success
          ? "Cod greșit."
          : "Codul nu a putut fi verificat."
      )
    );
  }

  async function refreshLockFaceButton() {
    const button =
      document.getElementById(
        "duoSecFace"
      );

    if (!button) {
      return;
    }

    const supported =
      await faceIdSupported();

    button.hidden =
      !(
        supported &&
        faceIdEnabled()
      );
  }

  function showPinPanel() {
    document
      .getElementById(
        "duoSecPinPanel"
      )
      ?.classList
      .remove(
        "hidden"
      );

    document
      .getElementById(
        "duoSecRecovery"
      )
      ?.classList
      .remove(
        "open"
      );

    pinBuffer = "";

    updateDots();

    setMessage("");

    refreshLockFaceButton();
  }

  async function showRecovery() {
    document
      .getElementById(
        "duoSecPinPanel"
      )
      ?.classList
      .add(
        "hidden"
      );

    document
      .getElementById(
        "duoSecRecovery"
      )
      ?.classList
      .add(
        "open"
      );

    const email =
      await getCurrentEmail();

    const text =
      document.getElementById(
        "duoSecRecoveryText"
      );

    if (text) {
      text.textContent =
        email
          ? (
              "Trimitem linkul la " +
              maskEmail(email) +
              ". Deschizi emailul și alegi un cod nou."
            )
          : "Îți trimitem un link securizat pe email.";
    }
  }

  function bindLockEvents() {
    document
      .querySelectorAll(
        "[data-duo-digit]"
      )
      .forEach(
        function (button) {
          button.addEventListener(
            "click",
            function () {
              if (
                verifying ||
                pinBuffer.length >= 6
              ) {
                return;
              }

              pinBuffer +=
                button.dataset.duoDigit;

              updateDots();

              setMessage("");

              /*
                La 6 cifre verificăm automat.
                La 4 sau 5 se apasă butonul Deblochează.
              */
              if (
                pinBuffer.length === 6
              ) {
                submitPin();
              }
            }
          );
        }
      );

    document
      .querySelector(
        "[data-duo-delete]"
      )
      ?.addEventListener(
        "click",
        function () {
          if (verifying) {
            return;
          }

          pinBuffer =
            pinBuffer.slice(
              0,
              -1
            );

          updateDots();

          setMessage("");
        }
      );

    document
      .getElementById(
        "duoSecUnlock"
      )
      ?.addEventListener(
        "click",
        submitPin
      );

    document
      .getElementById(
        "duoSecFace"
      )
      ?.addEventListener(
        "click",
        async function () {
          this.disabled = true;

          setMessage(
            "Se verifică Face ID..."
          );

          const result =
            await unlockWithFaceId();

          this.disabled = false;

          if (!result.success) {
            setMessage(
              result.error ||
              "Face ID nu a putut fi verificat."
            );
          }
        }
      );

    document
      .getElementById(
        "duoSecForgot"
      )
      ?.addEventListener(
        "click",
        showRecovery
      );

    document
      .getElementById(
        "duoSecRecoveryBack"
      )
      ?.addEventListener(
        "click",
        showPinPanel
      );

    document
      .getElementById(
        "duoSecSendRecovery"
      )
      ?.addEventListener(
        "click",
        async function () {
          const message =
            document.getElementById(
              "duoSecRecoveryMessage"
            );

          this.disabled = true;
          this.textContent =
            "⏳ Se trimite...";

          const result =
            await sendRecoveryLink();

          this.disabled = false;
          this.textContent =
            "📧 Retrimite linkul";

          if (message) {
            message.textContent =
              result.success
                ? "Email trimis ❤️ Apasă linkul „Sign in” din mesaj."
                : (
                    result.error ||
                    "Emailul nu a putut fi trimis."
                  );
          }
        }
      );
  }

  async function waitForSplash() {
    const start =
      Date.now();

    while (
      Date.now() - start <
      3500
    ) {
      const splash =
        document.getElementById(
          "duoLoveSplash"
        );

      if (
        !splash ||
        splash.classList.contains(
          "hide"
        ) ||
        getComputedStyle(splash)
          .display === "none"
      ) {
        return;
      }

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            80
          )
      );
    }
  }

  async function showLock() {
    const user =
      await getUser();

    if (!user) {
      return false;
    }

    if (
      !(await hasPin())
    ) {
      return false;
    }

    await waitForSplash();

    const lock =
      createLock();

    lock.classList.add(
      "open"
    );

    lockOpen = true;

    pinBuffer = "";

    showPinPanel();

    document.documentElement.style
      .setProperty(
        "overflow",
        "hidden",
        "important"
      );

    document.body.style
      .setProperty(
        "overflow",
        "hidden",
        "important"
      );

    return true;
  }

  function hideLock() {
    document
      .getElementById(
        "duoSecurityLock"
      )
      ?.classList
      .remove(
        "open"
      );

    lockOpen = false;

    document.documentElement.style
      .removeProperty(
        "overflow"
      );

    document.body.style
      .removeProperty(
        "overflow"
      );
  }

  function markInternalNavigation() {
    try {
      sessionStorage.setItem(
        INTERNAL_NAV_KEY,
        String(
          Date.now() + 3500
        )
      );
    } catch (_) {}
  }

  function shouldSkipForInternalNavigation() {
    try {
      const until =
        Number(
          sessionStorage.getItem(
            INTERNAL_NAV_KEY
          ) ||
          "0"
        );

      sessionStorage.removeItem(
        INTERNAL_NAV_KEY
      );

      return until > Date.now();

    } catch (_) {
      return false;
    }
  }

  function bindInternalNavigationDetection() {
    document.addEventListener(
      "click",
      function (event) {
        const target =
          event.target.closest(
            ".bottom-nav .nav-item, a[href]"
          );

        if (!target) {
          return;
        }

        if (
          target.matches(
            ".bottom-nav .nav-item"
          )
        ) {
          markInternalNavigation();

          return;
        }

        if (
          target.tagName === "A"
        ) {
          try {
            const url =
              new URL(
                target.href,
                location.href
              );

            if (
              url.origin ===
              location.origin
            ) {
              markInternalNavigation();
            }
          } catch (_) {}
        }
      },
      true
    );
  }

  async function refreshGuard(options = {}) {
    const user =
      await getUser();

    if (!user) {
      return false;
    }

    if (
      !(await hasPin())
    ) {
      hideLock();

      return false;
    }

    if (
      options.internalNavigation ===
      true
    ) {
      markUnlocked();

      hideLock();

      return true;
    }

    clearUnlocked();

    await showLock();

    return true;
  }

  function injectFaceSettings() {
    if (
      document.getElementById(
        "duoFaceSettings"
      )
    ) {
      return;
    }

    const pinButton =
      document.getElementById(
        "saveAccessPinButton"
      );

    if (!pinButton) {
      return;
    }

    injectStyles();

    const host =
      pinButton.closest(
        ".settings-big-card, .settings-card, section, div"
      );

    if (!host) {
      return;
    }

    const box =
      document.createElement(
        "div"
      );

    box.id =
      "duoFaceSettings";

    box.className =
      "duo-face-settings";

    box.innerHTML = `
      <strong>
        👤 Face ID
      </strong>

      <p id="duoFaceSettingsText">
        Poți debloca aplicația cu biometria iPhone-ului.
      </p>

      <button
        id="duoFaceSettingsButton"
        type="button"
      >
        Verificare...
      </button>
    `;

    const actions =
      host.querySelector(
        ".security-actions"
      );

    if (actions) {
      actions.insertAdjacentElement(
        "afterend",
        box
      );
    } else {
      host.appendChild(
        box
      );
    }

    document
      .getElementById(
        "duoFaceSettingsButton"
      )
      ?.addEventListener(
        "click",
        async function () {
          const text =
            document.getElementById(
              "duoFaceSettingsText"
            );

          this.disabled = true;

          if (faceIdEnabled()) {
            disableFaceIdLocal();

            if (text) {
              text.textContent =
                "Face ID a fost dezactivat pentru DUO LOVE.";
            }

            this.disabled = false;

            refreshFaceUi();

            return;
          }

          if (text) {
            text.textContent =
              "Confirmă Face ID pe iPhone...";
          }

          const result =
            await enableFaceId();

          this.disabled = false;

          if (text) {
            text.textContent =
              result.success
                ? "Face ID este activ ❤️"
                : (
                    result.error ||
                    "Face ID nu a putut fi activat."
                  );
          }

          refreshFaceUi();
        }
      );

    refreshFaceUi();
  }

  async function refreshFaceUi() {
    const button =
      document.getElementById(
        "duoFaceSettingsButton"
      );

    const text =
      document.getElementById(
        "duoFaceSettingsText"
      );

    if (!button) {
      return;
    }

    await getUser();

    const supported =
      await faceIdSupported();

    if (!supported) {
      button.disabled = true;
      button.textContent =
        "Face ID indisponibil";

      if (text) {
        text.textContent =
          "Dispozitivul sau browserul nu oferă biometrie pentru această pagină.";
      }

      return;
    }

    button.disabled = false;

    const enabled =
      faceIdEnabled();

    button.textContent =
      enabled
        ? "Dezactivează Face ID"
        : "Activează Face ID";

    if (
      text &&
      !enabled
    ) {
      text.textContent =
        "După activare, vei avea Face ID + cod ca metodă de rezervă.";
    }
  }

  async function init() {
    bindInternalNavigationDetection();

    const user =
      await getUser();

    if (!user) {
      return;
    }

    injectFaceSettings();

    const enabled =
      await hasPin();

    if (!enabled) {
      return;
    }

    /*
      Dacă am venit dintr-o altă pagină DUO LOVE,
      nu cerem din nou codul.
      Dacă am intrat/reîncărcat aplicația, cerem.
    */
    if (
      shouldSkipForInternalNavigation()
    ) {
      markUnlocked();

      return;
    }

    clearUnlocked();

    await showLock();
  }

  document.addEventListener(
    "visibilitychange",
    function () {
      if (
        document.visibilityState ===
        "hidden"
      ) {
        try {
          sessionStorage.setItem(
            HIDDEN_AT_KEY,
            String(
              Date.now()
            )
          );
        } catch (_) {}

        return;
      }

      if (
        document.visibilityState !==
          "visible" ||
        !pinEnabled
      ) {
        return;
      }

      let hiddenAt = 0;

      try {
        hiddenAt =
          Number(
            sessionStorage.getItem(
              HIDDEN_AT_KEY
            ) ||
            "0"
          );
      } catch (_) {}

      if (
        hiddenAt &&
        Date.now() - hiddenAt >=
          RELOCK_AFTER_BACKGROUND_MS
      ) {
        clearUnlocked();

        if (!lockOpen) {
          showLock();
        }
      }
    }
  );

  window.DuoLoveSecurity = {
    hasPin,
    verifyPin,
    setPin,
    disablePin,

    markUnlocked,
    clearUnlocked,

    showLock,
    hideLock,
    refreshGuard,

    sendRecoveryLink,

    getCurrentEmail,
    maskEmail,

    faceIdSupported,
    faceIdEnabled,
    enableFaceId,
    disableFaceId:
      disableFaceIdLocal,
    unlockWithFaceId
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        setTimeout(
          init,
          0
        );
      }
    );
  } else {
    setTimeout(
      init,
      0
    );
  }

})();
