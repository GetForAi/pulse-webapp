/**
 * Создаёт и показывает модальное окно поверх контента
 * @param {string} title - Заголовок модального окна
 * @param {string} message - Основной текст
 * @param {string} icon - Эмодзи или иконка (опционально)
 */
export function showModal({ title, message, icon = "" }) {
  // Удалим старую модалку, если есть
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="modal-close">Ок</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.remove();
  });
}

