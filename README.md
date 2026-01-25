# 代码即叙事：像读英文小说一样读懂HTML

## 📚 项目简介

这是一个交互式HTML教学网站，专为想要从语言分析角度理解HTML的学习者设计。项目结合了统计学思维、英语语言学和Vibe Coding理念，让非技术背景的读者也能轻松读懂HTML代码。

## ✨ 主要特性

- 📖 **5大教学模块**：从导论到实践的完整学习路径
- 💬 **AI学习助手**：实时解答HTML学习问题
- 🎨 **交互式代码查看器**：多视角展示HTML结构
- 🌐 **响应式设计**：支持手机、平板、电脑访问
- 🎯 **语言分析视角**：用英语和统计学比喻解释代码概念

## 🚀 快速部署到Netlify

### 方法一：通过Netlify网站部署（推荐）

1. **准备Git仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HTML教学网站"
   ```

2. **推送到GitHub**
   ```bash
   # 在GitHub上创建新仓库，然后：
   git remote add origin https://github.com/你的用户名/html-narrative-tutorial.git
   git branch -M main
   git push -u origin main
   ```

3. **在Netlify部署**
   - 访问 [Netlify](https://app.netlify.com/)
   - 点击 "Add new site" → "Import an existing project"
   - 选择 GitHub 并授权
   - 选择你的仓库
   - 构建设置会自动从 `netlify.toml` 读取
   - 点击 "Deploy site"

### 方法二：通过Netlify CLI部署

1. **安装Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录Netlify**
   ```bash
   netlify login
   ```

3. **初始化和部署**
   ```bash
   netlify init
   netlify deploy --prod
   ```

### 方法三：拖放部署

1. 将整个项目文件夹打包成ZIP
2. 访问 [Netlify Drop](https://app.netlify.com/drop)
3. 拖放ZIP文件即可

## 📁 项目结构

```
html-narrative-tutorial/
├── index.html              # 主页面（包含所有教学内容）
├── netlify.toml           # Netlify配置文件
├── package.json           # 项目配置
├── netlify/
│   └── functions/
│       └── chat.js        # AI助手后端函数
└── README.md              # 本文件
```

## 🎯 教学大纲

### 第一部分：导论——代码的"语感"
- 什么是 index.html？
- 英语与代码的同构性
- 识读优于编写的学习心态

### 第二部分：宏观解剖——HTML的"句法结构"
- 嵌套的逻辑
- `<head>` 与 `<body>` 的区别
- 语义化标签的力量

### 第三部分：微观拆解——标签的"词性"
- 容器标签（名词）
- 内容标签（文本与媒体）
- 链接与交互（动词）
- 属性（形容词）

### 第四部分：Vibe Coding实践
- 常见代码模式识别
- 类名命名的秘密
- 注释的艺术

### 第五部分：数据驱动的直觉
- 列表的统计意义
- 结构冗余与效率
- AI工具辅助学习

## 🛠️ 技术栈

- **前端**：纯HTML + CSS + Vanilla JavaScript
- **后端**：Netlify Functions (Serverless)
- **部署**：Netlify
- **特色**：无需构建步骤，开箱即用

## 💡 核心教学理念

### 三个"跨界"锦囊

1. **统计学比喻**
   - `<div>` 的出现频率像英语的"the"
   - 低频高信息量的标签才是关键

2. **英语关联**
   - href = Hypertext Reference
   - src = Source
   - alt = Alternative

3. **对比实验**
   - HTML是"结构"而非"装饰"
   - 支持切换CSS查看裸奔效果

## 🤖 AI助手功能

网站右下角的AI助手可以回答：
- HTML标签含义
- 属性用途
- 学习方法建议
- 概念解释

示例问题：
- "什么是div标签？"
- "class和id的区别？"
- "如何学习HTML？"

## 📝 本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/html-narrative-tutorial.git

# 进入目录
cd html-narrative-tutorial

# 安装依赖
npm install

# 本地运行（使用Netlify Dev）
npm run dev

# 访问 http://localhost:8888
```

## 🌍 环境变量配置

### DeepSeek API密钥（必需）

AI助手功能需要配置DeepSeek API密钥。

#### 在Netlify中配置：

1. 进入你的Netlify项目后台
2. 点击 "Site settings" → "Environment variables"
3. 点击 "Add a variable"
4. 添加以下变量：
   - **Key**: `DEEPSEEK_API_KEY`
   - **Value**: 你的DeepSeek API密钥
5. 保存后重新部署网站

#### 获取DeepSeek API密钥：

1. 访问 [DeepSeek开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 在控制台创建API密钥
4. 复制密钥并添加到Netlify环境变量

#### 本地开发配置：

创建 `.env` 文件（已在.gitignore中）：
```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**注意**：如果未配置API密钥，AI助手会自动降级到本地知识库模式。

## 📄 许可证

MIT License - 自由使用和修改

## 👨‍🏫 作者

**龚凤乾教授** - 兼通英语和统计学的教师，拥有Vibe coding和SDD经验，致力于用跨学科视角教授编程。

## 🙏 致谢

- 感谢所有学习者的反馈
- 本教程本身就是一个HTML示例

## 📞 反馈与建议

如有问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- 使用网站内的AI助手

---

**记住**：读代码就像读英文小说，重点是理解叙事逻辑，而不是记住每个单词的拼写！📖✨
