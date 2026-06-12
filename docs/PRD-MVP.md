# MVP PRD：多职业简历 / 求职信生成器

> 版本：v0.1 · 日期：2026-06-10  
> 技术栈：Next.js · React · Tailwind CSS · shadcn/ui · Supabase · DeepSeek

---

## 1. 产品概述

### 1.1 一句话定位

面向美国蓝领 / 刚需岗位的 **职业专属** 简历与求职信生成 SaaS——同一套 AI 引擎，多个 SEO 落地页，吃长尾词流量，靠 AdSense + 订阅变现。

### 1.2 核心策略（正确做法）

| 维度 | 做法 |
|------|------|
| SEO | 每个职业独立路由 + 独立 meta / H1 / 模板文案，主攻长尾词 |
| 开发 | 核心生成逻辑写一次；加职业 = 改 `professions` 配置 |
| 变现 | 免费层带广告；付费层去广告 + 更多次数 / 导出格式 |
| 风险 | 单职业流量差不影响整站，可随时增删职业页 |

**禁止（红海踩坑）：** 首页主打「AI Resume Builder for Everyone」去抢 `resume builder` 大词。

### 1.3 MVP 目标

- 上线 6 个职业落地页，各自可被 Google 索引
- 用户可完成：选职业 → 填表单 → AI 生成简历或求职信 → 预览 / 复制 / 基础导出
- 预留 Creem 支付按钮位、AdSense 广告位
- 后台同一套 API，密钥全部走环境变量

### 1.4 非目标（MVP 不做）

- 用户账户体系 / 社交登录（v2 用 Supabase Auth）
- PDF 精美排版引擎（MVP 仅 Markdown / 纯文本 / 简单 HTML）
- 多语言（MVP 仅英文 UI + 英文生成内容）
- ATS 评分、LinkedIn 导入、协作编辑

---

## 2. 用户与场景

### 2.1 目标用户

- 美国本土求职者，偏 **无办公室经验** 或 **换岗** 人群
- 典型场景：Google 搜 `nursing cover letter example` → 进入 `/nurse` → 填经历 → 生成 → 复制到 Word

### 2.2 用户故事

| ID | 作为… | 我想要… | 以便… |
|----|--------|---------|--------|
| US-01 | 新毕业护士 | 在护士专属页生成 cover letter | 不用从零写，符合 nursing 语境 |
| US-02 | 零经验仓储工 | 选 warehouse 模板并强调 transferable skills | 弥补「no experience」短板 |
| US-03 | 免费用户 | 看广告后继续使用 | 接受免费换广告模式 |
| US-04 | 付费用户 | 一键跳转 Creem 结账 | 获得更多生成次数 / 去广告 |

---

## 3. 信息架构与路由

### 3.1 站点地图

```
/                          → 职业 hub（列出 6 职业，不强推 generic resume builder）
/nurse                     → 护士专属页
/cna                       → 护工 CNA
/teacher                   → 教师
/warehouse                 → 仓储
/driver                    → 司机（CDL / delivery）
/server                    → 餐饮服务员
/pricing                   → 定价 + Creem 按钮
/privacy                   → 隐私政策（AdSense 必需）
/terms                     → 服务条款
/api/generate              → 生成 API（Server Route）
/api/webhooks/creem        → Creem webhook（预留，MVP 可 stub）
```

### 3.2 职业页统一结构（模板化）

每个 `/{slug}` 页面复用同一 `ProfessionLanding` 组件，由配置驱动：

1. **Hero**：职业专属 H1 + 副标题（含主攻关键词自然出现）
2. **Social proof 占位**：「Trusted by thousands of {profession}s」（MVP 静态文案）
3. **生成器表单**：姓名、目标岗位、经历要点、技能、语气（professional / friendly）
4. **输出类型 Tab**：Resume | Cover Letter
5. **结果区**：流式输出 + Copy + Download (.txt)
6. **SEO 内容区**：FAQ（3–5 条，含长尾问句）
7. **AdSense 位**：表单上方 1 处、结果下方 1 处（桌面 + 移动 responsive）
8. **CTA**：Upgrade on `/pricing`

