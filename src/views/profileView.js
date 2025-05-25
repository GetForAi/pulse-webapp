import { appState } from "../state.js";

export function initProfileView() {
  const container = document.getElementById("content");
  container.innerHTML = `
    <h2>👤 Профиль</h2>
    <p>Имя: ${appState.firstName}</p>
    <p>Username: @${appState.username}</p>
    <p>Telegram ID: ${appState.telegramId}</p>
    <p>🌟 Уровень: скоро появится</p>
  `;
}

