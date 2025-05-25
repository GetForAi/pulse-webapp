import { appState } from "../state.js";

export function initRewardsView() {
  const container = document.getElementById("content");

  // Прототип наград (в будущем будет заменено на данные с backend)
  const rewards = [
    { title: "Начал путь", icon: "🚀", unlocked: true, description: "Ты сделал первый шаг!" },
    { title: "5 шагов", icon: "🎯", unlocked: false, description: "Ты на полпути!" },
    { title: "Пригласил друга", icon: "🤝", unlocked: false, description: "Делись с друзьями и получай бонусы." },
    { title: "Все шаги", icon: "🏆", unlocked: false, description: "Ты завершил весь путь!" },
    { title: "Легенда Pulse", icon: "🌟", unlocked: false, description: "Только для настоящих мастеров." },
  ];

  const cards = rewards
    .map(reward => `
      <div class="reward-card ${reward.unlocked ? 'unlocked' : 'locked'}">
        <div class="reward-icon">${reward.icon}</div>
        <div class="reward-content">
          <div class="reward-title">${reward.title}</div>
          <div class="reward-desc">${reward.description}</div>
        </div>
      </div>
    `)
    .join("");

  container.innerHTML = `
    <h2>🎁 Награды</h2>
    <div class="reward-grid">
      ${cards}
    </div>
  `;
}
