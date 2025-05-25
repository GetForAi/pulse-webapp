export function calculateXP(steps) {
  return steps.length * 10;
}

export function calculateLevel(xp) {
  return Math.floor(xp / 50);
}

export function navigate(path) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function getThemeParams() {
  return window.Telegram?.WebApp?.themeParams || {};
}
