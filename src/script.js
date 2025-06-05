import { initAvatarView } from './views/avatarView.js';
import { initAchievementsView } from './views/achievementsView.js'; // Добавляем импорт функции
import { appState } from './state.js';
import { showModal } from './views/modals.js';

/**
 * Функция для рендеринга содержимого вкладки
 * @param {string} html - HTML код для рендеринга
 */
function renderContent(html) {
  document.getElementById("content").innerHTML = html;
}

/**
 * Функция для выделения активной вкладки в навигации
 * @param {string} activeTab - имя активной вкладки
 */
function highlightTab(activeTab) {
  document.querySelectorAll("nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === activeTab);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;

  // Проверка авторизации пользователя в Telegram
  if (!user?.id) {
    renderContent("<p style='color:red;'>Ошибка Telegram авторизации</p>");
    return;
  }

  // Сохранение данных пользователя в appState
  appState.telegramId = String(user.id);
  appState.firstName = user.first_name || "";
  appState.username = user.username || "";

  try {
    // Отправляем запрос на сервер для инициализации пользователя
    const response = await fetch("https://prizegift.space/start_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegram_id: appState.telegramId })
    });

    // Проверка на успешный ответ от сервера
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    await initAvatarView();
    highlightTab('main');  // Инициализация вкладки "Аватар"

    // Обработчики для переключения между вкладками
    document.querySelectorAll("nav button").forEach(btn => {
      btn.addEventListener("click", async () => {
        const tab = btn.dataset.tab;
        highlightTab(tab);

        // Логика для переключения вкладок
        switch (tab) {
          case 'main':
            await initAvatarView();
            break;
          case 'achievements':
            await initAchievementsView();
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
    renderContent(`<p style='color:red;'>Ошибка загрузки данных. ${error.message}</p>`);
  }
});
