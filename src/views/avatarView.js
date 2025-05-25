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
    const completedTasks = []; // Временно скрываем завершённые
    if (activeTasks.length === 0) {
      activeTasks.push({
        step_number: 1,
        description: "Протестировать отображение модального окна",
        detail: "Нажмите на это задание, чтобы увидеть описание и награду",
        xp: 15,
        coins: 10,
        completed: false
      });
    }

    const avatarSymbol = level >= 5 ? "🧙‍♂️" : level >= 3 ? "🧑‍💼" : "🙂";

    const renderTasks = (list, done = false) =>
      list.map(task => `
        <div class="task-item ${done ? 'done' : ''}" data-task='${JSON.stringify(task)}'>
          <div class="task-title">${task.step_number}. ${task.description || 'Неизвестное задание'}</div>
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
          <button id="tab-completed" disabled style="opacity:0.4">Завершённые</button>
        </div>

        <div class="task-list" id="task-list">
          ${renderTasks(activeTasks)}
        </div>
      </div>
      <div class="modal-overlay" id="task-modal" style="display:none;">
        <div class="modal-box">
          <h3 id="modal-title">Задание</h3>
          <p id="modal-desc"></p>
          <p id="modal-reward" class="modal-reward"></p>
          <button class="modal-close" id="close-modal">Закрыть</button>
        </div>
      </div>
    `;

    // Модалка: показать по клику
    document.querySelectorAll(".task-item").forEach(item => {
      item.addEventListener("click", () => {
        const task = JSON.parse(item.dataset.task);
        document.getElementById("modal-title").textContent = `Шаг ${task.step_number}`;
        document.getElementById("modal-desc").textContent = task.detail || "Описание недоступно";
        document.getElementById("modal-reward").textContent = `+${task.xp || 10} XP, +${task.coins || 5} монет`;
        document.getElementById("task-modal").style.display = "flex";
      });
    });

    document.getElementById("close-modal").addEventListener("click", () => {
      document.getElementById("task-modal").style.display = "none";
    });

  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки данных</p>`;
    console.error("Ошибка avatarView:", err);
  }
}
