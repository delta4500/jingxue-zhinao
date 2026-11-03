# 竞学智脑 FastAPI 后端

## 运行

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

Swagger:

```text
http://localhost:8000/docs
```

健康检查：

```text
GET http://localhost:8000/api/v1/health
```

## 模式

`APP_MODE=mock`：不访问外部模型，读取 `app/mock_data`，仍会生成 taskId、traceId 并写入数据库。

`APP_MODE=live`：通过统一 LLM Provider 调用 Qwen 或 DeepSeek。API Key 只放在后端 `.env`，前端禁止保存密钥。

## 关键目录

- `app/agents`：主控、画像、创意、计划书 Agent
- `app/prompts`：每个 Agent 的系统提示词
- `app/llm`：Mock/Qwen/DeepSeek 模型适配层
- `app/schemas`：统一请求、返回和业务对象 Schema
- `app/api/v1`：FastAPI 路由
- `app/models`：SQLAlchemy 数据表
- `tests`：pytest 测试

## 测试

```bash
pytest
```
