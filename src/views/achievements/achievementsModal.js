import { renderAchievements, openAchievementModal } from './achievementsModal.js';

export function renderAchievementsView() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div id="achievements-view">
      <h2>Достижения</h2>
      <div class="achievements-grid"></div>
    </div>
  `;
  renderAchievements(); // отрисуем grid
}

// Для initAchievementsView
export function initAchievementsView() {
  renderAchievementsView();
}

