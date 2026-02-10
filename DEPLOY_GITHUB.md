# GitHub Pages 部署指南

因为 GitHub Pages 只能托管静态文件，无法运行我们的 Node.js 后端服务，所以我们采用**纯前端模式 (Client-Side Mode)**。

## 原理说明
*   **传统模式**：前端 -> 后端服务器 (隐藏 API Key) -> Qwen API
*   **GitHub Pages 模式**：前端 -> Qwen API (用户在浏览器输入 API Key)

## 部署步骤

### 1. 准备代码
确保您已经将代码推送到 GitHub 仓库。

### 2. 配置仓库路径
打开 `vite.config.js`，修改 `base` 配置。
假设您的 GitHub 仓库名字是 `qwen-qa-demo`，则修改为：

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/qwen-qa-demo/', // 注意前后都要有斜杠
})
```

### 3. 一键部署
在本地终端运行：
```bash
npm run deploy
```
*这会自动运行 `npm run build` 打包，然后将 `dist` 目录推送到仓库的 `gh-pages` 分支。*

### 4. 开启 GitHub Pages
1.  进入 GitHub 仓库页面 -> **Settings** -> **Pages**。
2.  在 **Build and deployment** 下，Source 选择 **Deploy from a branch**。
3.  Branch 选择 **gh-pages**，文件夹选择 **/(root)**。
4.  点击 Save。
5.  等待几分钟，您会看到部署成功的链接（如 `https://username.github.io/qwen-qa-demo/`）。

## 如何使用
1.  打开部署好的网页。
2.  点击右上角的 **设置 (Settings)** 图标 ⚙️。
3.  输入您的 DashScope API Key。
4.  开始聊天！

*注意：API Key 仅保存在您浏览器的 LocalStorage 中，不会上传到任何服务器，请放心使用。*
