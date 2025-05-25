const serverURL = "https://prizegift.space";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("startBtn");
  const container = document.getElementById("progress");

  const telegramId = "demo_user_123"; // пока временно

  async function loadProgress() {
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

    // навесим обработчики на кнопки "Выполнено"
    document.querySelectorAll("button[data-step]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const stepNumber = btn.getAttribute("data-step");
        await fetch(`${serverURL}/update_step`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ telegram_id: telegramId, step_number: Number(stepNumber) }),
        });
        loadProgress(); // перерисовать
      });
    });
  }

  if (button) {
    button.addEventListener("click", async () => {
      try {
        await fetch(`${serverURL}/start_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ telegram_id: telegramId }),
        });

        await loadProgress();
      } catch (error) {
        console.error("Ошибка при подключении к серверу:", error);
        container.innerHTML = "<p style='color:red;'>Ошибка подключения к серверу</p>";
      }
    });
  }
});
