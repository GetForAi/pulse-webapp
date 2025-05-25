:root {
  --bg: #f5f7fa;
  --text: #1a1a1a;
  --accent: #4b9eff;
  --accent-dark: #3a8ee6;
  --tabbar-active: #e6f0ff;
  --xp: #ff70a6;
  --level: #00b894;
}

body.dark {
  --bg: #121212;
  --text: #ffffff;
  --accent: #6ca0ff;
  --accent-dark: #3c78e6;
  --tabbar-active: #1f1f1f;
  --xp: #f27ea9;
  --level: #00e49c;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--bg);
  color: var(--text);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
}

#app {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

#content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

h1, h2 {
  margin: 0 0 16px;
  font-weight: 800;
  color: var(--text);
}

p {
  font-size: 0.95rem;
  margin: 8px 0;
}

.level-section {
  margin: 16px 0;
}

.level-section p {
  margin: 6px 0;
}

.progress-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 6px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-dark));
  width: 0%;
  transition: width 0.4s ease-in-out;
  border-radius: 5px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-figure {
  font-size: 6rem;
  margin: 12px 0;
  animation: pop 0.3s ease;
  filter: drop-shadow(0 3px 4px rgba(0,0,0,0.15));
  transition: transform 0.3s ease;
}

.stats-panel {
  text-align: center;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 1rem;
}

.task-tabs {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  gap: 12px;
}

.task-tabs button {
  background: none;
  border: 1px solid var(--accent);
  color: var(--text);
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s;
}

.task-tabs button.active {
  background: var(--accent);
  color: #fff;
}

.task-list {
  margin-top: 16px;
  width: 100%;
}

.task-item {
  padding: 12px;
  background-color: #f0f4fa;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-item button {
  background: var(--accent);
  border: none;
  color: #fff;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s ease;
}

.task-item button:hover {
  background: var(--accent-dark);
}

body.dark .task-item {
  background-color: #1e1e1e;
}

.task-item.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.tabbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  background: var(--bg);
  border-top: 1px solid #ddd;
}

.tabbar button {
  flex: 1;
  background: none;
  border: none;
  font-size: 1.4rem;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: var(--text);
}

.tabbar button:hover {
  color: var(--accent);
}

.tabbar button.active {
  background-color: var(--tabbar-active);
  font-weight: 600;
  border-top: 2px solid var(--accent);
  color: var(--accent);
}

@keyframes pop {
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { transform: translateY(10px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
