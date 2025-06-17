import { appState } from "./state.js";
import { calculateXPProgress, calculateXPMaxForLevel } from "./helpers.js";

export async function initAvatarView() {
  const container = document.getElementById("content");
  if (!container) return;

  container.innerHTML = `<p>Загрузка...</p>`;

  if (!appState.telegramId) {
    container.innerHTML = `<p style='color:red;'>Ошибка: Telegram ID не определён</p>`;
    return;
  }

  try {
    await fetch("https://prizegift.space/api/start_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegram_id: appState.telegramId }),
    });
  } catch (e) {
    container.innerHTML = `<p style='color:red;'>Ошибка регистрации пользователя</p>`;
    return;
  }

  try {
    const res = await fetch(`https://prizegift.space/api/get_progress/${appState.telegramId}`);
    const data = await res.json();

    appState.steps = Array.isArray(data.steps) ? data.steps : [];
    appState.xp = Number.isFinite(data.xp) ? data.xp : 0;
    appState.level = Number.isFinite(data.level) ? data.level : 1;

    const xpInLevel = calculateXPProgress(appState.xp, appState.level);
    const xpMax = calculateXPMaxForLevel(appState.level);
    const progressPercent = Math.floor((xpInLevel / xpMax) * 100);

    container.innerHTML = `
      <div class="avatar-container">
        <div class="level-xp">
          <div class="level">Уровень ${appState.level}</div>
          <div class="xp">${xpInLevel} / ${xpMax} XP</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${progressPercent}%"></div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p style='color:red;'>Ошибка загрузки данных</p>`;
  }
}
