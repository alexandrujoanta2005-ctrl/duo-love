const openEventModal =
  document.getElementById("openEventModal");

const eventModal =
  document.getElementById("eventModal");

const closeEventModal =
  document.getElementById("closeEventModal");

const eventTitle =
  document.getElementById("eventTitle");

const eventDate =
  document.getElementById("eventDate");

const eventNote =
  document.getElementById("eventNote");

const saveEvent =
  document.getElementById("saveEvent");

const eventsList =
  document.getElementById("eventsList");


let events =
  JSON.parse(localStorage.getItem("loveEvents")) || [];


function saveEvents() {
  localStorage.setItem(
    "loveEvents",
    JSON.stringify(events)
  );
}


function daysUntil(dateString) {

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const target =
    new Date(dateString + "T00:00:00");

  const difference =
    target - today;

  return Math.ceil(
    difference / 86400000
  );
}


function renderEvents() {

  eventsList.innerHTML = "";

  if (events.length === 0) {

    eventsList.innerHTML = `
      <div class="empty-memories">
        <span>📅</span>
        <p>Încă nu ai adăugat niciun eveniment.</p>
      </div>
    `;

    return;
  }


  events.forEach((event, index) => {

    const days =
      daysUntil(event.date);

    let countdown = "";

    if (days > 1) {
      countdown = `Mai sunt ${days} zile`;
    }

    else if (days === 1) {
      countdown = "Mai este o zi ❤️";
    }

    else if (days === 0) {
      countdown = "Este astăzi! 🎉";
    }

    else {
      countdown = "Eveniment trecut";
    }


    const card =
      document.createElement("article");

    card.className =
      "event-card";

    card.innerHTML = `
      <div class="event-icon">
        ❤️
      </div>

      <div class="event-main">
        <h2>${escapeHTML(event.title)}</h2>

        <p class="event-date">
          ${new Date(event.date + "T00:00:00")
            .toLocaleDateString("ro-RO", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
        </p>

        <strong class="event-countdown">
          ${countdown}
        </strong>

        ${
          event.note
            ? `<p class="event-note">${escapeHTML(event.note)}</p>`
            : ""
        }

        <button
          class="delete-event"
          data-index="${index}"
        >
          🗑️ Șterge
        </button>
      </div>
    `;

    eventsList.appendChild(card);

  });


  document
    .querySelectorAll(".delete-event")
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const index =
            Number(this.dataset.index);

          events.splice(index, 1);

          saveEvents();
          renderEvents();

        }
      );

    });

}


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


openEventModal.addEventListener(
  "click",
  () => {
    eventModal.classList.remove("hidden");
  }
);


closeEventModal.addEventListener(
  "click",
  () => {
    eventModal.classList.add("hidden");
  }
);


saveEvent.addEventListener(
  "click",
  () => {

    const title =
      eventTitle.value.trim();

    const date =
      eventDate.value;

    const note =
      eventNote.value.trim();


    if (!title || !date) {

      alert(
        "Scrie numele evenimentului și alege data."
      );

      return;
    }


    events.unshift({
      title,
      date,
      note
    });


    saveEvents();


    eventTitle.value = "";
    eventDate.value = "";
    eventNote.value = "";


    eventModal.classList.add("hidden");

    renderEvents();

  }
);


renderEvents();