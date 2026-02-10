# 部署指南 (Deployment Guide)

本指南将帮助您选择高性价比的云服务器，并将 Qwen Q&A 助手部署到公网。

## 1. 服务器选择推荐 (实惠方案)

对于个人开发者或小型演示项目，推荐使用国内主流云厂商的**轻量应用服务器 (Lightweight Application Server)**。

| 厂商 | 产品名称 | 推荐配置 | 价格参考 (新用户) | 优势 |
| :--- | :--- | :--- | :--- | :--- |
| **阿里云** | 轻量应用服务器 | 2核 2G内存 | ~60-100元/年 | 稳定，线路好，DashScope 访问速度快 |
| **腾讯云** | 轻量应用服务器 (Lighthouse) | 2核 2G内存 | ~60-100元/年 | 性价比高，活动多 |

*注意：如果需要公网访问，您需要购买服务器并完成备案（如果是中国大陆节点）。如果不想备案，可以选择香港节点，但延迟会稍高。*

## 2. 部署步骤

### 准备工作
1. 购买服务器。
2. **关键步骤：选择镜像**
   *   请选择 **“系统镜像” (System Image)**。
   *   推荐版本：**Ubuntu 20.04 / 22.04 LTS** 或 **CentOS 7.9 / Stream 8**。
   *   ❌ **不推荐**选择 "OpenClaw"、"WordPress" 等 **“应用镜像”**，因为它们预装了其他软件，可能会占用端口（如 80/3000），导致我们的项目启动失败。
3. 设置服务器密码，并记下公网 IP 地址。

### 第一步：环境安装
使用 SSH 连接到您的服务器（Windows 可使用 PowerShell 或 Putty，Mac 使用终端）：
```bash
ssh root@your_server_ip
# 输入密码
```

在服务器上安装 Node.js (推荐 v18+):
```bash
# Ubuntu 系统
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### 第二步：上传代码
您可以通过 `git` 拉取代码，或者使用 SCP/FTP 上传代码。
```bash
# 假设您已将代码上传到 GitHub
git clone https://github.com/your-username/qwen-qa-demo.git
cd qwen-qa-demo
```

### 第三步：构建与安装
```bash
# 1. 安装前端依赖并构建
npm install
npm run build

# 此时会生成 dist 目录，里面是打包好的前端文件

# 2. 安装后端依赖
cd server
npm install
```

### 第四步：启动服务
我们已经修改了服务器代码，使其可以同时提供 API 服务和前端页面。

**测试运行：**
```bash
# 在 server 目录下
export DASHSCOPE_API_KEY=您的API密钥
node index.js
```
访问 `http://服务器IP:3001` 即可看到效果。

**后台稳定运行 (使用 PM2)：**
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
export DASHSCOPE_API_KEY=您的API密钥
pm2 start index.js --name "qwen-demo"

# 设置开机自启
pm2 save
pm2 startup
```

### 第五步：开放端口
1. 登录阿里云/腾讯云控制台。
2. 找到服务器的 **防火墙** 或 **安全组** 设置。
3. 添加规则：允许 **TCP** 协议，端口 **3001** (或者您自定义的端口)。

现在，任何人都可以在浏览器中通过 `http://服务器IP:3001` 访问您的 AI 助手了！

## 进阶：使用 Nginx 反向代理 (可选)
如果您想通过 80 端口 (直接输入 IP 不加端口) 访问，可以安装 Nginx。

1. 安装 Nginx: `apt install nginx`
2. 配置代理: `/etc/nginx/sites-available/default`
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```
3. 重启 Nginx: `systemctl restart nginx`
