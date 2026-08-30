const guestButton =
  document.getElementById("guestLogin");

const googleButton =
  document.getElementById("googleLogin");

const appleButton =
  document.getElementById("appleLogin");

const loginStatus =
  document.getElementById("loginStatus");


const PRODUCTION_ORIGIN =
  "https://duo-love.netlify.app";


let loginInProgress =
  false;


/* =========================================================
   REDIRECȚIONARE HOME
========================================================= */

function goToHome() {

  window.location.replace(
    "./index.html"
  );

}


/* =========================================================
   VERIFICĂ DACĂ EȘTI PE VERSIUNEA NETLIFY
========================================================= */

function isProductionVersion() {

  return (
    window.location.origin ===
    PRODUCTION_ORIGIN
  );

}


/* =========================================================
   VERIFICĂ SESIUNEA EXISTENTĂ
========================================================= */

async function checkExistingSession() {

  if (
    typeof supabaseClient ===
    "undefined"
  ) {

    loginStatus.textContent =
      "Supabase nu este disponibil.";

    return;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .getSession();


    if (
      error
    ) {

      console.error(
        "Eroare sesiune:",
        error
      );

      return;

    }


    if (
      data &&
      data.session &&
      data.session.user
    ) {

      console.log(
        "❤️ Sesiune existentă:",
        data.session.user.id
      );


      goToHome();

    }

  } catch (error) {

    console.error(
      "Eroare verificare sesiune:",
      error
    );

  }

}


/* =========================================================
   ASCULTĂ SCHIMBĂRILE DE AUTENTIFICARE
========================================================= */

supabaseClient.auth
  .onAuthStateChange(
    function (
      event,
      session
    ) {

      console.log(
        "Auth:",
        event
      );


      if (
        session &&
        session.user &&
        (
          event ===
            "SIGNED_IN" ||
          event ===
            "TOKEN_REFRESHED"
        )
      ) {

        console.log(
          "❤️ Utilizator autentificat:",
          session.user.id
        );

      }

    }
  );


/* =========================================================
   GUEST
========================================================= */

guestButton.addEventListener(
  "click",
  async function () {

    if (
      loginInProgress
    ) {

      return;

    }


    loginInProgress =
      true;


    guestButton.disabled =
      true;

    googleButton.disabled =
      true;

    appleButton.disabled =
      true;


    loginStatus.textContent =
      "Se creează spațiul tău... ❤️";


    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth
          .signInAnonymously();


      if (
        error
      ) {

        throw error;

      }


      if (
        !data ||
        !data.session ||
        !data.user
      ) {

        throw new Error(
          "Sesiunea nu a fost creată."
        );

      }


      console.log(
        "Guest conectat:",
        data.user.id
      );


      await new Promise(
        function (
          resolve
        ) {

          setTimeout(
            resolve,
            250
          );

        }
      );


      const {
        data:
          sessionData,
        error:
          sessionError
      } =
        await supabaseClient.auth
          .getSession();


      if (
        sessionError
      ) {

        throw sessionError;

      }


      if (
        !sessionData ||
        !sessionData.session
      ) {

        throw new Error(
          "Sesiunea nu a rămas salvată."
        );

      }


      loginStatus.textContent =
        "Gata ❤️";


      setTimeout(
        function () {

          goToHome();

        },
        250
      );

    } catch (error) {

      console.error(
        "Eroare Guest:",
        error
      );


      loginStatus.textContent =
        "A apărut o problemă: " +
        (
          error.message ||
          "Nu s-a putut face autentificarea."
        );


      loginInProgress =
        false;


      guestButton.disabled =
        false;

      googleButton.disabled =
        false;

      appleButton.disabled =
        false;

    }

  }
);


/* =========================================================
   GOOGLE
========================================================= */

googleButton.addEventListener(
  "click",
  async function () {

    if (
      loginInProgress
    ) {

      return;

    }


    if (
      !isProductionVersion()
    ) {

      loginStatus.textContent =
        "Deschide aplicația de pe duo-love.netlify.app pentru Google.";

      return;

    }


    loginInProgress =
      true;


    guestButton.disabled =
      true;

    googleButton.disabled =
      true;

    appleButton.disabled =
      true;


    loginStatus.textContent =
      "Se deschide Google...";


    try {

      const {
        error
      } =
        await supabaseClient.auth
          .signInWithOAuth({

            provider:
              "google",

            options: {

              redirectTo:
                PRODUCTION_ORIGIN +
                "/index.html"

            }

          });


      if (
        error
      ) {

        throw error;

      }

    } catch (error) {

      console.error(
        "Eroare Google:",
        error
      );


      loginStatus.textContent =
        "Google nu a putut fi deschis: " +
        (
          error.message ||
          "eroare necunoscută"
        );


      loginInProgress =
        false;


      guestButton.disabled =
        false;

      googleButton.disabled =
        false;

      appleButton.disabled =
        false;

    }

  }
);


/* =========================================================
   APPLE
========================================================= */

appleButton.addEventListener(
  "click",
  async function () {

    if (
      loginInProgress
    ) {

      return;

    }


    if (
      !isProductionVersion()
    ) {

      loginStatus.textContent =
        "Deschide aplicația de pe duo-love.netlify.app pentru Apple.";

      return;

    }


    loginInProgress =
      true;


    guestButton.disabled =
      true;

    googleButton.disabled =
      true;

    appleButton.disabled =
      true;


    loginStatus.textContent =
      "Se deschide Apple...";


    try {

      const {
        error
      } =
        await supabaseClient.auth
          .signInWithOAuth({

            provider:
              "apple",

            options: {

              redirectTo:
                PRODUCTION_ORIGIN +
                "/index.html"

            }

          });


      if (
        error
      ) {

        throw error;

      }

    } catch (error) {

      console.error(
        "Eroare Apple:",
        error
      );


      loginStatus.textContent =
        "Apple nu a putut fi deschis: " +
        (
          error.message ||
          "eroare necunoscută"
        );


      loginInProgress =
        false;


      guestButton.disabled =
        false;

      googleButton.disabled =
        false;

      appleButton.disabled =
        false;

    }

  }
);


/* =========================================================
   START
========================================================= */

checkExistingSession();