### 3.3 起步职业配置

| slug | 显示名 | 主攻关键词（meta / content） |
|------|--------|------------------------------|
| `nurse` | Nurse | nursing cover letter, new grad nurse resume |
| `cna` | CNA | CNA resume example, CNA cover letter |
| `teacher` | Teacher | teacher cover letter, substitute teacher resume |
| `warehouse` | Warehouse Worker | warehouse resume, warehouse resume no experience |
| `driver` | Driver | CDL driver resume, delivery driver resume |
| `server` | Server / Waiter | server resume no experience, waiter resume |

配置文件路径建议：`src/config/professions.ts`（或 `professions.js`）。

---

## 4. 功能需求

### 4.1 生成器（P0）

| 功能 | 描述 | 验收标准 |
|------|------|----------|
| 表单校验 | 必填：姓名、至少 1 条经历或技能 | 空提交阻止并提示 |
| AI 生成 | 调用 DeepSeek，按职业 system prompt 生成 | 30s 内返回或流式首 token |
| 流式展示 | 打字机效果展示生成内容 | 用户可中途 Stop |
| 复制 | 一键复制全文 | Clipboard API + fallback |
| 下载 | `.txt` 下载 | 文件名含 slug + 类型 |
| 次数限制 | 免费 IP/设备 每日 N 次（建议 3） | 超限提示升级 |
| 错误处理 | API 失败友好提示，不暴露 key | 显示「Try again」 |

### 4.2 SEO（P0）

| 功能 | 描述 |
|------|------|
| 动态 metadata | 每职业页独立 `title`、`description`、`keywords` |
| Canonical | `https://{domain}/{slug}` |
| Open Graph | og:title / og:description / og:image（共用默认图） |
| JSON-LD | `WebApplication` + `FAQPage`（FAQ 区） |
| sitemap.xml | 自动生成，含所有职业页 |
| robots.txt | Allow /，指向 sitemap |

### 4.3  monetization 占位（P0 结构 / P1 实接）

| 模块 | MVP 行为 |
|------|----------|
| AdSense | 组件 `<AdSlot slotId="..." />`，无 ID 时渲染 placeholder |
| Creem | `/pricing` 三档套餐 + 外链按钮；`CREEM_PRODUCT_ID_*` 从 env 读 |
| Webhook | 路由存在，记录 payload 到 Supabase（可选） |

### 4.4 定价页（P0 静态）

建议三档（文案可后调）：

| 计划 | 价格 | 权益 |
|------|------|------|
| Free | $0 | 3 次/天，有广告，仅 txt |
| Pro | $1.99/mo | 50 次/月，无广告，docx（v2） |
| Lifetime | $29.90 once | 无限次，无广告（可设 soft cap） |

Creem 按钮：`Buy with Creem` → `https://creem.io/checkout/{productId}`（以 Creem 文档为准）。

### 4.5 数据持久化（P1，结构预留）

MVP 可不强制登录；Supabase 用于：

- `generations` 表：匿名 session_id、profession、type、created_at（分析用）
- `usage_limits` 表：session_id + date + count
- v2：`users` + Creem subscription status

---

## 5. 技术架构

### 5.1 栈选型

```
┌─────────────────────────────────────────────────────────┐
│  Client (Next.js App Router + React + Tailwind)         │
│  shadcn/ui: Button, Tabs, Form, Textarea, Card, Toast   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Next.js Server Actions / Route Handlers                │
│  - POST /api/generate  → DeepSeek API                   │
│  - Rate limit (Upstash 或 Supabase RPC，MVP 可内存)      │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
        ┌───────▼───────┐     ┌───────▼───────┐
        │  DeepSeek API │     │   Supabase    │
        │  (chat)       │     │   Postgres    │
        └───────────────┘     └───────────────┘
```

### 5.2 目录结构（建议）

