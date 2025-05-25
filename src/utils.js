// Считает XP только за выполненные шаги (по 10 XP за каждый)
export function calculateXP(steps) {
  return steps.filter(step => step.completed).length * 10;
}

// Уровень повышается каждые 100 XP (можно менять)
export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

// Прогресс внутри текущего уровня (0–100)
export function calculateXPProgress(xp) {
  return xp % 100;
}

// Не используется пока, но может быть полезно позже
export function navigate(path) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Получение темы Telegram WebApp
export function getThemeParams() {
  return window.Telegram?.WebApp?.themeParams || {};
}
