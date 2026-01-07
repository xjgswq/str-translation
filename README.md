# STR Translation

![Banner](https://github.com/user-attachments/assets/8ae67016-6eaf-458a-adb2-6e31a0763ed6)

<div align="center">

**高效智能的字符串文件翻译工具**

Powered by Google Gemini AI | Built with TypeScript & React

[在线体验](#在线体验) • [功能特性](#功能特性) • [快速开始](#快速开始) • [使用文档](#使用文档)

</div>

---

## 📖 项目介绍

STR Translation 是一个基于 Google Gemini AI 的智能翻译工具，专门为str字幕文件翻译而设计。它能够确保翻译的**信达雅**质量，帮助开发者快速、准确地翻译字幕资源。

### ✨ 核心优势

- 🚀 **AI 驱动**：利用 Google Gemini 提供的先进语言模型
- 🎯 **精准翻译**：确保语义准确、表达地道
- ⚡ **高效处理**：批量翻译，节省时间
- 🌍 **多语言支持**：支持多种语言对之间的翻译
- 💾 **灵活格式**：支持多种字符串文件格式
- 🔐 **隐私保护**：本地处理，仅将必要数据发送至 API

---

## 🎯 功能特性

### 核心功能
- ✅ 智能字符串翻译
- ✅ 批量处理文件
- ✅ 实时预览翻译结果
- ✅ 翻译质量评估
- ✅ 支持上下文感知翻译
- ✅ 翻译历史记录


---

## 🚀 快速开始

### 前置要求

- **Node.js** >= 16.0
- **npm** >= 8.0
- **Google Gemini API Key** ([获取 API Key](https://ai.google.dev/tutorials/setup))

### 环境配置

1. **克隆项目**

```bash
git clone https://github.com/xjgswq/str-translation.git
cd str-translation
```

2. **安装依赖**

```bash
npm install
```

3. **配置 API Key**

在项目根目录创建 `.env.local` 文件，添加你的 Gemini API Key：

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

> ⚠️ **安全提示**：不要将 `.env.local` 提交到版本控制系统。使用 `.gitignore` 保护该文件。

### 本地运行

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

---

## 📋 使用文档

### 基本用法

#### 1. 上传文件

在应用界面中选择要翻译的文件，支持拖拽上传：

```
支持的文件类型：.strings, .xml, .json, .properties, .yml
最大文件大小：10MB
```

#### 2. 配置翻译参数

- **源语言**：文件中使用的语言
- **目标语言**：需要翻译成的语言
- **翻译风格**：正式/非正式/技术性等

#### 3. 执行翻译

点击"开始翻译"按钮，等待处理完成。

#### 4. 预览与导出

翻译完成后，可以在界面中预览结果，然后下载翻译后的文件。

### 高级功能

#### 上下文感知翻译

在翻译前提供上下文信息，帮助 AI 更好地理解字符串含义：

```javascript
{
  "context": "用户登录页面",
  "strings": [
    "Username",
    "Password"
  ]
}
```

#### 翻译质量检查

系统会自动检查翻译质量，报告潜在问题：
- 长度不匹配
- 格式化标记丢失
- 文化敏感性检查

---

## 🏗️ 项目结构

```
str-translation/
├── src/
│   ├── components/         # React 组件
│   ├── services/          # API 和业务逻辑
│   │   ├── geminiService.ts    # Gemini API 集成
│   │   └── translationService.ts
│   ├── types/             # TypeScript 类型定义
│   ├── App.tsx            # 主应用组件
│   └── index.tsx          # 应用入口
├── public/                # 静态资源
├── .env.local            # 环境变量（本地配置）
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 构建配置
```

---

## 🔧 技术栈

| 技术 | 版本 | 说明 |
|-----|------|------|
| React | 18+ | UI 框架 |
| TypeScript | 5+ | 类型安全编程语言 |
| Vite | 4+ | 现代化构建工具 |
| Google Gemini API | Latest | AI 翻译引擎 |

---

## 🌐 在线体验

在 AI Studio 中体验应用：

[https://ai.studio/apps/drive/153V4OL1Ya4pKyl0YSAYSTSshIm3_B4Nj](https://ai.studio/apps/drive/153V4OL1Ya4pKyl0YSAYSTSshIm3_B4Nj)

---

## 📝 构建和部署

### 本地构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

### 生产环境部署

该项目可以部署到任何支持静态文件的平台：

- Vercel
- Netlify
- GitHub Pages
- 自有服务器

**部署步骤**：

```bash
# 1. 构建项目
npm run build

# 2. 将 dist 目录部署到你的服务器
# 3. 确保环境变量已正确配置
```

---

## 🔐 安全性

### API Key 管理

- 不要在代码中硬编码 API Key
- 使用环境变量或密钥管理服务
- 定期轮换 API Key
- 监控 API 使用情况

### 数据隐私

- 本应用不会存储任何翻译历史
- 翻译数据仅发送至 Google Gemini API
- 建议阅读 [Google 隐私政策](https://policies.google.com/privacy)

---

## 🐛 故障排除

### 常见问题

**Q: API Key 无效怎么办？**

A: 确保 API Key 正确配置在 `.env.local` 中，并且 Key 具有 Gemini API 访问权限。

**Q: 翻译速度慢？**

A: 这可能是网络问题或 API 响应缓慢。检查你的网络连接和 API 配额使用情况。

**Q: 不支持的文件格式？**

A: 项目目前支持 .strings, .xml, .json, .properties, .yml 格式。如需其他格式，请提交 Issue。

---

## 📚 学习资源

- [Google Gemini API 文档](https://ai.google.dev/)
- [React 官方文档](https://react.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Vite 文档](https://vitejs.dev/)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 ESLint 配置
- 使用 TypeScript 进行类型检查
- 编写清晰的提交信息
- 添加必要的单元测试

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

- **GitHub Issues**: 提交 Bug 和功能请求
- **Discussion**: 讨论功能设计和改进方案

---

## 🙏 致谢

感谢所有贡献者和使用者的支持！

特别感谢 [Google Gemini](https://ai.google.dev/) 提供的强大 AI 能力。

---

<div align="center">

Made with ❤️ by [xjgswq](https://github.com/xjgswq)

⭐ 如果觉得有帮助，请给项目一个 Star!

</div>
