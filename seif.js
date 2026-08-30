const vaultLocked =
  document.getElementById("vaultLocked");

const vaultContent =
  document.getElementById("vaultContent");

const vaultPin =
  document.getElementById("vaultPin");

const unlockVault =
  document.getElementById("unlockVault");

const vaultText =
  document.getElementById("vaultText");

const saveVault =
  document.getElementById("saveVault");


vaultText.value =
  localStorage.getItem("vaultText") || "";


unlockVault.addEventListener(
  "click",
  function () {

    const savedPin =
      localStorage.getItem("appPin");


    if (!savedPin) {

      alert(
        "Mai întâi setează un PIN în Setări."
      );

      return;
    }


    if (
      vaultPin.value.trim() !==
      savedPin
    ) {

      alert("PIN greșit.");

      return;
    }


    vaultLocked.classList.add("hidden");

    vaultContent.classList.remove("hidden");

  }
);


saveVault.addEventListener(
  "click",
  function () {

    localStorage.setItem(
      "vaultText",
      vaultText.value
    );

    alert("Salvat în seif ❤️");

  }
);