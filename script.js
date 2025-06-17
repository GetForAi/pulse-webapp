import { appState } from './state.js';
import { initAvatarView } from './avatarView.js';
import { initAchievementsView } from './achievementsView.js';
import { initTasksView } from './tasksView.js';
// import { initSettingsView } from './settingsView.js';

// Карта вкладок
const views = {
  main: initAvatarView,
  achievements: initAchievementsView,
  tasks: initTasksView,
  // settings: initSettingsView,
};

document.addEventListener("DOMContentLoaded", async () => {
  // ====== ВАЖНО: инициализация Telegram ID ======
  if (
    window.Telegram &&
    window.Telegram.WebApp &&
    window.Telegram.WebApp.initDataUnsafe &&
    window.Telegram.WebApp.initDataUnsafe.user
  ) {
    appState.telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;
    appState.firstName = window.Telegram.WebApp.initDataUnsafe.user.first_name || "";
    appState.username = window.Telegram.WebApp.initDataUnsafe.user.username || "";
    // Можно логировать для дебага:
    console.log("[Pulse] Telegram ID:", appState.telegramId);
  } else {
    appState.telegramId = null;
    console.warn("[Pulse] Не удалось определить Telegram ID. Проверьте запуск внутри Telegram WebApp.");
  }

  // По умолчанию запускаем первую вкладку (main)
  if (views.main) await views.main();

  // Переключатель вкладок
  document.querySelectorAll(".bottom-nav button").forEach(btn => {
    btn.addEventListener("click", async () => {
      // Снимаем .active со всех
      document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      if (views[tab]) {
        await views[tab]();
      } else {
        document.getElementById('content').innerHTML = `<p>Раздел "${tab}" в разработке</p>`;
      }
    });
  });
});