```
project/
├── .env.local.example
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # 职业 hub
│   │   ├── [profession]/page.tsx    # 动态职业页
│   │   ├── pricing/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── sitemap.ts
│   │   └── api/
│   │       └── generate/route.ts
│   ├── components/
│   │   ├── ui/                      # shadcn
│   │   ├── profession-landing.tsx
│   │   ├── generator-form.tsx
│   │   ├── result-panel.tsx
│   │   ├── ad-slot.tsx
│   │   └── pricing-table.tsx
│   ├── config/
│   │   └── professions.ts
│   ├── lib/
│   │   ├── deepseek.ts
│   │   ├── prompts.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   └── rate-limit.ts
│   └── types/
│       └── profession.ts
└── supabase/
    └── migrations/
        └── 001_initial.sql
```

### 5.3 DeepSeek 集成要点

- 使用 OpenAI 兼容接口：`https://api.deepseek.com/v1/chat/completions`
- 模型建议：`deepseek-chat`（MVP）；可 env 切换 `deepseek-reasoner`
- **密钥仅服务端**：`DEEPSEEK_API_KEY` 不得出现在 Client Component 或 `NEXT_PUBLIC_*`
- 流式：`stream: true`，Route Handler 返回 `ReadableStream`

### 5.4 Prompt 设计（配置化）

`src/lib/prompts.ts` 按 profession slug 读取：

```ts
// 结构示例
{
  resume: {
    system: "You are an expert resume writer for {title} roles in the US...",
    userTemplate: "Name: {name}\nTarget: {targetRole}\nExperience:\n{experience}..."
  },
  coverLetter: { ... }
}
```

职业特有词汇从 `professions.ts` 的 `keywords`、`samplePhrases` 注入。

---

## 6. 环境变量规范

### 6.1 必须（服务端私密）

| 变量名 | 用途 | 示例 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 鉴权 | `sk-...` |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端写库（绕过 RLS 时使用） | `eyJ...` |
| `CREEM_WEBHOOK_SECRET` | 校验 Creem webhook 签名 | 随机字符串 |
| `CREEM_API_KEY` | Creem API（若需服务端查订阅） | 按 Creem 文档 |

### 6.2 可公开（`NEXT_PUBLIC_` 前缀）

| 变量名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_SITE_URL` | Canonical、sitemap、OG |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 客户端 Supabase（匿名读写的 RLS 策略） |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense `ca-pub-xxx` |
| `NEXT_PUBLIC_ADSENSE_SLOT_TOP` | 广告位 slot id |
| `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM` | 广告位 slot id |
| `NEXT_PUBLIC_CREEM_PRODUCT_PRO` | Pro 套餐 product id |
| `NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME` | Lifetime product id |

### 6.3 可选

| 变量名 | 用途 |
|--------|------|
| `DEEPSEEK_MODEL` | 默认 `deepseek-chat` |
| `FREE_DAILY_LIMIT` | 默认 `3` |
| `UPSTASH_REDIS_REST_URL` | 分布式 rate limit（生产推荐） |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token |

### 6.4 `.env.local.example` 模板

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# DeepSeek (server only — never NEXT_PUBLIC)
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-chat

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Monetization (optional for local dev)
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_ADSENSE_SLOT_TOP=
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=
NEXT_PUBLIC_CREEM_PRODUCT_PRO=
NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME=
CREEM_WEBHOOK_SECRET=
CREEM_API_KEY=

# Limits
FREE_DAILY_LIMIT=3
```

**安全规则：**

1. `.env.local` 加入 `.gitignore`，永不提交
2. Vercel / 部署平台在 Environment Variables 面板配置
3. Client Component 禁止 import 含 secret 的 module
4. API Route 内校验 `Origin` / rate limit，防刷 Key

---

## 7. Supabase 数据模型（MVP）

