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
  if (existing) existing.remove(); // Убираем старую модалку, если она есть

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

// Функция для рендеринга достижений
export function renderAchievements() {
  const achievementGrid = document.querySelector('.achievements-grid');
  achievements.forEach(achievement => {
    const div = document.createElement('div');
    div.classList.add('achievement-tile');
    if (achievement.completed) {
      div.classList.add('completed');
    }
    div.id = `achievement-${achievement.id}`;
    div.onclick = () => openAchievementModal(achievement.id); // Добавляем обработчик для открытия модалки

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
