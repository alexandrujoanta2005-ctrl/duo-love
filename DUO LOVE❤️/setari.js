/* =========================================
   SETĂRI APLICAȚIE ❤️
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const firstNameInput =
    document.getElementById("firstNameInput");

  const secondNameInput =
    document.getElementById("secondNameInput");

  const relationshipDateInput =
    document.getElementById("relationshipDateInput");

  const coupleQuoteInput =
    document.getElementById("coupleQuoteInput");

  const fontSelect =
    document.getElementById("fontSelect");

  const fontSizeRange =
    document.getElementById("fontSizeRange");

  const fontSizeValue =
    document.getElementById("fontSizeValue");

  const fontPreview =
    document.getElementById("fontPreview");

  const saveButton =
    document.getElementById("saveAllSettings");

  const saveConfirmation =
    document.getElementById("saveConfirmation");

  const couplePhotoInput =
    document.getElementById("couplePhotoInput");

  const settingsCouplePhoto =
    document.getElementById("settingsCouplePhoto");

  const backgroundImageInput =
    document.getElementById("backgroundImageInput");

  const customBackgroundPreview =
    document.getElementById("customBackgroundPreview");

  const customBackgroundPlaceholder =
    document.getElementById("customBackgroundPlaceholder");

  const removeBackgroundButton =
    document.getElementById("removeBackgroundButton");


  /* =========================
     ÎNCARCĂ DATELE SALVATE
  ========================= */

  function loadSettings() {

    if (firstNameInput) {
      firstNameInput.value =
        localStorage.getItem("firstName") || "";
    }

    if (secondNameInput) {
      secondNameInput.value =
        localStorage.getItem("secondName") || "";
    }

    if (relationshipDateInput) {
      const savedDate =
        localStorage.getItem("relationshipStartDate");

      if (savedDate) {
        relationshipDateInput.value =
          savedDate.substring(0, 16);
      }
    }

    if (coupleQuoteInput) {
      coupleQuoteInput.value =
        localStorage.getItem("coupleQuote") ||
        "În fiecare zi aleg din nou să te iubesc.";
    }

    if (fontSelect) {
      fontSelect.value =
        localStorage.getItem("appFont") ||
        "system";
    }

    if (fontSizeRange) {
      fontSizeRange.value =
        localStorage.getItem("appFontSize") ||
        "100";
    }

    const savedPhoto =
      localStorage.getItem("couplePhoto");

    if (
      savedPhoto &&
      settingsCouplePhoto
    ) {
      settingsCouplePhoto.src =
        savedPhoto;
    }

    const customBackground =
      localStorage.getItem("customBackground");

    if (
      customBackground &&
      customBackgroundPreview
    ) {
      customBackgroundPreview.src =
        customBackground;

      customBackgroundPreview.style.display =
        "block";

      if (customBackgroundPlaceholder) {
        customBackgroundPlaceholder.style.display =
          "none";
      }
    }

    updateFontPreview();

  }


  /* =========================
     FONT PREVIEW
  ========================= */

  function updateFontPreview() {

    if (
      !fontSelect ||
      !fontSizeRange ||
      !fontPreview
    ) {
      return;
    }

    const font =
      fontSelect.value;

    const size =
      fontSizeRange.value;

    fontPreview.className =
      "font-preview preview-" + font;

    fontPreview.style.fontSize =
      (27 * Number(size) / 100) + "px";

    if (fontSizeValue) {
      fontSizeValue.textContent =
        size + "%";
    }

  }


  if (fontSelect) {
    fontSelect.addEventListener(
      "change",
      updateFontPreview
    );
  }


  if (fontSizeRange) {
    fontSizeRange.addEventListener(
      "input",
      updateFontPreview
    );
  }


  /* =========================
     COMPRESIE IMAGINE
  ========================= */

  function compressImage(
    file,
    maxSide,
    quality,
    callback
  ) {

    const reader =
      new FileReader();

    reader.onload =
      function (event) {

        const image =
          new Image();

        image.onload =
          function () {

            const scale =
              Math.min(
                1,
                maxSide /
                Math.max(
                  image.width,
                  image.height
                )
              );

            const width =
              Math.round(
                image.width * scale
              );

            const height =
              Math.round(
                image.height * scale
              );

            const canvas =
              document.createElement("canvas");

            canvas.width =
              width;

            canvas.height =
              height;

            const ctx =
              canvas.getContext("2d");

            ctx.drawImage(
              image,
              0,
              0,
              width,
              height
            );

            const imageData =
              canvas.toDataURL(
                "image/jpeg",
                quality
              );

            callback(imageData);

          };

        image.src =
          event.target.result;

      };

    reader.readAsDataURL(file);

  }


  /* =========================
     POZA CUPLULUI
  ========================= */

  if (couplePhotoInput) {

    couplePhotoInput.addEventListener(
      "change",
      function () {

        const file =
          this.files &&
          this.files[0];

        if (
          !file ||
          !file.type.startsWith("image/")
        ) {
          return;
        }

        compressImage(
          file,
          1400,
          0.82,
          function (imageData) {

            if (settingsCouplePhoto) {
              settingsCouplePhoto.src =
                imageData;
            }

            try {
              localStorage.setItem(
                "couplePhoto",
                imageData
              );
            }
            catch (error) {
              alert(
                "Poza este prea mare."
              );
            }

          }
        );

      }
    );

  }


  /* =========================
     FUNDAL DIN GALERIE
  ========================= */

  if (backgroundImageInput) {

    backgroundImageInput.addEventListener(
      "change",
      function () {

        const file =
          this.files &&
          this.files[0];

        if (
          !file ||
          !file.type.startsWith("image/")
        ) {
          return;
        }

        compressImage(
          file,
          1600,
          0.72,
          function (imageData) {

            try {

              localStorage.setItem(
                "customBackground",
                imageData
              );

              localStorage.setItem(
                "selectedTheme",
                "custom"
              );

              if (customBackgroundPreview) {
                customBackgroundPreview.src =
                  imageData;

                customBackgroundPreview.style.display =
                  "block";
              }

              if (customBackgroundPlaceholder) {
                customBackgroundPlaceholder.style.display =
                  "none";
              }

              if (
                window.applyGlobalBackground
              ) {
                window.applyGlobalBackground();
              }

            }
            catch (error) {

              alert(
                "Fundalul este prea mare."
              );

            }

          }
        );

      }
    );

  }


  /* =========================
     ELIMINĂ FUNDAL
  ========================= */

  if (removeBackgroundButton) {

    removeBackgroundButton.addEventListener(
      "click",
      function () {

        localStorage.removeItem(
          "customBackground"
        );

        localStorage.setItem(
          "selectedTheme",
          "dark"
        );

        if (customBackgroundPreview) {
          customBackgroundPreview.src =
            "";

          customBackgroundPreview.style.display =
            "none";
        }

        if (customBackgroundPlaceholder) {
          customBackgroundPlaceholder.style.display =
            "block";
        }

        if (
          window.applyGlobalBackground
        ) {
          window.applyGlobalBackground();
        }

      }
    );

  }


  /* =========================
     SALVARE SETĂRI
  ========================= */

  if (saveButton) {

    saveButton.addEventListener(
      "click",
      function () {

        if (firstNameInput) {
          localStorage.setItem(
            "firstName",
            firstNameInput.value.trim()
          );
        }

        if (secondNameInput) {
          localStorage.setItem(
            "secondName",
            secondNameInput.value.trim()
          );
        }

        if (
          relationshipDateInput &&
          relationshipDateInput.value
        ) {
          localStorage.setItem(
            "relationshipStartDate",
            relationshipDateInput.value
          );
        }

        if (coupleQuoteInput) {
          localStorage.setItem(
            "coupleQuote",
            coupleQuoteInput.value.trim()
          );
        }

        if (fontSelect) {
          localStorage.setItem(
            "appFont",
            fontSelect.value
          );
        }

        if (fontSizeRange) {
          localStorage.setItem(
            "appFontSize",
            fontSizeRange.value
          );
        }

        if (
          window.applyGlobalFont
        ) {
          window.applyGlobalFont();
        }

        if (saveConfirmation) {
          saveConfirmation.textContent =
            "❤️ Setările au fost salvate!";

          setTimeout(
            function () {
              saveConfirmation.textContent =
                "";
            },
            2500
          );
        }

      }
    );

  }


  loadSettings();

});