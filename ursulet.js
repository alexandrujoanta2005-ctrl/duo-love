const bear = document.querySelector(".bear");

if (bear) {

  bear.addEventListener("click", function () {

    // Ursulețul sare
    bear.classList.remove("bear-jump");

    void bear.offsetWidth;

    bear.classList.add("bear-jump");


    // Poziția ursulețului
    const rect =
      bear.getBoundingClientRect();


    // Creează inimioare
    for (let i = 0; i < 5; i++) {

      const heart =
        document.createElement("span");

      heart.className = "bear-heart";

      heart.textContent =
        ["❤️", "💕", "💗", "💖"][
          Math.floor(Math.random() * 4)
        ];


      heart.style.left =
        rect.left +
        rect.width / 2 +
        (Math.random() * 70 - 35) +
        "px";


      heart.style.top =
        rect.top +
        rect.height / 2 +
        "px";


      heart.style.animationDelay =
        (i * 0.08) + "s";


      document.body.appendChild(heart);


      setTimeout(() => {
        heart.remove();
      }, 1800);

    }

  });


  bear.addEventListener(
    "animationend",
    function (event) {

      if (
        event.animationName === "bearJump"
      ) {
        bear.classList.remove("bear-jump");
      }

    }
  );

}