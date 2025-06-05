// Импортируем функцию для открытия модалки из modals.js
import { openAchievementModal, renderAchievements } from './modals.js';

// Функция для рендеринга вкладки с достижениями
export function renderAchievementsView() {
  const content = document.getElementById('content');
  
  // Обновляем содержимое главного контейнера с вкладкой достижений
  content.innerHTML = `
    <div id="achievements-view">
      <h2>Достижения</h2>
      <!-- Сетка для отображения достижений -->
      <div class="achievements-grid"></div>
    </div>
  `;

  // Рендерим достижения с помощью функции renderAchievements
  renderAchievements();
}

// Функция для обновления состояния достижения (выполнено или нет)
export function updateAchievementState(id, completed) {
  const achievement = document.getElementById(`achievement-${id}`);
  
  // Добавляем или удаляем класс 'completed', в зависимости от выполнения достижения
  if (completed) {
    achievement.classList.add('completed');  // Добавляем стиль для выполненного достижения
  } else {
    achievement.classList.remove('completed');  // Убираем стиль для невыполненного достижения
  }
}
