export function initSettingsView() {
  const container = document.getElementById("content");

  container.innerHTML = `
    <h2>⚙️ Настройки</h2>
    <div class="setting-group">
      <label>
        <input type="checkbox" id="toggle-theme" />
        Темная тема
      </label>
    </div>
  `;

  const checkbox = document.getElementById("toggle-theme");
  checkbox.checked = document.body.classList.contains("dark");

  checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark", checkbox.checked);
    localStorage.setItem("theme", checkbox.checked ? "dark" : "light");
  });
}
