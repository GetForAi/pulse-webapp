// src/views/achievementsView.js
export async function initAchievementsView() {
  const container = document.getElementById("content");
  container.innerHTML = `<p>Загрузка достижений...</p>`;

  try {
    const res = await fetch(`https://prizegift.space/get_achievements`);
    if (!res.ok) throw new Error("Ошибка получения достижений");

    const data = await res.json(); // массив достижений
    container.innerHTML = `
      <div class="achievements-grid">
        ${data.map(ach => `
          <div class="achievement-tile" data-ach='${JSON.stringify(ach)}'>
            <img src="${ach.icon}" alt="${ach.title}" />
            <div class="title">${ach.title}</div>
          </div>
        `).join("")}
      </div>
    `;

    document.querySelectorAll(".achievement-tile").forEach(tile => {
      const ach = JSON.parse(tile.dataset.ach);
      tile.addEventListener("click", () => {
        alert(`${ach.title}\n\n${ach.description}\n+${ach.xp} XP, +${ach.coins} монет`);
      });
    });

  } catch (err) {
    console.error("Ошибка загрузки ачивок:", err);
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки ачивок</p>`;
  }
}
