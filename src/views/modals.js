// Экспортируем функцию для открытия модалки достижения
export function openAchievementModal(id) {
  const achievement = achievements.find(a => a.id === id);  // Если achievements не определено, это может быть причиной ошибки
  if (!achievement) return; // Проверка, чтобы избежать ошибки если achievement не найдено
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <h2>${achievement.name}</h2>
    <p>${achievement.description}</p>
    <p>Награда: ${achievement.reward}</p>
  `;
  document.getElementById('achievement-modal').style.display = 'block';
}

// Универсальная модалка (ошибки, уведомления и т.д.)
export function showModal({ title, message, icon = "" }) {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box">
      ${icon ? `<div class="modal-icon">${icon}</div>` : ""}
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="modal-close">Ок</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById("app").classList.add("blurred");

  modal.querySelector(".modal-close").onclick = () => {
    modal.remove();
    document.getElementById("app").classList.remove("blurred");
  };
}
