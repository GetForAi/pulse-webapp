import { appState } from "../state.js";
import { calculateXP, calculateLevel, calculateXPProgress } from "../utils.js";

export function initAvatarView() {
  const container = document.getElementById("content");

  const level = calculateLevel(appState.xp);
  const xpCurrent = calculateXPProgress(appState.xp);
  const xpProgressPercent = Math.min((xpCurrent / 100) * 100, 100);

  const tasks = [
    { id: 1, title: "Пройти 5000 шагов", completed: false },
    { id: 2, title: "Подписаться на канал", completed: true },
    { id: 3, title: "Написать 3 цели на день", completed: false },
  ];

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  container.innerHTML = `
    <div class="avatar-container">
      <div class="avatar-figure level-${level}">🧍‍♂️</div>
      <div class="stats-panel">
        <p>🎓 Уровень: <span class="stat-num">${level}</span></p>
        <p>🧠 XP: <span class="stat-num">${appState.xp}</span></p>
        <p>💰 Монеты: <span class="stat-num">${appState.coins || 0}</span></p>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${xpProgressPercent}%"></div>
        </div>
      </div>

      <div class="task-tabs">
        <button class="tab-btn active" data-tab="active">Активные</button>
        <button class="tab-btn" data-tab="completed">Завершённые</button>
      </div>

      <div class="task-list" id="taskList">
        ${renderTasks(activeTasks)}
      </div>
    </div>
  `;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      const list = tab === "active" ? activeTasks : completedTasks;
      document.getElementById("taskList").innerHTML = renderTasks(list);
    });
  });
}

function renderTasks(tasks) {
  if (tasks.length === 0) return "<p>Заданий пока нет 🎉</p>";
  return tasks.map(t => `
    <div class="task-item ${t.completed ? 'done' : ''}">
      ${t.completed ? "✅" : "🔘"} ${t.title}
    </div>
  `).join("");
}
