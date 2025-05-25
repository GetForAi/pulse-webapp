import { initMainView } from './views/mainView.js';
import { initProfileView } from './views/profileView.js';
import { initRewardsView } from './views/rewardsView.js';
import { appState } from './state.js';

function renderContent(html) {
  document.getElementById("content").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;

  if (!user?.id) {
    renderContent("<p style='color:red;'>Ошибка Telegram авторизации</p>");
    return;
  }

  appState.telegramId = String(user.id);
  appState.firstName = user.first_name || "";
  appState.username = user.username || "";

  // Загружаем шаги
  try {
    const res = await fetch(`https://prizegift.space/get_progress/${appState.telegramId}`);
    if (!res.ok) throw new Error("Ошибка ответа сервера");

    const steps = await res.json();
    if (!Array.isArray(steps)) throw new Error("Неверный формат данных");

    appState.steps = steps;
  } catch (error) {
    console.error("Ошибка загрузки шагов:", error);
    renderContent("<p style='color:red;'>Ошибка загрузки данных. Попробуйте позже</p>");
    return;
  }

  // Рендерим начальную вкладку
  initMainView();
  highlightTab('main');

  // Обработка вкладок
  document.querySelectorAll("nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      highlightTab(tab);

      switch (tab) {
        case 'main':
          initMainView();
          break;
        case 'profile':
          initProfileView();
          break;
        case 'rewards':
          initRewardsView();
          break;
        default:
          renderContent("<p>Раздел в разработке</p>");
      }
    });
  });
});

function highlightTab(activeTab) {
  document.querySelectorAll("nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === activeTab);
  });
}
