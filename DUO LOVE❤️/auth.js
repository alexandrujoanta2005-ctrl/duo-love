// ==========================================
// AUTENTIFICAREA APLICAȚIEI
// ==========================================


// Verifică dacă utilizatorul este conectat
async function requireAuth() {

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getSession();


    if (error) {

      console.error(
        "Eroare la verificarea sesiunii:",
        error
      );

      window.location.replace(
        "login.html"
      );

      return;
    }


    // Nu există utilizator conectat
    if (!data.session) {

      window.location.replace(
        "login.html"
      );

      return;
    }


    console.log(
      "Utilizator conectat:",
      data.session.user.id
    );

  }

  catch (error) {

    console.error(
      "Eroare autentificare:",
      error
    );

    window.location.replace(
      "login.html"
    );

  }

}



// ==========================================
// AFLĂ UTILIZATORUL CURENT
// ==========================================

async function getCurrentUser() {

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();


    if (error) {

      console.error(
        "Nu am putut afla utilizatorul:",
        error
      );

      return null;
    }


    return data.user;

  }

  catch (error) {

    console.error(error);

    return null;

  }

}



// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

  try {

    const {
      error
    } =
      await supabaseClient.auth.signOut();


    if (error) {

      console.error(error);

      alert(
        "Nu s-a putut face delogarea."
      );

      return;
    }


    window.location.replace(
      "login.html"
    );

  }

  catch (error) {

    console.error(error);

    alert(
      "A apărut o eroare la delogare."
    );

  }

}