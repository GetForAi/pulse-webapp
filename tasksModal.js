import { appState } from './state.js';
import { showModal } from './modal.js';
import { checkSubscription, updateStep, analyzeCalories } from './api.js';

export function showTaskModal(task, reloadCallback) {
  const { title, description, xp, coins, task_meta, step_number, type, completed } = task;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  const channelUsername = task_meta?.channel_username || "pulse_channel";
  const channelLink = `https://t.me/${channelUsername}`;

  let extraContent = "";

  if (type === "subscribe" && !completed) {
    extraContent = `
      <div style="margin-top: 10px;">
        <a href="${channelLink}" target="_blank" class="subscribe-btn">Перейти на канал</a>
        <button class="modal-check" id="check-subscribe">Проверить</button>
      </div>`;
  }

  if (type === "calories" && !completed) {
    extraContent = `
      <div style="margin-top: 14px;">
        <textarea id="calories-input" rows="4" placeholder="Что вы ели за день..." style="width: 100%; padding: 10px; border-radius: 10px;"></textarea>
        <button class="modal-check" id="submit-calories" style="margin-top: 10px;">Отправить</button>
      </div>`;
  }

  modal.innerHTML = `
    <div class="modal-box">
      <h3>${title}</h3>
      <p>${description || "Описание недоступно"}</p>
      <p class="modal-reward">+${xp || 0} XP, +${coins || 0} монет</p>
      ${extraContent}
      <button class="modal-close" id="close-task-modal">Закрыть</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("app").classList.add("blurred");

  document.getElementById("close-task-modal").onclick = () => {
    modal.remove();
    document.getElementById("app").classList.remove("blurred");
  };

  const checkBtn = document.getElementById("check-subscribe");
  if (checkBtn) {
    checkBtn.onclick = async () => {
      checkBtn.disabled = true;
      checkBtn.textContent = "Проверка...";
      try {
        const data = await checkSubscription(channelUsername);
        if (data.subscribed) {
          const updated = await updateStep(step_number);
          showSuccess(updated, xp, coins, reloadCallback);
        } else {
          showModal({ title: "Не найдено подписки", message: "Telegram не видит вашу подписку.", icon: "❌" });
          checkBtn.disabled = false;
          checkBtn.textContent = "Проверить";
        }
      } catch {
        showModal({ title: "Ошибка", message: "Не удалось проверить подписку.", icon: "⚠️" });
        checkBtn.disabled = false;
        checkBtn.textContent = "Проверить";
      }
    };
  }

  const submitCalories = document.getElementById("submit-calories");
  if (submitCalories) {
    submitCalories.onclick = async () => {
      const inputText = document.getElementById("calories-input").value.trim();
      if (!inputText) {
        showModal({ title: "⚠️ Пусто", message: "Опишите ваш рацион.", icon: "📝" });
        return;
      }

      submitCalories.disabled = true;
      submitCalories.textContent = "Подсчёт...";

      try {
        const result = await analyzeCalories(inputText);
        const total = result.items.reduce((sum, item) => sum + (item.calories || 0), 0);
        const updated = await updateStep(step_number);

        showModal({
          title: "✅ Задание выполнено",
          message: `Вы потребили ${Math.round(total)} калорий.\nВы получили ${xp} XP и ${coins} монет.\nТеперь у вас ${updated.xp} XP и уровень ${updated.level}.`,
          icon: "🎯"
        });

        modal.remove();
        document.getElementById("app").classList.remove("blurred");
        if (typeof reloadCallback === "function") setTimeout(reloadCallback, 800);
      } catch (err) {
        console.error(err);
        showModal({ title: "Ошибка", message: "Не удалось подсчитать калории. Попробуйте позже.", icon: "⚠️" });
        submitCalories.disabled = false;
        submitCalories.textContent = "Отправить";
      }
    };
  }

  function showSuccess(updated, xp, coins, reloadCallback) {
    showModal({
      title: "🎉 Готово!",
      message: `Вы получили ${xp} XP и ${coins} монет.\nТеперь у вас ${updated.xp} XP и уровень ${updated.level}.`,
      icon: "✅"
    });

    modal.remove();
    document.getElementById("app").classList.remove("blurred");
    if (typeof reloadCallback === "function") setTimeout(reloadCallback, 800);
  }
}
