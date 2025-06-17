import { saveProfileData, getProfileData } from './api.js';

export async function showProfileModal() {
  const userData = await getProfileData();
  const {
    nickname = '',
    birthdate = '',
    weight = 70,
    height = 170,
    gender = 'Мужской'
  } = userData;

  const isLocked = birthdate && gender; // уже введены — блокируем поля

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box wide">
      <h3>Профиль</h3>

      <label>Никнейм</label>
      <input type="text" id="profile-nickname" ${nickname ? "disabled" : ""} value="${nickname}" placeholder="Ваш никнейм">

      <label>Дата рождения</label>
      <input type="date" id="profile-birthdate" ${birthdate ? "disabled" : ""} value="${birthdate}" min="1900-01-01" max="2024-12-31">

      <label>Вес (кг)</label>
      <select id="profile-weight">${generateOptions(30, 150, weight)}</select>

      <label>Рост (см)</label>
      <select id="profile-height" ${height ? "disabled" : ""}>${generateOptions(140, 220, height)}</select>

      <label>Пол</label>
      <select id="profile-gender" ${gender ? "disabled" : ""}>
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
    const data = {
      nickname: document.getElementById("profile-nickname").value.trim(),
      birthdate: document.getElementById("profile-birthdate").value,
      weight: +document.getElementById("profile-weight").value,
      height: +document.getElementById("profile-height").value,
      gender: document.getElementById("profile-gender").value,
    };

    if (!data.weight || data.weight < 30 || data.weight > 150) {
      alert("Введите корректный вес");
      return;
    }

    if (!birthdate && (!data.birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(data.birthdate))) {
      alert("Введите корректную дату рождения");
      return;
    }

    const result = await saveProfileData(data);
    console.log("✅ Сохранено:", result);

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
