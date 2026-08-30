const photoInput = document.getElementById("photoInput");
const memoriesGallery = document.getElementById("memoriesGallery");

let memories =
  JSON.parse(localStorage.getItem("memories")) || [];

function saveMemories() {
  localStorage.setItem(
    "memories",
    JSON.stringify(memories)
  );
}

function showMemories() {
  memoriesGallery.innerHTML = "";

  if (memories.length === 0) {
    memoriesGallery.innerHTML = `
      <div class="empty-memories">
        <span>📷</span>
        <p>Încă nu ai adăugat nicio amintire.</p>
      </div>
    `;

    return;
  }

  memories.forEach((memory, index) => {
    const card = document.createElement("article");

    card.className = "memory-card";

    card.innerHTML = `
      <img
        src="${memory.image}"
        alt="Amintirea noastră"
        class="memory-photo"
      >

      <div class="memory-info">
        <p class="memory-date">
          ${memory.date}
        </p>

        <button
          class="delete-memory"
          data-index="${index}"
        >
          🗑️ Șterge
        </button>
      </div>
    `;

    memoriesGallery.appendChild(card);
  });

  const deleteButtons =
    document.querySelectorAll(".delete-memory");

  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      memories.splice(index, 1);

      saveMemories();
      showMemories();
    });
  });
}

photoInput.addEventListener("change", event => {
  const files = Array.from(event.target.files);

  files.forEach(file => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = e => {
      const today = new Date();

      const formattedDate =
        today.toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });

      memories.unshift({
        image: e.target.result,
        date: formattedDate
      });

      saveMemories();
      showMemories();
    };

    reader.readAsDataURL(file);
  });

  photoInput.value = "";
});

showMemories();