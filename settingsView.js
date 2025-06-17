import { showProfileModal } from './settingsModal.js';
import { getProfileData } from './api.js';

export async function initSettingsView() {
  const container = document.getElementById('content');
  container.innerHTML = `
    <div class="settings-container">
      <h2>👤 Профиль</h2>
      <button class="profile-btn" id="editProfileBtn">Заполнить профиль</button>
    </div>
  `;

  const userData = await getProfileData(); // получаем сохранённые данные
  document.getElementById('editProfileBtn').addEventListener('click', () => {
    showProfileModal(userData);
  });
}
