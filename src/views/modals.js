// Экспортируем функцию для открытия модалки задания
export function showTaskModal(task, reloadCallback) {
  const { title, description, xp, coins, task_meta, step_number, type, completed } = task;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  const channelUsername = task_meta?.channel_username || "pulse_channel";
  const channelLink = `https://t.me/${channelUsername}`;

  modal.innerHTML = `
    <div class="modal-box">
      <h3>${title}</h3>
      <p>${description || "Описание недоступно"}</p>
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
        const res = await fetch("https://prizegift.space/check_subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegram_id: appState.telegramId,
            channel: channelUsername
          }),
        });

        const data = await res.json();
        if (data.subscribed) {
          const updateRes = await fetch("https://prizegift.space/update_step", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              telegram_id: appState.telegramId,
              step_number
            }),
          });

          const updated = await updateRes.json();
          const { xp: newXP, coins: newCoins, level: newLevel } = updated;

          showModal({
            title: "🎉 Готово!",
            message: `Вы подписались и получили ${xp} XP и ${coins} монет.\n\nТеперь у вас ${newXP} XP и уровень ${newLevel}.`,
            icon: "✅"
          });

          modal.remove();
          document.getElementById("app").classList.remove("blurred");

          if (typeof reloadCallback === "function") {
            setTimeout(reloadCallback, 800);
          }

        } else {
          showModal({
            title: "Не найдено подписки",
            message: "Вы ещё не подписались на канал или Telegram не успел обновить данные.",
            icon: "❌"
          });
          checkBtn.disabled = false;
          checkBtn.textContent = "Проверить";
        }

      } catch (err) {
        console.error(err);
        showModal({
          title: "Ошибка проверки",
          message: "Не удалось проверить подписку. Попробуйте позже.",
          icon: "⚠️"
        });
        checkBtn.disabled = false;
        checkBtn.textContent = "Проверить";
      }
    };
  }
}

// Экспортируем функцию для рендеринга достижений
export function renderAchievements() {
  const achievementGrid = document.querySelector('.achievements-grid');
  achievements.forEach(achievement => {
    const div = document.createElement('div');
    div.classList.add('achievement-tile');
    if (achievement.completed) {
      div.classList.add('completed');
    }
    div.id = `achievement-${achievement.id}`;
    div.onclick = () => openAchievementModal(achievement.id);

    const img = document.createElement('img');
    img.src = 'path_to_image'; // Путь к изображению
    div.appendChild(img);

    const title = document.createElement('div');
    title.classList.add('title');
    title.innerText = achievement.name;
    div.appendChild(title);

    achievementGrid.appendChild(div);
  });
}
