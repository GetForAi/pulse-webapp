import { initAvatarView } from './views/avatarView.js';
import { appState } from './state.js';
import { showModal } from './views/modals.js';

function renderContent(html) {
  document.getElementById("content").innerHTML = html;
}

function highlightTab(activeTab) {
  document.querySelectorAll("nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === activeTab);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;

  if (!user?.id) {
    renderContent("<p style='color:red;'>Ошибка Telegram авторизации</p>");
    return;
  }

  // Сохраняем пользователя
  appState.telegramId = String(user.id);
  appState.firstName = user.first_name || "";
  appState.username = user.username || "";

  try {
    await initAvatarView(); // Главная вкладка
    highlightTab('main');

    // Навигация по вкладкам
    document.querySelectorAll("nav button").forEach(btn => {
      btn.addEventListener("click", async () => {
        const tab = btn.dataset.tab;
        highlightTab(tab);

        switch (tab) {
          case 'main':
            await initAvatarView();
            break;
          default:
            showModal({
              title: "⏳ В разработке",
              message: `Раздел "${tab}" скоро появится`,
              icon: "🛠"
            });
        }
      });
    });

  } catch (error) {
    console.error("❌ Ошибка загрузки:", error);
    renderContent("<p style='color:red;'>Ошибка загрузки данных. Попробуйте позже</p>");
  }
});
