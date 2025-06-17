import { appState } from "./state.js";
import { showTaskModal } from "./tasksModal.js";

export async function initTasksView() {
  const container = document.getElementById("content");
  if (!container) return;

  container.innerHTML = `<p>Загрузка заданий...</p>`;

  try {
    const res = await fetch(`https://prizegift.space/api/get_progress/${appState.telegramId}`);
    const data = await res.json();
    appState.steps = Array.isArray(data.steps) ? data.steps : [];

    const activeDaily = appState.steps.filter(t => !t.completed && t.type === "calories");
    const activeOneTime = appState.steps.filter(t => !t.completed && t.type === "subscribe");
    const completed = appState.steps.filter(t => t.completed);

    const renderTasks = (list, done = false) =>
      list.map(task => `
        <div class="task-item ${done ? 'done' : ''}" data-task='${JSON.stringify(task)}'>
          <div class="task-title">${task.title || 'Задание'}</div>
        </div>
      `).join("");

    container.innerHTML = `
      <div class="avatar-container">
        <div class="task-tabs">
          <button id="tab-active" class="active">Активные</button>
          <button id="tab-completed">Завершённые</button>
        </div>
        <div class="task-list" id="task-list">
          <h3>📅 Ежедневные</h3>
          ${renderTasks(activeDaily)}
          <h3>📌 Одноразовые</h3>
          ${renderTasks(activeOneTime)}
        </div>
      </div>
    `;

    const bindTaskClicks = () => {
      document.querySelectorAll(".task-item").forEach(item => {
        const task = JSON.parse(item.dataset.task);
        item.addEventListener("click", () => showTaskModal(task, initTasksView));
      });
    };

    document.getElementById("tab-active").addEventListener("click", () => {
      document.getElementById("tab-active").classList.add("active");
      document.getElementById("tab-completed").classList.remove("active");
      document.getElementById("task-list").innerHTML = `
        <h3>📅 Ежедневные</h3>
        ${renderTasks(activeDaily)}
        <h3>📌 Одноразовые</h3>
        ${renderTasks(activeOneTime)}
      `;
      bindTaskClicks();
    });

    document.getElementById("tab-completed").addEventListener("click", () => {
      document.getElementById("tab-completed").classList.add("active");
      document.getElementById("tab-active").classList.remove("active");
      document.getElementById("task-list").innerHTML = renderTasks(completed, true);
      bindTaskClicks();
    });

    bindTaskClicks();

  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки заданий</p>`;
    console.error("Ошибка tasksView:", err);
  }
}
