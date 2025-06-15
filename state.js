console.log("🧠 initDataUnsafe:", window.Telegram?.WebApp?.initDataUnsafe);
console.log("🧠 user:", window.Telegram?.WebApp?.initDataUnsafe?.user);
console.log("🧠 telegramId:", window.Telegram?.WebApp?.initDataUnsafe?.user?.id);
export const appState = {
  telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || null,
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
