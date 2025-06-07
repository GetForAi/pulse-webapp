import { initAvatarView } from './views/avatar/avatarView.js';
import { initAchievementsView } from './views/achievements/achievementsView.js';
// import { initTasksView } from './views/tasks/tasksView.js'; // если появится вкладка "Задания"
// import { initSettingsView } from './views/settings/settingsView.js'; // если появится вкладка "Настройки"

// Карта вкладок
const views = {
  main: initAvatarView,
  achievements: initAchievementsView,
  // tasks: initTasksView,
  // settings: initSettingsView,
};

document.addEventListener("DOMContentLoaded", async () => {
  // По умолчанию запускаем первую вкладку
  views.main();

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
        // Можно показать "В разработке"
        document.getElementById('content').innerHTML = `<p>Раздел "${tab}" в разработке</p>`;
      }
    });
  });
});
