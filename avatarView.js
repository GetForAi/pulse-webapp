import { appState } from "./state.js";
import { calculateXPProgress, calculateXPMaxForLevel } from "./helpers.js";
import { showTaskModal } from "./tasksModal.js";

export async function initAvatarView() {
  const container = document.getElementById("content");
  if (!container) {
    console.error("❌ Не найден контейнер #content");
    return;
  }

  container.innerHTML = `<p>Загрузка...</p>`;

  // Дебаг: проверить, есть ли telegramId
  console.log("Текущий Telegram ID:", appState.telegramId);

  // Если ID не определён — не грузим данные с сервера
  if (!appState.telegramId) {
    container.innerHTML = `<p style='color:red;'>Ошибка: Telegram ID не определён. Запустите из Telegram WebApp!</p>`;
    return;
  }

  // Проверяем корректность формируемого URL
  const fetchUrl = `https://prizegift.space/get_progress/${appState.telegramId}`;
  console.log("URL запроса к серверу:", fetchUrl);

  try {
    const res = await fetch(fetchUrl);

    // Проверяем ответ сервера
    if (!res.ok) {
      console.error(`Ошибка ответа сервера (${res.status}): ${res.statusText}`);
      container.innerHTML = `<p style='color:red;'>Ошибка ответа сервера (${res.status})</p>`;
      return;
    }

    // Парсим JSON — ловим ошибку парсинга!
    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      container.innerHTML = `<p style='color:red;'>Ошибка обработки ответа сервера (JSON)</p>`;
      console.error("Ошибка парсинга JSON:", jsonErr);
      return;
    }

    // Логируем, что получили
    console.log("Данные получены от сервера:", data);

    appState.steps = Array.isArray(data.steps) ? data.steps : [];
    appState.xp = Number.isFinite(data.xp) ? data.xp : 0;
    appState.level = Number.isFinite(data.level) ? data.level : 1;

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
        <div class="task-tabs">
          <button id="tab-active" class="active">Активные</button>
          <button id="tab-completed">Завершённые</button>
        </div>
        <div class="task-list" id="task-list">
          ${renderTasks(activeTasks)}
        </div>
      </div>
    `;

    // Функция для перерендера списка задач
    const renderAndBind = (taskArray) => {
      document.getElementById("task-list").innerHTML = renderTasks(taskArray);
      document.querySelectorAll(".task-item").forEach(item => {
        const task = JSON.parse(item.dataset.task);
        item.addEventListener("click", () => showTaskModal(task, reloadView));
      });
    };

    function reloadView() {
      initAvatarView();
    }

    // Навигация между вкладками "Активные" и "Завершённые"
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

    // Сразу отображаем активные задачи
    renderAndBind(activeTasks);

  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки данных</p>`;
    console.error("Ошибка avatarView:", err);
  }
}
