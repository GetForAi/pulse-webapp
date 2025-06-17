import { showProfileModal } from './settingsModal.js';

export async function initSettingsView() {
  const container = document.getElementById('content');
  container.innerHTML = `
    <div class="settings-container">
      <h2 class="settings-title">
        <span class="settings-icon">👤</span> Профиль
      </h2>
      <button class="btn-filled" id="editProfileBtn">Заполнить профиль</button>
    </div>
  `;

  document.getElementById('editProfileBtn').addEventListener('click', () => {
    showProfileModal();
  });
}
