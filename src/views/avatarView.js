// src/views/avatarView.js
import { appState } from "../state.js";
import {
  calculateXPProgress,
  calculateXPMaxForLevel
} from "../utils.js";
import { showTaskModal } from "./modals.js";
import { loadAvatarModel } from "../3d/viewer.js"; // ❌ не добавляй `?v=3` — Vercel сам кеширует правильно

export async function initAvatarView() {
  const container = document.getElementById("content");
  if (!container) {
    console.error("❌ Не найден контейнер #content");
    return;
  }

  container.innerHTML = `<p>Загрузка...</p>`;

  try {
    const res = await fetch(`https://prizegift.space/get_progress/${appState.telegramId}`);
    if (!res.ok) throw new Error("Ошибка ответа сервера");

    const data = await res.json();

    appState.steps = data.steps || [];
    appState.xp = data.xp || 0;
    appState.level = data.level || 1;

    const xpInLevel = calculateXPProgress(appState.xp, appState.level);
    const xpMax = calculateXPMaxForLevel(appState.level);
    const progressPercent = Math.floor((xpInLevel / xpMax) * 100);

    const activeTasks = appState.steps.filter(s => !s.completed);
    const completedTasks = appState.steps.filter(s => s.completed);

    const renderTasks = (list, done = false) =>
      list.map(task => `
        <div class="task-item ${done ? 'done' : ''}" data-task='${JSON.stringify(task)}'>
          <div class="task-title">${task.title || 'Задание'}</div>
        </div>
      `).join("");

    container.innerHTML = `
      <div class="avatar-container">
        <div class="level-xp">
          <div class="level">Уровень ${appState.level}</div>
          <div class="xp">${xpInLevel} / ${xpMax} XP</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
        </div>

        <div id="avatar-3d" style="width: 100%; height: 220px; margin: 15px 0;"></div>

        <div class="task-tabs">
          <button id="tab-active" class="active">Активные</button>
          <button id="tab-completed">Завершённые</button>
        </div>

        <div class="task-list" id="task-list">
          ${renderTasks(activeTasks)}
        </div>
      </div>
    `;

    // ✅ Загружаем 3D-модель
    await loadAvatarModel("avatar-3d", appState.level);

    // 🎯 Вешаем обработчики
    const renderAndBind = (taskArray) => {
      document.getElementById("task-list").innerHTML = renderTasks(taskArray);
      document.querySelectorAll(".task-item").forEach(item => {
        const task = JSON.parse(item.dataset.task);
        item.addEventListener("click", () => showTaskModal(task, reloadView));
      });
    };

    function reloadView() {
      initAvatarView(); // Перезагружаем после выполнения
    }

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

    renderAndBind(activeTasks); // первичная отрисовка

  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки данных</p>`;
    console.error("Ошибка avatarView:", err);
  }
}
