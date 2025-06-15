// Конфигурация шкалы XP — можно менять по своему усмотрению
export function getXPThreshold(level) {
  // Например: 100 XP для 1-го уровня, 150 для 2-го, 200 для 3-го и т.д.
  return 100 + (level - 1) * 50;
}

// Подсчитывает общий XP за выполненные шаги
export function calculateXP(steps) {
  return steps
    .filter(step => step.completed)
    .reduce((total, step) => total + (step.xp || 0), 0);
}

// Рассчитывает уровень на основе накопленного XP
export function calculateLevel(xp) {
  let level = 1;
  let xpLeft = xp;

  while (xpLeft >= getXPThreshold(level)) {
    xpLeft -= getXPThreshold(level);
    level++;
  }

  return level;
}

// Вычисляет текущий XP в пределах уровня (например: 30 из 150)
export function calculateXPProgress(xp) {
  let level = calculateLevel(xp);
  let totalXPForPrevLevels = 0;

  for (let i = 1; i < level; i++) {
    totalXPForPrevLevels += getXPThreshold(i);
  }

  return xp - totalXPForPrevLevels;
}

// Возвращает максимальный XP для текущего уровня
export function calculateXPMaxForLevel(xp) {
  const level = calculateLevel(xp);
  return getXPThreshold(level);
}

// Не используется пока, но может пригодиться для роутинга
export function navigate(path) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Получение текущей темы Telegram WebApp
export function getThemeParams() {
  return window.Telegram?.WebApp?.themeParams || {};
}

