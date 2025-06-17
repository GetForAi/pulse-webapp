// api.js
import { appState } from './state.js';

const CALORIE_API_KEY = "FTXBnDmHh/LpW91u4NhrDQ==vQDwxRYRUOdzC3EL";

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

// Получение калорийности по произвольному тексту
export async function analyzeCalories(inputText) {
  const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(inputText)}`, {
    method: "GET",
    headers: {
      'X-Api-Key': CALORIE_API_KEY
    }
  });
  if (!response.ok) throw new Error(`Ошибка запроса к CalorieNinjas: ${response.status}`);
  return await response.json(); // вернёт { items: [{name, calories, ...}, ...] }
}
