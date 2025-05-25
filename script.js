document.getElementById("startBtn").addEventListener("click", async () => {
  const steps = ["Создай бота", "Подключи webhook", "Добавь команду", "Ответь пользователю", "Сохрани данные", "Разверни", "Пригласи друга"];
  const container = document.getElementById("progress");
  container.innerHTML = "";
  steps.forEach((step, index) => {
    const div = document.createElement("div");
    div.className = "step";
    div.innerText = `${index + 1}. ${step}`;
    container.appendChild(div);
  });
});

