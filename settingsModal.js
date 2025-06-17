import { saveProfileData } from './api.js';

export function showProfileModal(userData = {}) {
  const {
    nickname = '',
    birthdate = '',
    age = 25,
    weight = 70,
    height = 170,
    gender = 'Мужской'
  } = userData;

  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box wide">
      <h3>Профиль</h3>

      <label>Никнейм</label>
      <input type="text" id="profile-nickname" placeholder="Ваш никнейм" value="${nickname}">

      <label>Дата рождения</label>
      <input type="date" id="profile-birthdate" value="${birthdate}">

      <label>Возраст</label>
      <select id="profile-age">${generateOptions(10, 100, age)}</select>

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

  modal.querySelector(".modal-save-profile").onclick = async () => {
    const nickname = document.getElementById("profile-nickname").value.trim();
    const birthdate = document.getElementById("profile-birthdate").value;
    const age = +document.getElementById("profile-age").value;
    const weight = +document.getElementById("profile-weight").value;
    const height = +document.getElementById("profile-height").value;
    const gender = document.getElementById("profile-gender").value;

    const profileData = { nickname, birthdate, age, weight, height, gender };
    console.log("✅ Сохраняем данные профиля:", profileData);

    await saveProfileData(profileData);

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

}
