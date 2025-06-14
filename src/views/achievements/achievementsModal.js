import { showModal } from './modal.js';

// Массив достижений (в будущем из БД)
export const achievements = [
  {
    id: 1,
    name: 'Первое достижение',
    description: 'Описание первого достижения',
    reward: '10 XP, 5 монет',
    completed: false,
    icon: 'path_to_icon_1'
  },
  {
    id: 2,
    name: 'Второе достижение',
    description: 'Описание второго достижения',
    reward: '20 XP, 10 монет',
    completed: true,
    icon: 'path_to_icon_2'
  }
];

// Открытие модалки при клике на достижение
export function openAchievementModal(id) {
  const achievement = achievements.find(a => a.id === id);
  if (!achievement) return;
  showModal({
    title: achievement.name,
    message: `<div>${achievement.description}</div>
      <div class="modal-reward">Награда: ${achievement.reward}</div>`,
    icon: ""
  });
}

// Рендер достижений в grid
export function renderAchievements() {
  const grid = document.querySelector('.achievements-grid');
  grid.innerHTML = '';
  achievements.forEach(achievement => {
    const div = document.createElement('div');
    div.classList.add('achievement-tile');
    if (achievement.completed) div.classList.add('completed');
    div.id = `achievement-${achievement.id}`;
    div.onclick = () => openAchievementModal(achievement.id);

    const img = document.createElement('img');
    img.src = achievement.icon;
    div.appendChild(img);

    const title = document.createElement('div');
    title.classList.add('title');
    title.innerText = achievement.name;
    div.appendChild(title);

    grid.appendChild(div);
  });
}
