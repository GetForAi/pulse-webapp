const serverURL = "https://prizegift.space"; // теперь через HTTPS

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("startBtn");
  const container = document.getElementById("progress");

  if (button) {
    button.addEventListener("click", async () => {
      const telegramId = "demo_user_123";

      try {
        // регистрация пользователя
        await fetch(`${serverURL}/start_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ telegram_id: telegramId }),
        });

        // получение прогресса
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
          div.innerText = `${index + 1}. ${step} ${isDone ? "✅" : ""}`;
          container.appendChild(div);
        });
      } catch (error) {
        console.error("Ошибка при подключении к серверу:", error);
        container.innerHTML = "<p style='color:red;'>Ошибка подключения к серверу</p>";
      }
    });
  }
});
