import { appState } from "../state.js";

/**
 * Универсальная модалка (ошибки, уведомления и т.д.)
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
 * Модалка для задания с кнопками перехода и проверки
 */
export function showTaskModal(task) {
  const { title, detail, xp, coins, task_meta, step_number, type, completed } = task;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  let channelLink = "";
  if (type === "subscribe" && task_meta?.channel_username) {
    channelLink = `https://t.me/${task_meta.channel_username}`;
  }

  modal.innerHTML = `
    <div class="modal-box">
      <h3>${title}</h3>
      <p>${detail || "Описание недоступно"}</p>
      <p class="modal-reward">+${xp || 0} XP, +${coins || 0} монет</p>

      ${type === "subscribe" && !completed ? `
        <div style="margin-top: 10px;">
          <a href="${channelLink}" target="_blank" class="subscribe-btn">Перейти на канал</a>
          <button class="modal-check" id="check-subscribe">Проверить</button>
        </div>
      ` : ""}

      <button class="modal-close" id="close-task-modal">Закрыть</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add("blurred");

  document.getElementById("close-task-modal").onclick = () => {
    modal.remove();
    document.body.classList.remove("blurred");
  };

  const checkBtn = document.getElementById("check-subscribe");
  if (checkBtn) {
    checkBtn.onclick = async () => {
      checkBtn.disabled = true;
      checkBtn.textContent = "Проверка...";

      try {
        const res = await fetch("https://prizegift.space/check_subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegram_id: appState.telegramId,
            channel: task_meta.channel_username,
          }),
        });

        const data = await res.json();
        if (data.subscribed) {
          await fetch("https://prizegift.space/update_step", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              telegram_id: appState.telegramId,
              step_number,
            }),
          });

          showModal({
            title: "🎉 Готово!",
            message: `Вы подписались и получили ${xp} XP и ${coins} монет.`,
            icon: "✅",
          });

          modal.remove();
          document.body.classList.remove("blurred");
          setTimeout(() => window.location.reload(), 800);
        } else {
          showModal({
            title: "Не найдено подписки",
            message: "Вы ещё не подписались на канал или Telegram не обновил данные.",
            icon: "❌",
          });
          checkBtn.disabled = false;
          checkBtn.textContent = "Проверить";
        }
      } catch (err) {
        console.error(err);
        showModal({
          title: "Ошибка проверки",
          message: "Не удалось проверить подписку. Попробуйте позже.",
          icon: "⚠️",
        });
        checkBtn.disabled = false;
        checkBtn.textContent = "Проверить";
      }
    };
  }
}
