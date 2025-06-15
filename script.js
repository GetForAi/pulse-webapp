import { initAvatarView } from './avatarView.js';
import { initAchievementsView } from './achievementsView.js';
// import { initTasksView } from './tasksView.js';
// import { initSettingsView } from './settingsView.js';

// Карта вкладок
const views = {
  main: initAvatarView,
  achievements: initAchievementsView,
  // tasks: initTasksView,
  // settings: initSettingsView,
};

document.addEventListener("DOMContentLoaded", async () => {
  // По умолчанию запускаем первую вкладку
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