```sql
-- 匿名 session（cookie: session_id）
create table usage_limits (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  usage_date date not null default current_date,
  count int not null default 0,
  unique (session_id, usage_date)
);

create table generations (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  profession_slug text not null,
  doc_type text not null check (doc_type in ('resume', 'cover_letter')),
  created_at timestamptz default now()
);

-- RLS：MVP 仅 service role 写入；匿名不直接读表
alter table usage_limits enable row level security;
alter table generations enable row level security;
```

---

## 8. UI / 设计规范

- **风格**：干净、专业、偏 Indeed / LinkedIn 的 trustworthy 蓝灰色调
- **组件**：shadcn/ui Form + Textarea + Tabs + Card + Button
- **响应式**：移动优先；表单单列，桌面双列（表单 | 预览）
- **无障碍**：表单 label、按钮 aria、对比度 WCAG AA
- **占位**：AdSense / Creem 未配置时显示 dashed border placeholder，便于开发调试

---

## 9. 页面 SEO 文案示例（Nurse）

**Title：** `Nursing Cover Letter Generator | New Grad Nurse Resume — Free AI Tool`

**Description：** `Create a professional nursing cover letter or new grad nurse resume in minutes. Tailored for RN, LPN, and nursing students. Free to try.`

**H1：** `AI Nursing Cover Letter & Resume Builder`

**FAQ 示例：**

- How do I write a nursing cover letter with no experience?
- What should a new grad nurse resume include?
- Can I use this for LPN and RN applications?

---

## 10. 里程碑与排期

| 阶段 | 内容 | 预估 |
|------|------|------|
| **M0** | 项目脚手架：Next.js + Tailwind + shadcn + env 模板 | 0.5 天 |
| **M1** | `professions.ts` + 动态路由 + 6 职业静态 SEO 内容 | 1 天 |
| **M2** | 生成器 UI + DeepSeek API + 流式 + copy/download | 1.5 天 |
| **M3** | Supabase usage limit + generations 日志 | 0.5 天 |
| **M4** | Pricing / AdSlot / Creem 占位 + legal 页 | 0.5 天 |
| **M5** | sitemap、metadata、JSON-LD、部署 Vercel | 0.5 天 |
| **M6** | 自测 + Search Console 提交 | 0.5 天 |

**MVP 合计：约 5 个工作日**

---

## 11. 成功指标（上线后 30 天）

| 指标 | 目标 |
|------|------|
| 索引页数 | 6 职业页 + hub + pricing ≥ 8 |
| 自然搜索展示 | Search Console 有展示（任意长尾词） |
| 生成完成率 | 访问职业页 → 成功生成 ≥ 15% |
| 错误率 | API 5xx < 1% |
| 广告 | AdSense 申请通过（若未批，placeholder 不影响功能） |

---

## 12. 风险与对策

| 风险 | 对策 |
|------|------|
| DeepSeek 限流 / 宕机 | 错误提示 + 可选 fallback 模型 env |
| API 被刷 | Rate limit + 仅服务端 Key |
| AdSense 拒批 | 先上内容站，隐私/条款齐全，流量起来再申 |
| 内容重复 SEO | 每职业 unique FAQ + 150–300 字 intro |
| 医疗/法律表述 | Prompt 声明「用户需自行核实准确性」免责声明 |

---

## 13. 后续版本 backlog

- [ ] Supabase Auth + 用户历史记录
- [ ] DOCX / PDF 导出
- [ ] Creem webhook 自动开通 Pro
- [ ] A/B 测试 H1 文案
- [ ] 新增职业：仅改 `professions.ts` + 部署
- [ ] 博客 `/blog/{keyword}` 支撑内链

---

## 14. 确认清单（开工前）

- [ ] 域名确定 → 写入 `NEXT_PUBLIC_SITE_URL`
- [ ] DeepSeek 账号与 API Key
- [ ] Supabase 项目创建
- [ ] 6 职业 slug 与英文文案确认（可增删）
- [ ] Creem 产品 ID（可后填，先 placeholder）
- [ ] AdSense（可后填）

---

**下一步：** 确认本 PRD 后，按 M0→M6 初始化仓库并实现 MVP 代码。
