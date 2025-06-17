import { showProfileModal } from './settingsModal.js';

export async function initSettingsView() {
  const container = document.getElementById('content');
  container.innerHTML = `
    <div class="settings-container">
      <h2>👤 Профиль</h2>
      <button class="profile-btn" id="editProfileBtn">Редактировать профиль</button>
    </div>
  `;

  document.getElementById('editProfileBtn').addEventListener('click', () => {
    showProfileModal(); // пока без userData
  });
}
