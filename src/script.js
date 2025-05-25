import { initAvatarView } from './views/avatarView.js';
import { initProfileView } from './views/profileView.js';
import { initRewardsView } from './views/rewardsView.js';
import { initSettingsView } from './views/settingsView.js';
import { appState } from './state.js';

function renderContent(html) {
  document.getElementById("content").innerHTML = html;
}

function highlightTab(activeTab) {
  document.querySelectorAll("nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === activeTab);
  });
}

function applyThemeFromStorage() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;

  applyThemeFromStorage();

  if (!user?.id) {
    renderContent("<p style='color:red;'>Ошибка Telegram авторизации</p>");
    return;
  }

  appState.telegramId = String(user.id);
  appState.firstName = user.first_name || "";
  appState.username = user.username || "";

  try {
    const res = await fetch(`https://prizegift.space/get_progress/${appState.telegramId}`);
    if (!res.ok) throw new Error("Ошибка ответа от сервера");

    const steps = await res.json();
    if (!Array.isArray(steps)) throw new Error("Неверный формат данных");

    appState.steps = steps;

    initAvatarView(); // заменили initMainView
    highlightTab('main');

    document.querySelectorAll("nav button").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        highlightTab(tab);

        switch (tab) {
          case 'main':
            initAvatarView();
            break;
          case 'profile':
            initProfileView();
            break;
          case 'rewards':
            initRewardsView();
            break;
          case 'settings':
            initSettingsView();
            break;
          default:
            renderContent("<p>Раздел в разработке</p>");
        }
      });
    });

  } catch (error) {
    console.error("❌ Ошибка загрузки шагов:", error);
    renderContent("<p style='color:red;'>Ошибка загрузки данных. Попробуйте позже</p>");
  }
});
