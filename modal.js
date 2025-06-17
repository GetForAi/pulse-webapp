// проверка
export function showModal({ title, message, icon = "" }) {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box">
      ${icon ? `<div class="modal-icon">${icon}</div>` : ""}
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="modal-close">Ок</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById("app").classList.add("blurred");

  modal.querySelector(".modal-close").onclick = () => {
    modal.remove();
    document.getElementById("app").classList.remove("blurred");
  };
}
