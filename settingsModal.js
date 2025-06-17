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

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box wide">
      <h3>Профиль</h3>

      <label>Никнейм</label>
      <input type="text" id="profile-nickname" value="${nickname}" ${nickname ? "disabled" : ""} placeholder="Ваш никнейм" />

      <label>Дата рождения</label>
      <input type="date" id="profile-birthdate" value="${birthdate}" min="1940-01-01" max="2020-12-31" ${birthdate ? "disabled" : ""} />

      <label>Вес (кг)</label>
      <select id="profile-weight">${generateOptions(30, 150, weight)}</select>

      <label>Рост (см)</label>
      <select id="profile-height">${generateOptions(140, 220, height)}</select>

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
    const nickname = document.getElementById("profile-nickname").value.trim();
    const birthdate = document.getElementById("profile-birthdate").value;
    const weight = +document.getElementById("profile-weight").value;
    const height = +document.getElementById("profile-height").value;
    const gender = document.getElementById("profile-gender").value;

    // Проверка даты
    if (birthdate) {
      if (!birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        alert("Дата рождения должна быть в формате ГГГГ-ММ-ДД");
        return;
      }
      const year = parseInt(birthdate.slice(0, 4));
      if (year < 1940 || year > 2020) {
        alert("Допустимый диапазон годов: 1940–2020");
        return;
      }
    }

    await saveProfileData({ nickname, birthdate, weight, height, gender });

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
