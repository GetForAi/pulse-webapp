import { appState } from "../state.js";

export async function initMainView() {
  const container = document.getElementById("content");
  container.innerHTML = "<p>Загрузка шагов...</p>";

  const res = await fetch(`https://prizegift.space/get_progress/${appState.telegramId}`);
  const progress = await res.json();

  const steps = [
    "Создай бота",
    "Подключи webhook",
    "Добавь команду",
    "Ответь пользователю",
    "Сохрани данные",
    "Разверни",
    "Пригласи друга",
  ];

  let completedCount = 0;
  let content = `<h2>Привет, ${appState.firstName}!</h2><div class='steps'>`;

  steps.forEach((step, index) => {
    const isDone = progress.find(p => p.step_number === index + 1 && p.completed);
    if (isDone) completedCount++;
    content += `
      <div class="step">
        ${index + 1}. ${step} ${isDone ? "✅" : ""}
        ${!isDone ? `<button data-step="${index + 1}">Выполнено</button>` : ""}
      </div>`;
  });

  content += `</div><p>📊 ${completedCount}/${steps.length} шагов выполнено</p>`;
  container.innerHTML = content;

  document.querySelectorAll("button[data-step]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const stepNumber = btn.getAttribute("data-step");
      await fetch(`https://prizegift.space/update_step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_id: appState.telegramId,
          step_number: Number(stepNumber),
        }),
      });
      initMainView(); // Обновим
    });
  });
}

