import { appState } from "../state.js";

export function initRewardsView() {
  const container = document.getElementById("content");

  // Прототип наград (можно потом загружать с backend)
  const rewards = [
    { title: "Начал путь", icon: "🚀", unlocked: true },
    { title: "5 шагов", icon: "🎯", unlocked: false },
    { title: "Пригласил друга", icon: "🤝", unlocked: false },
    { title: "Все шаги", icon: "🏆", unlocked: false },
    { title: "Легенда Pulse", icon: "🌟", unlocked: false },
  ];

  const cards = rewards
    .map(reward => `
      <div class="reward-card ${reward.unlocked ? 'unlocked' : 'locked'}">
        <div class="reward-icon">${reward.icon}</div>
        <div class="reward-title">${reward.title}</div>
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

