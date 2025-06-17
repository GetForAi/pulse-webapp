import { createModal } from './modals.js';

export function renderSettingsView(container) {
  container.innerHTML = `
    <div class="settings-container">
      <h2>👤 Профиль</h2>
      <button class="profile-btn" id="editProfileBtn">Редактировать профиль</button>
    </div>
  `;

  document.getElementById('editProfileBtn').addEventListener('click', () => {
    showProfileModal();
  });
}

function showProfileModal() {
  createModal(`
    <h3>Редактировать профиль</h3>
    <div class="form-group">
      <label>Возраст</label>
      <select class="scroll-select">${Array.from({length: 83}, (_, i) => `<option>${i + 18}</option>`).join('')}</select>
    </div>
    <div class="form-group">
      <label>Вес (кг)</label>
      <select class="scroll-select">${Array.from({length: 121}, (_, i) => `<option>${i + 30}</option>`).join('')}</select>
    </div>
    <div class="form-group">
      <label>Рост (см)</label>
      <select class="scroll-select">${Array.from({length: 101}, (_, i) => `<option>${i + 140}</option>`).join('')}</select>
    </div>
    <div class="form-group">
      <label>Пол</label>
      <select class="scroll-select">
        <option>Мужской</option>
        <option>Женский</option>
        <option>Другое</option>
      </select>
    </div>
    <button class="save-profile-btn">Сохранить</button>
  `);

  document.querySelector('.save-profile-btn').addEventListener('click', () => {
    // заглушка для будущего сохранения
    alert('Данные профиля будут сохранены позже');
  });
}

