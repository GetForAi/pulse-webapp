import { appState } from "../state.js";

export function initRewardsView() {
  const container = document.getElementById("content");

  const rewards = [
    { title: "Начал путь", icon: "🚀", unlocked: true },
    { title: "5 шагов", icon: "🎯", unlocked: appState.steps.filter(s => s.completed).length >= 5 },
    { title: "Пригласил друга", icon: "🤝", unlocked: false }, // в будущем
    { title: "Все шаги", icon: "🏆", unlocked: appState.steps.every(s => s.completed) },
    { title: "Легенда Pulse", icon: "🌟", unlocked: false }, // позже
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
