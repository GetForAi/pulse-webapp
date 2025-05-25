const serverURL = "https://prizegift.space";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("progress");
  const greeting = document.getElementById("greeting");
  const xpBox = document.getElementById("xp");
  const progressFill = document.getElementById("progress-fill");
  const stepsDoneText = document.getElementById("steps-done");

  try {
    const telegram = window.Telegram.WebApp;
    const telegramId = telegram.initDataUnsafe?.user?.id;
    const firstName = telegram.initDataUnsafe?.user?.first_name || "";

    if (!telegramId) {
      container.innerHTML = "<p style='color:red;'>Не удалось получить Telegram ID</p>";
      return;
    }

    // Приветствие
    if (greeting) greeting.textContent = `Привет, ${firstName}!`;

    // Регистрируем пользователя
    const regRes = await fetch(`${serverURL}/start_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telegram_id: telegramId }),
    });

    if (!regRes.ok) {
      throw new Error(`Ошибка регистрации пользователя: ${regRes.status}`);
    }

    await loadProgress(telegramId);
  } catch (error) {
    console.error("❌ Ошибка при инициализации:", error);
    container.innerHTML = "<p style='color:red;'>Ошибка подключения к серверу</p>";
  }
});

async function loadProgress(telegramId) {
  const container = document.getElementById("progress");
  const xpBox = document.getElementById("xp");
  const progressFill = document.getElementById("progress-fill");
  const stepsDoneText = document.getElementById("steps-done");

  try {
    const res = await fetch(`${serverURL}/get_progress/${telegramId}`);
    const progress = await res.json();

    if (!Array.isArray(progress)) {
      throw new Error("Получен некорректный ответ от сервера: ожидался массив шагов");
    }

    const steps = [
      "Создай бота",
      "Подключи webhook",
      "Добавь команду",
      "Ответь пользователю",
      "Сохрани данные",
      "Разверни",
      "Пригласи друга",
    ];

    container.innerHTML = "";

    let completedCount = 0;

    steps.forEach((step, index) => {
      const isDone = progress.find(
        (s) => s.step_number === index + 1 && s.completed
      );

      if (isDone) completedCount++;

      const div = document.createElement("div");
      div.className = "step";

      div.innerHTML = `
        ${index + 1}. ${step} ${isDone ? "✅" : ""}
        ${!isDone ? `<button data-step="${index + 1}">Выполнено</button>` : ""}
      `;

      container.appendChild(div);
    });

    // Обновим XP и прогресс
    const xp = progress.length * 10;
    if (xpBox) xpBox.textContent = `${xp} XP`;
    if (stepsDoneText) stepsDoneText.textContent = `${completedCount}`;
    if (progressFill) progressFill.style.width = `${(completedCount / steps.length) * 100}%`;

    // Навесим кнопки
    document.querySelectorAll("button[data-step]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const stepNumber = btn.getAttribute("data-step");
        await fetch(`${serverURL}/update_step`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id: telegramId,
            step_number: Number(stepNumber),
          }),
        });
        loadProgress(telegramId);
      });
    });
  } catch (error) {
    console.error("❌ Ошибка при загрузке шагов:", error);
    container.innerHTML = "<p style='color:red;'>Ошибка загрузки шагов</p>";
  }
}
