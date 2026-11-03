# 竞学智脑 Jingxue Zhinao

面向大学生创新竞赛的证据增强型 AI 项目工作台。当前版本把 V1 的 React 工程基础与 V2 的功能矩阵、工作流演示和生成逻辑合并为一个可继续开发的前后端骨架。

通过用户画像、项目创意和计划书等 Agent 的分工，将模糊的参赛需求转化为项目方案、项目档案和结构化材料。

## 当前实现状态

- 前端提供品牌首页、工作台、新建项目、方案比较、项目档案、计划书展示、历史任务及设置页面。
- 前端核心生成流程使用本地规则与演示内容，状态保存在浏览器 localStorage；尚未全部接入后端。
- 历史任务页面接入 FastAPI 的任务查询与重试接口，需要启动后端。
- FastAPI 提供主控、画像、创意和计划书 Agent 的接口，以及 SQLite 持久化、任务追踪、Mock/Qwen/DeepSeek 模型适配。
- 计划书正文当前只读，章节编辑保存、文件上传与解析、完整前后端联调仍待完善。
- 默认使用 Mock 模式，模型适配代码的存在不代表真实模型效果已经验证。

本仓库发布的是 React + FastAPI 整合版；`server/` 为保留的旧 Node.js API 骨架。其他历史原型、备份及申报材料未合并到此仓库。

## 当前闭环

```text
用户信息填写
→ 用户画像 Agent
→ 项目创意 Agent
→ 用户选择方案
→ 主控 Agent 创建项目档案
→ 计划书 Agent 生成章节
→ 历史任务与工作流状态保存
```

## 技术结构

```text
jingxue-ai-platform/
├─ src/                    # React + Vite + TypeScript + Tailwind 前端
│  ├─ pages/               # 首页、工作台、创建、方案、项目、计划书、历史
│  ├─ stores/              # Zustand 工作流状态
│  ├─ services/            # 本地工作流引擎
│  └─ types/               # 统一 User/Profile/Idea/Project/Document 类型
├─ server/
│  └─ src/                 # 旧 Node 本地 API 骨架，保留作兼容
├─ backend/                # FastAPI + SQLAlchemy + Agent + LLM 适配层
└─ server/data/db.json     # 运行后自动生成的本地 JSON 数据仓库
```

## 运行

前端建议使用 Node.js 20.19+ 或 22.12+，后端使用 Python 3.10+。

安装依赖：

```bash
npm install
```

可选：将根目录 `.env.example` 复制为 `.env`，配置后端地址。

启动前端：

```bash
npm run dev
```

启动 FastAPI 后端：

```bash
cd backend
pip install -r requirements.txt
copy .env.example .env
python run.py
```

后端健康检查：

```text
GET http://localhost:8000/api/v1/health
Swagger: http://localhost:8000/docs
```

前端开发地址通常为 `http://localhost:5173`，以 Vite 启动输出为准。仅体验前端演示流程时可以不启动后端；历史任务页需要后端服务。

## 模型配置

默认 `APP_MODE=mock` 不调用外部模型。要尝试真实模型，在 `backend/.env` 中填写自己的 API Key、模型名称和对应服务地址，然后设置 `APP_MODE=live`。DeepSeek 直连接口与第三方兼容网关的地址、模型名称可能不同，请以所用服务为准。

密钥只放在后端本地 `.env` 中，环境示例不含真实密钥。本地数据库、运行数据、虚拟环境和依赖目录均不纳入版本控制。

## 开发检查

```bash
npm run build
```

后端安装依赖后，可以在 `backend/` 下运行 `python -m pytest`。相关测试位于 `backend/tests/`。

## FastAPI 后端接口

- `GET /api/v1/health`
- `POST /api/v1/agents/run`
- `POST /api/v1/agents/profile/analyze`
- `POST /api/v1/agents/ideas/generate`
- `POST /api/v1/project-ideas/select`
- `POST /api/v1/projects`
- `GET /api/v1/projects/{projectId}`
- `POST /api/v1/agents/proposal/generate`
- `GET /api/v1/proposals/{documentId}`
- `GET /api/v1/tasks`
- `GET /api/v1/tasks/{taskId}`
- `POST /api/v1/tasks/{taskId}/retry`
- `GET /api/v1/workflows/{workflowId}`
- `POST /api/v1/workflows/continue`

## 下一步

1. 将创建项目、方案比较、项目档案和计划书页面继续接入 FastAPI services。
2. 增加 Alembic 迁移。
3. 配置 Qwen/DeepSeek API Key 后切换 `APP_MODE=live`。
4. 增加真实文件上传、比赛规则解析、计划书章节编辑保存。
