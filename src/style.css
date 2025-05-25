import { appState } from "../state.js";
import { calculateXP, calculateLevel } from "../utils.js";

export async function initAvatarView() {
  const container = document.getElementById("content");
  container.innerHTML = `<p>Загрузка...</p>`;

  try {
    const res = await fetch(`https://prizegift.space/get_progress/${appState.telegramId}`);
    const steps = await res.json();

    appState.steps = steps;
    appState.xp = calculateXP(steps);
    const level = calculateLevel(appState.xp);
    const completed = steps.filter(s => s.completed).length;

    const progressPercent = Math.min(100, (appState.xp % 50) * 2);
    const avatarSymbol = level >= 5 ? "🧙‍♂️" : level >= 3 ? "🧑‍💼" : "🙂";

    const activeTasks = steps.filter(s => !s.completed);
    const completedTasks = steps.filter(s => s.completed);

    const renderTasks = (list, done = false) =>
      list.map(task => `
        <div class="task-item ${done ? 'done' : ''}">
          ${task.step_number}. ${task.description}
          ${!done ? `<button data-step="${task.step_number}">Выполнено</button>` : ""}
        </div>`
      ).join("");

    container.innerHTML = `
      <div class="avatar-container">
        <div class="avatar-figure">${avatarSymbol}</div>
        <div class="stats-panel">
          <div><strong>Уровень:</strong> ${level}</div>
          <div><strong>Опыт:</strong> ${appState.xp} XP</div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
          </div>
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

    document.querySelectorAll("button[data-step]").forEach(btn => {
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

    document.getElementById("tab-active").addEventListener("click", () => {
      document.getElementById("tab-active").classList.add("active");
      document.getElementById("tab-completed").classList.remove("active");
      document.getElementById("task-list").innerHTML = renderTasks(activeTasks);
    });

    document.getElementById("tab-completed").addEventListener("click", () => {
      document.getElementById("tab-completed").classList.add("active");
      document.getElementById("tab-active").classList.remove("active");
      document.getElementById("task-list").innerHTML = renderTasks(completedTasks, true);
    });

  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки данных</p>`;
    console.error("Ошибка avatarView:", err);
  }
}
