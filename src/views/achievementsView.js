// Импортируем функции для открытия модалки и рендеринга достижений из modals.js
import { openAchievementModal, renderAchievements } from './modals.js';

// Функция для рендеринга вкладки с достижениями
export function renderAchievementsView() {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div id="achievements-view">
      <h2>Достижения</h2>
      <div class="achievements-grid"></div>
    </div>
  `;

  // Рендерим достижения с помощью функции renderAchievements
  renderAchievements();
}

// Функция для обновления состояния достижения (выполнено или нет)
export function updateAchievementState(id, completed) {
  const achievement = document.getElementById(`achievement-${id}`);
  if (completed) {
    achievement.classList.add('completed');
  } else {
    achievement.classList.remove('completed');
  }
}
