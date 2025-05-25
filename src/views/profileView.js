import { appState } from "../state.js";
import { calculateLevel } from "../utils.js";

export function initProfileView() {
  const container = document.getElementById("content");

  const level = calculateLevel(appState.xp);

  container.innerHTML = `
    <h2>👤 Профиль</h2>

    <div class="profile-card">
      <div class="profile-avatar">
        <div class="avatar-circle">${appState.firstName.charAt(0).toUpperCase()}</div>
      </div>
      <div class="profile-info">
        <p><strong>${appState.firstName}</strong></p>
        <p>@${appState.username || "без ника"}</p>
        <p>ID: ${appState.telegramId}</p>
      </div>
    </div>

    <div class="profile-stats">
      <p>🌟 Уровень: <strong>${level}</strong></p>
      <p>🧠 Опыт: <strong>${appState.xp} XP</strong></p>
    </div>
  `;
}
