export const appState = {
  telegramId: "458343275",
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
