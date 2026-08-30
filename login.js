const guestButton =
  document.getElementById("guestLogin");

const googleButton =
  document.getElementById("googleLogin");

const appleButton =
  document.getElementById("appleLogin");

const loginStatus =
  document.getElementById("loginStatus");



/* ===================================== */
/* VERIFICĂ DACĂ ESTE DEJA CONECTAT */
/* ===================================== */

async function checkExistingSession() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getSession();


  if (error) {

    console.error(error);

    return;

  }


  if (data.session) {

    window.location.href =
      "index.html";

  }

}



checkExistingSession();



/* ===================================== */
/* GUEST */
/* ===================================== */

guestButton.addEventListener(
  "click",
  async function () {

    loginStatus.textContent =
      "Se creează spațiul tău... ❤️";

    guestButton.disabled =
      true;


    const {
      data,
      error
    } =
      await supabaseClient.auth
        .signInAnonymously();


    if (error) {

      console.error(error);

      loginStatus.textContent =
        "A apărut o problemă: " +
        error.message;

      guestButton.disabled =
        false;

      return;

    }


    console.log(
      "Guest conectat:",
      data.user
    );


    loginStatus.textContent =
      "Gata ❤️";


    setTimeout(
      function () {

        window.location.href =
          "index.html";

      },
      400
    );

  }
);



/* ===================================== */
/* GOOGLE */
/* ===================================== */

googleButton.addEventListener(
  "click",
  async function () {

    loginStatus.textContent =
      "Se deschide Google...";


    const {
      error
    } =
      await supabaseClient.auth
        .signInWithOAuth({

          provider: "google",

          options: {

            redirectTo:
              window.location.origin +
              "/index.html"

          }

        });


    if (error) {

      console.error(error);

      loginStatus.textContent =
        "Google nu este configurat încă.";

    }

  }
);



/* ===================================== */
/* APPLE */
/* ===================================== */

appleButton.addEventListener(
  "click",
  async function () {

    loginStatus.textContent =
      "Se deschide Apple...";


    const {
      error
    } =
      await supabaseClient.auth
        .signInWithOAuth({

          provider: "apple",

          options: {

            redirectTo:
              window.location.origin +
              "/index.html"

          }

        });


    if (error) {

      console.error(error);

      loginStatus.textContent =
        "Apple nu este configurat încă.";

    }

  }
);