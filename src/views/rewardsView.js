import { appState } from "../state.js";
import { showModal } from "../modals.js";

export function initRewardsView() {
  const container = document.getElementById("content");

  // Определим количество выполненных шагов
  const completedSteps = appState.steps.filter(s => s.completed).length;

  // Прототип наград + логика открытия
  const rewards = [
    { title: "Начал путь", icon: "🚀", description: "Ты сделал первый шаг!", unlocked: completedSteps >= 1 },
    { title: "5 шагов", icon: "🎯", description: "Ты на полпути!", unlocked: completedSteps >= 5 },
    { title: "Пригласил друга", icon: "🤝", description: "Пригласи друга и получи бонус.", unlocked: false },
    { title: "Все шаги", icon: "🏆", description: "Ты прошёл весь путь!", unlocked: completedSteps >= 7 },
    { title: "Легенда Pulse", icon: "🌟", description: "Для тех, кто достиг всего.", unlocked: completedSteps >= 7 },
  ];

  const cards = rewards
    .map((reward, index) => `
      <div class="reward-card ${reward.unlocked ? 'unlocked' : 'locked'}" data-index="${index}">
        <div class="reward-icon">${reward.icon}</div>
        <div class="reward-title">${reward.title}</div>
        <div class="reward-desc">${reward.description}</div>
      </div>
    `)
    .join("");

  container.innerHTML = `
    <h2>🎁 Награды</h2>
    <div class="reward-grid">
      ${cards}
    </div>
  `;

  // Навешиваем модалки при клике на карточку
  document.querySelectorAll(".reward-card.unlocked").forEach(card => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.index);
      const reward = rewards[index];
      showModal({
        title: reward.title,
        message: reward.description,
        icon: reward.icon
      });
    });
  });
}
