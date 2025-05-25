const serverURL = "https://prizegift.space";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("progress");

  try {
    // Получаем telegram_id из Telegram WebApp
    const telegram = window.Telegram.WebApp;
    const telegramId = telegram.initDataUnsafe?.user?.id;

    if (!telegramId) {
      container.innerHTML = "<p style='color:red;'>Не удалось получить Telegram ID</p>";
      return;
    }

    // Регистрируем пользователя
    await fetch(`${serverURL}/start_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telegram_id: telegramId }),
    });

    await loadProgress(telegramId);
  } catch (error) {
    console.error("Ошибка при инициализации:", error);
    container.innerHTML = "<p style='color:red;'>Ошибка подключения к серверу</p>";
  }
});

async function loadProgress(telegramId) {
  const container = document.getElementById("progress");

  try {
    const res = await fetch(`${serverURL}/get_progress/${telegramId}`);
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

    container.innerHTML = "";

    steps.forEach((step, index) => {
      const isDone = progress.find(
        (s) => s.step_number === index + 1 && s.completed
      );

      const div = document.createElement("div");
      div.className = "step";
      div.style.marginBottom = "10px";
      div.style.background = "#eee";
      div.style.padding = "10px";
      div.style.borderRadius = "8px";

      div.innerHTML = `
        ${index + 1}. ${step} ${isDone ? "✅" : ""}
        ${!isDone ? `<button data-step="${index + 1}">Выполнено</button>` : ""}
      `;

      container.appendChild(div);
    });

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
        loadProgress(telegramId); // обновим список
      });
    });
  } catch (error) {
    console.error("Ошибка при загрузке шагов:", error);
    container.innerHTML = "<p style='color:red;'>Ошибка загрузки шагов</p>";
  }
}
