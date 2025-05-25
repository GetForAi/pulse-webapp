import { initMainView } from './views/mainView.js'
import { initProfileView } from './views/profileView.js'
import { appState } from './state.js'

document.addEventListener("DOMContentLoaded", async () => {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;

  if (!user?.id) {
    document.getElementById("content").innerHTML = "<p>Ошибка Telegram авторизации</p>";
    return;
  }

  // Сохраняем данные
  appState.telegramId = String(user.id);
  appState.firstName = user.first_name || "";
  appState.username = user.username || "";

  // Подключаем начальную вкладку
  initMainView();

  // Обработчики вкладок
  document.querySelectorAll("nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switch (tab) {
        case 'main':
          initMainView();
          break;
        case 'profile':
          initProfileView();
          break;
        default:
          document.getElementById("content").innerHTML = "<p>Раздел в разработке</p>";
      }
    });
  });
});
