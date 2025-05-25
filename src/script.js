import { initMainView } from './views/mainView.js';
import { initProfileView } from './views/profileView.js';
import { initRewardsView } from './views/rewardsView.js'; // ✅ добавлено
import { appState } from './state.js';

function renderContent(html) {
  document.getElementById("content").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;

  if (!user?.id) {
    renderContent("<p>Ошибка Telegram авторизации</p>");
    return;
  }

  // Сохраняем данные пользователя
  appState.telegramId = String(user.id);
  appState.firstName = user.first_name || "";
  appState.username = user.username || "";

  // Загружаем прогресс с сервера и сохраняем шаги в глобальное состояние
  try {
    const res = await fetch(`https://prizegift.space/get_progress/${appState.telegramId}`);
    const steps = await res.json();
    appState.steps = steps;
  } catch (error) {
    console.error("Ошибка загрузки прогресса:", error);
    appState.steps = [];
  }

  // Стартовая вкладка
  initMainView();
  highlightTab('main');

  // Обработчики вкладок
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
          initRewardsView(); // ✅ вызываем награды
          break;
        default:
          renderContent("<p>Раздел в разработке</p>");
      }
    });
  });
});

// Подсветка активной вкладки
function highlightTab(activeTab) {
  document.querySelectorAll("nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === activeTab);
  });
}
