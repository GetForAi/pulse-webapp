// achievementsView.js

import { openAchievementModal, renderAchievements } from './modals.js';

export function renderAchievementsView() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div id="achievements-view">
      <h2>Достижения</h2>
      <div class="achievements-grid"></div>
    </div>
  `;

  renderAchievements();
}

export function updateAchievementState(id, completed) {
  const achievement = document.getElementById(`achievement-${id}`);
  if (completed) {
    achievement.classList.add('completed');
  } else {
    achievement.classList.remove('completed');
  }
}

