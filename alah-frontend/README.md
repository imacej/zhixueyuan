# ALAH - AI Learning Assistant Hub

## 🚀 项目简介

ALAH (AI Learning Assistant Hub) 是一个专注解决大语言模型学习认知困境的工具平台。通过可视化工具、实战练习和智能辅导，帮助学习者克服“黑盒”认知困境、幻觉识别难题和技术迭代焦虑。

## 🌟 核心功能

### 1. 🔬 模型行为可视化工具
- **Attention热力图生成器**: 直观展示模型注意力机制
- **Token分析器**: 逐Token分析模型处理过程
- **决策路径追踪**: 追踪模型推理的逐步过程

### 2. ⚠️ 幻觉检测训练器
- **丰富的幻觉案例库**: 事实性、逻辑性、一致性错误案例
- **游戏化练习模式**: 分级闯关设计，提高参与度
- **AI辅助评分**: 智能评估和反馈系统
- **实时事实核查**: 多源信息交叉验证

### 3. 🎯 个性化学习路径
- **多维度技能评估**: 全面评估学习者水平
- **智能学习计划**: 基于AI的个性化推荐
- **进度可视化**: 直观的学习仪表盘
- **成就系统**: 激励机制和奖励体系

### 4. 📊 实时技术追踪
- **论文自动摘要**: AI驱动的研究进展摘要
- **技术趋势分析**: Github、论文、招聘热度分析
- **个性化推荐**: 基于学习路径的内容推荐

## 🛠️ 技术架构

### 前端技术栈
- **框架**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS + HeadlessUI
- **可视化**: D3.js + Chart.js + Plotly.js
- **状态管理**: Zustand
- **认证**: NextAuth.js

### 后端技术栈
- **运行时**: Node.js 18+
- **框架**: Express.js + tRPC
- **数据库**: MongoDB Atlas + Redis
- **文件存储**: Cloudflare R2

### AI 服务集成
- **模型API**: OpenAI GPT-4, Hugging Face, Anthropic Claude
- **自建模型**: 幻觉检测分类器、学习路径推荐系统

### 部署架构
- **前端**: Vercel (Edge Functions)
- **后端**: Railway / DigitalOcean
- **CDN**: Cloudflare
- **监控**: Sentry + Vercel Analytics

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- MongoDB 实例

### 安装依赖
```bash
# 安装项目依赖
npm install

# 或者使用 yarn
yarn install
```

### 环境配置
复制 `.env.example` 为 `.env.local` 并填入配置信息：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：
```env
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/alah
REDIS_URL=redis://localhost:6379

# NextAuth 配置
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI API 配置
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# 文件存储配置
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key
```

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 或者
yarn dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
# 构建应用
npm run build

# 启动生产服务器
npm start
```

## 📝 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   └── providers.tsx       # 全局提供者
├── components/             # 组件目录
│   ├── auth/              # 认证相关组件
│   ├── home/              # 首页组件
│   ├── layout/            # 布局组件
│   ├── tools/             # 工具组件
│   └── ui/                # UI 基础组件
├── lib/                    # 工具库
│   └── utils.ts            # 通用工具函数
└── types/                  # TypeScript 类型定义
    └── index.ts            # 类型导出
```

## 📚 API 文档

### 认证 API
- `POST /api/auth/signup` - 用户注册
- `POST /api/auth/signin` - 用户登录
- `POST /api/auth/signout` - 用户登出

### 模型可视化 API
- `POST /api/visualization/attention` - 生成注意力热力图
- `POST /api/visualization/tokens` - Token 分析
- `GET /api/visualization/history` - 获取历史记录

### 幻觉检测 API
- `GET /api/hallucination/cases` - 获取幻觉案例
- `POST /api/hallucination/attempt` - 提交答题结果
- `GET /api/hallucination/progress` - 获取学习进度

### 学习路径 API
- `GET /api/learning/paths` - 获取学习路径
- `POST /api/learning/assessment` - 技能评估
- `GET /api/learning/recommendations` - 获取个性化推荐

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行集成测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:coverage
```

## 🔧 开发指南

### 代码规范
- 使用 ESLint 和 Prettier 保证代码质量
- 遵循 TypeScript 严格模式
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### Git 工作流
1. 从 `main` 分支创建功能分支
2. 开发并测试功能
3. 提交 Pull Request
4. 代码审查通过后合并

### 提交信息格式
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建或辅助工具变动

## 📦 部署

### Vercel 部署 (推荐)

1. 在 Vercel 中导入项目
2. 配置环境变量
3. 自动部署就绪

### Docker 部署

```bash
# 构建镜像
docker build -t alah-frontend .

# 运行容器
docker run -p 3000:3000 alah-frontend
```

## 🐛 问题反馈

如果您遇到任何问题或有改进建议，请通过以下方式联系我们：

- 提交 [GitHub Issue](https://github.com/alah-ai/frontend/issues)
- 发送邮件至 [support@alah.ai](mailto:support@alah.ai)
- 加入我们的 [Discord 社区](https://discord.gg/alah)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 贡献者

感谢所有为这个项目做出贡献的开发者！

## 🚀 路线图

### v1.0 (MVP)
- [x] 基础模型可视化工具
- [x] 幻觉检测训练器
- [x] 用户认证系统
- [x] 响应式设计

### v1.1
- [ ] 个性化学习路径
- [ ] 技术追踪系统
- [ ] 社区功能
- [ ] 付费系统

### v2.0
- [ ] 高级可视化功能
- [ ] AI 学习助手
- [ ] 移动应用
- [ ] 企业版功能

---

**建设时间**: 2025-08-27  
**版本**: v0.1.0  
**作者**: ALAH Team