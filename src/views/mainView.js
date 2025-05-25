import { appState } from "../state.js";
import { calculateXP, calculateLevel } from "../utils.js";

export async function initMainView() {
  const container = document.getElementById("content");
  container.innerHTML = "<p>Загрузка шагов...</p>";

  try {
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
    let renderedSteps = "";

    steps.forEach((step, index) => {
      const isDone = progress.find(p => p.step_number === index + 1 && p.completed);
      if (isDone) completedCount++;

      renderedSteps += `
        <div class="step">
          ${index + 1}. ${step} ${isDone ? "✅" : ""}
          ${!isDone ? `<button data-step="${index + 1}">Выполнено</button>` : ""}
        </div>`;
    });

    // Сохраняем шаги и XP в глобальное состояние
    appState.steps = progress;
    appState.xp = calculateXP(progress);

    const level = calculateLevel(appState.xp);

    container.innerHTML = `
      <h2>Привет, ${appState.firstName}!</h2>
      <p>🎓 Уровень: ${level} &nbsp; | &nbsp; 🧠 Опыт: ${appState.xp} XP</p>
      <div class="steps">${renderedSteps}</div>
      <p>📊 ${completedCount}/${steps.length} шагов выполнено</p>
    `;

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

        // Перезагрузка view
        initMainView();
      });
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red;">❌ Ошибка загрузки шагов</p>`;
    console.error("Ошибка загрузки /get_progress:", err);
  }
}
