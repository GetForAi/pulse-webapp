const serverURL = "http://93.183.82.218:5000"; // 👈 твой backend

document.getElementById("startBtn").addEventListener("click", async () => {
  const telegramId = "demo_user_123"; // пока временный id

  // Зарегистрировать пользователя
  await fetch(`${serverURL}/start_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ telegram_id: telegramId }),
  });

  // Получить прогресс
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

  const container = document.getElementById("progress");
  container.innerHTML = "";

  steps.forEach((step, index) => {
    const isDone = progress.find((s) => s.step_number === index + 1 && s.completed);
    const div = document.createElement("div");
    div.className = "step";
    div.innerText = `${index + 1}. ${step} ${isDone ? "✅" : ""}`;
    container.appendChild(div);
  });
});
