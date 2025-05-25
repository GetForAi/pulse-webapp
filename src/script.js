import { initMainView } from './views/mainView.js';
import { initProfileView } from './views/profileView.js';
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

  // Сохраняем данные в глобальное состояние
  appState.telegramId = String(user.id);
  appState.firstName = user.first_name || "";
  appState.username = user.username || "";

  // Подключаем стартовую вкладку
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
        default:
          renderContent("<p>Раздел в разработке</p>");
      }
    });
  });
});

// Подсвечивает активную вкладку
function highlightTab(activeTab) {
  document.querySelectorAll("nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === activeTab);
  });
}
