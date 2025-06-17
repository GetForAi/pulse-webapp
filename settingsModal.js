// settingsModal.js
export function showProfileModal(userData = {}) {
  const { age = 25, weight = 70, height = 170, gender = "Мужской" } = userData;

  // Удаляем старую модалку, если она осталась
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box wide">
      <h3>Профиль</h3>

      <label>Возраст</label>
      <select id="profile-age">${generateOptions(18, 100, age)}</select>

      <label>Вес (кг)</label>
      <select id="profile-weight">${generateOptions(30, 150, weight)}</select>

      <label>Рост (см)</label>
      <select id="profile-height">${generateOptions(140, 220, height)}</select>

      <label>Пол</label>
      <select id="profile-gender">
        <option ${gender === "Мужской" ? "selected" : ""}>Мужской</option>
        <option ${gender === "Женский" ? "selected" : ""}>Женский</option>
        <option ${gender === "Другое" ? "selected" : ""}>Другое</option>
      </select>

      <button class="modal-save-profile">Сохранить</button>
      <button class="modal-close">Закрыть</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById("app").classList.add("blurred");

  modal.querySelector(".modal-close").onclick = () => {
    modal.remove();
    document.getElementById("app").classList.remove("blurred");
  };

  modal.querySelector(".modal-save-profile").onclick = () => {
    const profileData = {
      age: +document.getElementById("profile-age").value,
      weight: +document.getElementById("profile-weight").value,
      height: +document.getElementById("profile-height").value,
      gender: document.getElementById("profile-gender").value,
    };
    console.log("✅ Данные профиля:", profileData);
    // 👉 в будущем: отправка в backend

    modal.remove();
    document.getElementById("app").classList.remove("blurred");
  };
}

function generateOptions(from, to, selected) {
  return Array.from({ length: to - from + 1 }, (_, i) => {
    const val = from + i;
    return `<option value="${val}" ${val === selected ? "selected" : ""}>${val}</option>`;
  }).join("");
}
