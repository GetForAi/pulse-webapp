export const appState = {
  telegramId: (
    window.Telegram
    && window.Telegram.WebApp
    && window.Telegram.WebApp.initDataUnsafe
    && window.Telegram.WebApp.initDataUnsafe.user
    && window.Telegram.WebApp.initDataUnsafe.user.id
  ) || null,
  firstName: (
    window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || ""
  ),
  username: (
    window.Telegram?.WebApp?.initDataUnsafe?.user?.username || ""
  ),
  xp: 0,
  currentTab: "main",
  steps: [],
  rewards: [],
  avatarUrl: "" // В будущем можно получить из Telegram WebApp или вручную
};
