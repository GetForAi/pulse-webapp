import { initAvatarView } from './views/avatar/avatarView.js';
import { initAchievementsView } from './views/achievements/achievementsView.js';

const views = {
  main: initAvatarView,
  achievements: initAchievementsView,
  // ...
};

document.addEventListener("DOMContentLoaded", async () => {
  // ...
  views.main();
  document.querySelectorAll(".bottom-nav button").forEach(btn => {
    btn.addEventListener("click", async () => {
      const tab = btn.dataset.tab;
      if (views[tab]) views[tab]();
    });
  });
});
