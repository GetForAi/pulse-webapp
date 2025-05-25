import { appState } from "../state.js";
import { calculateXP, calculateLevel } from "../utils.js";

export async function initAvatarView() {
  const container = document.getElementById("content");
  container.innerHTML = `<p>Загрузка...</p>`;

  try {
    const res = await fetch(`https://prizegift.space/get_progress/${appState.telegramId}`);
    if (!res.ok) throw new Error("Ошибка ответа сервера");

    const steps = await res.json();
    appState.steps = steps;
    appState.xp = calculateXP(steps);
    const level = calculateLevel(appState.xp);
    const progressPercent = Math.min(100, (appState.xp % 50) * 2);

    const activeTasks = steps.filter(s => !s.completed);
    const completedTasks = steps.filter(s => s.completed);

    const avatarSymbol = level >= 5 ? "🧙‍♂️" : level >= 3 ? "🧑‍💼" : "🙂";

    const renderTasks = (list, done = false) =>
      list.map(task => `
        <div class="task-item ${done ? 'done' : ''}">
          <div class="task-title">${task.step_number}. ${task.description || 'Неизвестное задание'}</div>
          ${task.detail ? `<div class="task-desc">${task.detail}</div>` : ''}
          ${!done ? `<button data-step="${task.step_number}" class="mark-done">Выполнено</button>` : ''}
        </div>
      `).join("");

    container.innerHTML = `
      <div class="avatar-container">
        <div class="avatar-figure">${avatarSymbol}</div>
        <div class="level-xp">
          <div class="level">Уровень ${level}</div>
          <div class="xp">${appState.xp} XP</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
        </div>

        <div class="task-tabs">
          <button id="tab-active" class="active">Активные</button>
          <button id="tab-completed">Завершённые</button>
        </div>

        <div class="task-list" id="task-list">
          ${renderTasks(activeTasks)}
        </div>
      </div>
    `;

    // Обработчики кнопок "Выполнено"
    document.querySelectorAll(".mark-done").forEach(btn => {
      btn.addEventListener("click", async () => {
        const stepNumber = Number(btn.dataset.step);
        await fetch("https://prizegift.space/update_step", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegram_id: appState.telegramId, step_number: stepNumber })
        });
        initAvatarView();
      });
    });

    // Переключение табов
    const activeTab = document.getElementById("tab-active");
    const completedTab = document.getElementById("tab-completed");
    const taskList = document.getElementById("task-list");

    activeTab.addEventListener("click", () => {
      activeTab.classList.add("active");
      completedTab.classList.remove("active");
      taskList.innerHTML = renderTasks(activeTasks);
    });

    completedTab.addEventListener("click", () => {
      completedTab.classList.add("active");
      activeTab.classList.remove("active");
      taskList.innerHTML = renderTasks(completedTasks, true);
    });

  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки данных</p>`;
    console.error("Ошибка avatarView:", err);
  }
}
