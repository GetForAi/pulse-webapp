import { appState } from './state.js';

// 🔄 Получение данных профиля
export async function getProfileData() {
  try {
    const res = await fetch("https://prizegift.space/api/get_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegram_id: appState.telegramId }),
    });

    if (!res.ok) {
      console.error("❌ Ошибка загрузки профиля:", res.status);
      return {};
    }

    return await res.json();
  } catch (err) {
    console.error("❌ Ошибка сети при загрузке профиля:", err);
    return {};
  }
}

// 💾 Сохранение данных профиля (дата рождения, пол, рост, вес)
export async function saveProfileData(profileData) {
  try {
    const res = await fetch("https://prizegift.space/api/save_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_id: appState.telegramId,
        ...profileData
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Ошибка сохранения:", res.status, errorText);
      return false;
    }

    return await res.json();
  } catch (err) {
    console.error("❌ Сетевая ошибка при сохранении профиля:", err);
    return false;
  }
}

// ✅ Проверка подписки
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

// 📌 Обновление задания
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

// 🔍 Анализ калорий
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

  return await res.json();
}
