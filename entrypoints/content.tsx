import ReactDOM from 'react-dom/client';
import App from './content/App';
import './content/style.css';

export default defineContentScript({
  matches: [
    import.meta.env.VITE_CONFLUENCE_URL_PATTERN || 'https://your-confluence.com/*'
  ],

  main() {
    // ページが完全に読み込まれるまで待つ
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertKintonePanel);
    } else {
      insertKintonePanel();
    }
  },
});

function insertKintonePanel() {
  // コンテナを作成
  const container = document.createElement('div');
  container.id = 'kintone-extension-root';

  // bodyの先頭に挿入
  const body = document.body;
  if (body.firstChild) {
    body.insertBefore(container, body.firstChild);
  } else {
    body.appendChild(container);
  }

  // Reactアプリをマウント
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}