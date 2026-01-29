<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# StandUp.ai — 脫口秀智能體

Vite + React + TypeScript，搭配 Google Gemini 生成段子與 TTS。

---

## 1. 環境與依賴

**需求：** Node.js 18+

```bash
npm install
```

專案使用 `package.json` 腳本：

| 腳本 | 說明 |
|------|------|
| `npm run dev` | 開發伺服器（預設 `http://localhost:3000`） |
| `npm run build` | 生產環境建置，輸出到 `dist/` |
| `npm run preview` | 本地預覽 `dist/` |

---

## 2. 本地運行

1. 在專案根目錄建立 `.env.local`，設定 Gemini API Key（可複製 `.env.example` 再填入）：

   ```
   GEMINI_API_KEY=your_key_here
   ```

2. 啟動：

   ```bash
   npm run dev
   ```

3. 開啟 http://localhost:3000。生成段子與 TTS 會使用上述 API Key（僅在瀏覽器端使用，不發送到專案後端）。

---

## 3. 部署上線（GitHub Actions → GitHub Pages）

- 工作流程：`.github/workflows/deploy.yml`
- 觸發：推送到 `main` 或手動執行 `workflow_dispatch`。
- 步驟：`npm ci` → `npm run build` → 上傳 `dist/` → 部署到 GitHub Pages。

**首次使用前請先設定 GitHub Pages：**

1. Repo **Settings** → **Pages**
2. **Build and deployment** → **Source** 選 **Deploy from a branch**
3. **Branch** 選 `gh-pages` / `/(root)`，Save
4. 推送 `main` 或手動跑完 workflow 後，Actions 會把 `dist` 推到 `gh-pages`，站點網址為：

   ```
   https://<username>.github.io/<repo-name>/
   ```

建置時會設定 `base` 為 `/<repo-name>/`，因此若 repo 名稱與專案目錄不同，請在 `deploy.yml` 裡依實際 repo 名稱調整。

**注意：** 目前 CI 未注入 `GEMINI_API_KEY`，部署後的 Pages 僅為靜態預覽，**生成段子 / TTS 需在本地以 `.env.local` 配置 Key 後運行**。若堅持在線上使用生成功能，可在 repo **Settings → Secrets** 新增 `GEMINI_API_KEY`，並在 `deploy.yml` 的 **Build** step 加上 `env: GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}`（Key 會被打進前端 bundle，僅建議用於原型）。

---

## 4. `.gitignore` 說明

已忽略的內容包括：

- **依賴與建置：** `node_modules/`、`dist/`、`dist-ssr/`
- **環境與私密：** `.env`、`.env.*`（不含 `.env.example`），`*.local`
- **日誌與快取：** `*.log`、`.cache`、`.vite`、`.turbo`、`*.tsbuildinfo`、`coverage/` 等
- **編輯器／IDE：** `.vscode/*`（保留 `extensions.json`、`settings.json`）、`.idea`、`*.sublime-*`
- **系統：** `.DS_Store`、`Thumbs.db` 等

請勿將 `.env.local` 或任何含 API Key 的檔案提交到版控。

---

## 5. 相關操作記錄

| 項目 | 變更 |
|------|------|
| **package.json** | 專案名稱改為 `stand-up-ai`，版本 `1.0.0`；保留 `dev` / `build` / `preview` 腳本 |
| **index.html** | 移除 import map，改由 Vite 打包；新增 `<script type="module" src="/index.tsx">` 作為 entry |
| **vite.config** | 新增 `base: process.env.GH_PAGES_BASE \|\| '/'`，供 GitHub Pages 建置時設定 subpath |
| **GitHub Actions** | 新增 `deploy.yml`（Build + Deploy to GitHub Pages）；移除舊的 `webpack.yml` |
| **.gitignore** | 補上 env、cache、coverage、編輯器、系統檔等規則 |

---

AI Studio 專案：  
https://ai.studio/apps/drive/195YVs6E7ArRmzxbSgqqbl4za0JZ-GaL_
