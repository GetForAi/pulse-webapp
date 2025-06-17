// api.js
import { appState } from './state.js';

// Проверка подписки пользователя на Telegram-канал
export async function checkSubscription(channelUsername) {
  try {
    const res = await fetch("https://prizegift.space/api/check_subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_id: appState.telegramId,
        channel: channelUsername
      }),
    });

    if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
    return await res.json(); // { subscribed: true/false }

  } catch (err) {
    console.error("Ошибка при проверке подписки:", err);
    throw err;
  }
}

// Обновление шага (задания) после выполнения
export async function updateStep(step_number) {
  try {
    const res = await fetch("https://prizegift.space/api/update_step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_id: appState.telegramId,
        step_number
      }),
    });

    if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
    return await res.json(); // { xp, coins, level }

  } catch (err) {
    console.error("Ошибка при обновлении шага:", err);
    throw err;
  }
}

// Получение калорийности через backend (обходит CORS)
export async function analyzeCalories(inputText) {
  try {
    const res = await fetch("https://prizegift.space/api/analyze_calories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: inputText }),
    });

    if (!res.ok) throw new Error(`Ошибка запроса к backend: ${res.status}`);
    return await res.json(); // { items: [...] }

  } catch (err) {
    console.error("Ошибка при анализе калорий:", err);
    throw err;
  }
}
