import { appState } from "../state.js";
import { calculateXP, calculateLevel } from "../utils.js";
import { showTaskModal } from "./modals.js";

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
        <div class="task-item ${done ? 'done' : ''}" data-task='${JSON.stringify(task)}'>
          <div class="task-title">${task.step_number}. ${task.title || 'Без названия'}</div>
          ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
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

    const renderAndBind = (taskArray) => {
      document.getElementById("task-list").innerHTML = renderTasks(taskArray);
      document.querySelectorAll(".task-item").forEach(item => {
        const task = JSON.parse(item.dataset.task);
        item.addEventListener("click", () => showTaskModal(task));
      });
    };

    document.getElementById("tab-active").addEventListener("click", () => {
      document.getElementById("tab-active").classList.add("active");
      document.getElementById("tab-completed").classList.remove("active");
      renderAndBind(activeTasks);
    });

    document.getElementById("tab-completed").addEventListener("click", () => {
      document.getElementById("tab-completed").classList.add("active");
      document.getElementById("tab-active").classList.remove("active");
      renderAndBind(completedTasks);
    });

    renderAndBind(activeTasks); // Первичная отрисовка

  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки данных</p>`;
    console.error("Ошибка avatarView:", err);
  }
}
