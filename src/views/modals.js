// Пример массива достижений
const achievements = [
  {
    id: 1,
    name: 'Первое достижение',
    description: 'Описание первого достижения',
    reward: '10 XP, 5 монет',
    completed: false,
    icon: 'path_to_icon_1'  // Путь к изображению для достижения
  },
  {
    id: 2,
    name: 'Второе достижение',
    description: 'Описание второго достижения',
    reward: '20 XP, 10 монет',
    completed: true,
    icon: 'path_to_icon_2'
  },
  // Добавь другие достижения по аналогии
];

// Экспортируем функцию для открытия модалки достижения
export function openAchievementModal(id) {
  const achievement = achievements.find(a => a.id === id); // Ищем достижение по id
  if (!achievement) return; // Если достижение не найдено, выходим

  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = 
    <h2>${achievement.name}</h2>
    <p>${achievement.description}</p>
    <p>Награда: ${achievement.reward}</p>
  ;
  document.getElementById('achievement-modal').style.display = 'block';
}

// Экспортируем функцию для показа модалки задания
export function showTaskModal(task, reloadCallback) {
  const { title, description, xp, coins, task_meta, step_number, type, completed } = task;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  const channelUsername = task_meta?.channel_username || "pulse_channel";
  const channelLink = https://t.me/${channelUsername};

  modal.innerHTML = 
    <div class="modal-box">
      <h3>${title}</h3>
      <p>${description || "Описание недоступно"}</p>
      <p class="modal-reward">+${xp || 0} XP, +${coins || 0} монет</p>

      ${type === "subscribe" && !completed ? 
        <div style="margin-top: 10px;">
          <a href="${channelLink}" target="_blank" class="subscribe-btn">Перейти на канал</a>
          <button class="modal-check" id="check-subscribe">Проверить</button>
        </div>
       : ""}

      <button class="modal-close" id="close-task-modal">Закрыть</button>
    </div>
  ;

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
            message: Вы подписались и получили ${xp} XP и ${coins} монет.\n\nТеперь у вас ${newXP} XP и уровень ${newLevel}.,
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
    div.id = achievement-${achievement.id};
    div.onclick = () => openAchievementModal(achievement.id);

    const img = document.createElement('img');
    img.src = achievement.icon; // Используем путь к изображению
    div.appendChild(img);

    const title = document.createElement('div');
    title.classList.add('title');
    title.innerText = achievement.name;
    div.appendChild(title);

    achievementGrid.appendChild(div);
  });
}

// Универсальная модалка (ошибки, уведомления и т.д.)
export function showModal({ title, message, icon = "" }) {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove(); // Убираем старую модалку, если она есть

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = 
    <div class="modal-box">
      ${icon ? <div class="modal-icon">${icon}</div> : ""}
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="modal-close">Ок</button>
    </div>
  ;
  document.body.appendChild(modal);
  document.getElementById("app").classList.add("blurred");

  modal.querySelector(".modal-close").onclick = () => {
    modal.remove();
    document.getElementById("app").classList.remove("blurred");
  };
}
