/**
 * Универсальная модалка (для уведомлений, ошибок и т.п.)
 * @param {string} title
 * @param {string} message
 * @param {string} icon
 */
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
  document.body.classList.add("blurred");

  modal.querySelector(".modal-close").onclick = () => {
    modal.remove();
    document.body.classList.remove("blurred");
  };
}

/**
 * Специальная модалка для задания (XP + монеты)
 * @param {Object} task - объект задания
 */
export function showTaskModal({ step_number, title, detail, xp, coins }) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box">
      <h3>Задание №${step_number}</h3>
      <p>${detail || 'Описание недоступно'}</p>
      <p class="modal-reward">+${xp || 0} XP, +${coins || 0} монет</p>
      <button class="modal-close">Закрыть</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add('blurred');

  modal.querySelector(".modal-close").onclick = () => {
    modal.remove();
    document.body.classList.remove('blurred');
  };
}
