import { appState } from './state.js';

// Проверка подписки пользователя на канал
export async function checkSubscription(channelUsername) {
  const res = await fetch("https://prizegift.space/api/check_subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegram_id: appState.telegramId,
      channel: channelUsername
    }),
  });
  if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
  return await res.json();
}

// Обновление шага (задания)
export async function updateStep(step_number) {
  const res = await fetch("https://prizegift.space/api/update_step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegram_id: appState.telegramId,
      step_number
    }),
  });
  if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
  return await res.json();
}

// Анализ калорийности через backend (обходит CORS)
export async function analyzeCalories(inputText) {
  const res = await fetch("https://prizegift.space/api/analyze_calories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: inputText })
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Calorie analyze error:", text);
    throw new Error(`Ошибка запроса к backend: ${res.status}`);
  }
  return await res.json(); // ожидаем { items: [...] }
}
