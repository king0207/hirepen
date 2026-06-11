# HirePen 部署与上线指南

> 站点：**https://hirepen.net**  
> 技术栈：Next.js 16 · React · Tailwind · shadcn/ui · Supabase · OpenAI 兼容 AI · Creem · AdSense  
> 托管：Vercel（海外，**无需 ICP 备案**）  
> 域名：腾讯云购买 `hirepen.net`，DNS 解析到 Vercel

---

## 0. 上线总览（推荐顺序）

| 步骤 | 做什么 | 预计时间 |
|------|--------|----------|
| 1 | 本地跑通（AI + Supabase 建表 + 登录） | 半天 |
| 2 | 推 GitHub → Vercel 部署（先用 `xxx.vercel.app` 测） | 30 分钟 |
| 3 | 腾讯云域名实名 + DNS 指向 Vercel | 1–3 天（等实名） |
| 4 | Vercel 绑定 `hirepen.net`，设环境变量，Redeploy | 30 分钟 |
| 5 | Google Search Console 提交 sitemap | 10 分钟 |
| 6 | 有流量后再申请 AdSense | 上线后 1–2 周 |

### 需要的账号

| 服务 | 必需？ | 用途 | 支付方式 |
|------|--------|------|----------|
| GitHub | ✅ | 存代码、连 Vercel | 免费 |
| Vercel | ✅ | 部署托管 | 免费版够用 |
| 阿里云百炼（通义千问美区） | ✅ | AI 生成 | **支付宝** |
| Supabase | ✅ | 用户表、GitHub OAuth、限次/日志 | 免费版够用 |
| 腾讯云 | ✅ | 域名 `hirepen.net` | **支付宝** |
| Creem | 收款才需 | 订阅/一次性付费 | 按 Creem 文档 |
| Google AdSense | 广告才需 | 广告收入 | 电汇到国内银行 |
| Google Search Console | 推荐 | SEO 收录 | 免费 |

> Creem / AdSense 未配置时网站照常运行：付费按钮显示 Coming soon，广告位不渲染。

---

## 1. 本地开发环境

### 1.1 安装与启动

```bash
cd E:\吴凯伟\出海\出海第一站\project
copy env.example .env.local    # 首次
npm.cmd install                # Windows 若 npm 报脚本错误，用 npm.cmd
npm.cmd run dev                # http://localhost:3000
```

### 1.2 本地环境变量（`.env.local`）

```bash
# 本地开发保持 localhost；Vercel 线上填 https://hirepen.net
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI（必需）— 见第 2 节
AI_API_KEY=sk-你的美区key
AI_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-flash-us

# 登录（必需）— openssl rand -base64 32
AUTH_SESSION_SECRET=你的随机密钥

# Supabase（必需）— 见第 3 节
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# 本地开发若开了 VPN/代理，Node 连 Supabase 可能失败，加这一行：
HTTPS_PROXY=http://127.0.0.1:7897   # 端口改成你代理的实际 HTTP 端口
# 项目已内置 src/instrumentation.ts 自动让 Node fetch 走代理
# ⚠️ Vercel 线上不要填 HTTPS_PROXY
```

### 1.3 本地验证清单

- [ ] http://localhost:3000/nurse → 填表 → **Generate** 能流式出文字（AI OK）
- [ ] http://localhost:3000/login → 注册/登录（邮箱+密码+验证码）成功
- [ ] 登录后跳转**首页**，右上角显示 **Account / Log out**
- [ ] `/account` 可访问；管理员可见 **Admin** 入口和 `/admin` 后台

---

## 2. AI 提供商（必需）

AI 层 **OpenAI 兼容**，换 provider 只改环境变量，不改代码。

### 推荐：阿里云百炼「通义千问」美区（弗吉尼亚）

1. 打开百炼 / Model Studio 控制台，**切换到「美国（弗吉尼亚）」地域**
2. 创建 API Key（⚠️ 美区 Key 不能配北京/新加坡的 Base URL）
3. 环境变量：

```
AI_API_KEY=sk-你的美区key
AI_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-flash-us
```

| 模型 | 说明 |
|------|------|
| `qwen-flash-us` | 最便宜、最快，**推荐起步** |
| `qwen-plus-us` | 质量更高 |

### 备选

```
# OpenAI
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini

# OpenRouter
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-4o-mini
```

> DeepSeek 回退：留空 `AI_API_KEY`，改填 `DEEPSEEK_API_KEY` 即可。

---

## 3. Supabase（必需）

### 3.1 建项目 + 跑建表 SQL

1. https://supabase.com → **New project**（选美国区）
2. **SQL Editor** → New query → 粘贴 `supabase/migrations/001_initial.sql` 全部内容 → **Run**
3. 确认 **Table Editor** 出现 4 张表：`app_users`、`usage_limits`、`generations`、`payment_events`

> ⚠️ 不跑 SQL 会报 `Could not find the table 'public.app_users'`，注册/登录全部失败。

### 3.2 复制 API Keys

**Project Settings → API**：

| 变量 | 来源 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key（**保密**） |

### 3.3 登录架构（自建会话）

本项目**不使用** Supabase 原生邮箱登录，而是：

| 方式 | 说明 |
|------|------|
| 账号密码 | 存在 `app_users`，scrypt 哈希，注册/登录需**图形验证码** |
| GitHub OAuth | Supabase 做 OAuth，回调后签发**自建 JWT Cookie**（`hp_session`） |
| 会话密钥 | `AUTH_SESSION_SECRET` 签名，生成：`openssl rand -base64 32` |

受保护路由：`/account`、`/admin`（`src/proxy.ts` 校验会话）。  
职业页（`/nurse` 等 20 个）**保持公开**，利于 SEO。

#### GitHub 登录配置（可选）

1. **GitHub** → Settings → Developer settings → OAuth Apps → New
   - Homepage URL：`https://hirepen.net`（本地填 `http://localhost:3000`）
   - Authorization callback URL：`https://<项目ref>.supabase.co/auth/v1/callback`
2. **Supabase** → Authentication → Providers → **GitHub** → 填入 Client ID / Secret
3. **Supabase** → Authentication → URL Configuration
   - Site URL：`https://hirepen.net`
   - Redirect URLs 加入：
     - `http://localhost:3000/auth/callback`
     - `https://hirepen.net/auth/callback`

#### 设置管理员（可选）

注册/登录一次后，在 SQL Editor 执行：

```sql
update public.app_users set is_admin = true
where lower(email) = lower('你的邮箱@example.com');
```

然后**退出重新登录**（admin 标志在 JWT 里）。管理员权限：

- `/admin` 后台：所有用户、生成记录、支付事件
- 不受每日生成次数限制
- 右上角出现 **Admin** 链接

---

## 4. 域名 hirepen.net（腾讯云）

### 4.1 购买与实名

1. 腾讯云 → **域名注册** → 已购买 `hirepen.net`
2. **实名认证**（国内注册商强制，1–3 天）→ 状态须为 **已实名 / 正常**
3. 购买时**不要**勾选捆绑的：轻量服务器、DNS 专业版、SSL 证书（Vercel 全包）

> 域名在腾讯云买、网站在 Vercel 托管 → **不需要 ICP 备案**。

### 4.2 DNS 解析到 Vercel

**先在 Vercel 添加域名**（见第 5.3 节），再回腾讯云配 DNS。

腾讯云 → **DNS 解析 DNSPod** → `hirepen.net` → 添加记录：

| 主机记录 | 记录类型 | 记录值 | 说明 |
|----------|----------|--------|------|
| `@` | A | `76.76.21.21` | 根域名 → Vercel |
| `www` | CNAME | `cname.vercel-dns.com` | www 子域名 |

> 以 Vercel Domains 页面显示的为准；若 Vercel 给了不同 IP/CNAME，按 Vercel 的填。

生效时间：通常 5 分钟～几小时，最长 24 小时。  
验证：浏览器打开 https://hirepen.net 能看到站点即成功。

---

## 5. 部署到 Vercel

### 5.1 推代码到 GitHub

```bash
cd E:\吴凯伟\出海\出海第一站\project
git add .
git commit -m "feat: HirePen MVP ready for production"
git branch -M main
git remote add origin https://github.com/你的用户名/hirepen.git
git push -u origin main
```

> Windows：`npm.cmd` 代替 `npm`；`git` 一般不受影响。

### 5.2 导入 Vercel 项目

1. https://vercel.com → **Add New → Project** → 选 GitHub 仓库
2. Framework 自动识别 Next.js，Build 命令默认
3. **Environment Variables**：填入第 6 节清单（**至少填必需项**）
4. **Deploy** → 先用 `xxx.vercel.app` 测试

### 5.3 绑定域名 hirepen.net

1. Vercel → Project → **Settings → Domains**
2. 添加 `hirepen.net` 和 `www.hirepen.net`
3. 按提示在腾讯云配 DNS（见第 4.2 节）
4. 确认 **Environment Variables** 中：

```
NEXT_PUBLIC_SITE_URL=https://hirepen.net
```

5. **Redeploy**（改了 `NEXT_PUBLIC_*` 必须重新部署）

### 5.4 部署后回填（逐项检查）

- [ ] **Supabase Auth URL**：Site URL = `https://hirepen.net`，Redirect URLs 含 `https://hirepen.net/auth/callback`
- [ ] **GitHub OAuth App**：Homepage URL 改为 `https://hirepen.net`（callback 仍是 Supabase 的，不用改）
- [ ] **Creem webhook**（若已配）：`https://hirepen.net/api/webhooks/creem`
- [ ] 浏览器访问 https://hirepen.net/nurse → Generate 正常
- [ ] 浏览器访问 https://hirepen.net/login → 注册/登录正常

---

## 6. Vercel 环境变量清单

复制到 Vercel → Settings → Environment Variables（Production + Preview 都填）。

```
# ── 必需 ──
NEXT_PUBLIC_SITE_URL=https://hirepen.net

AI_API_KEY=sk-...
AI_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-flash-us

AUTH_SESSION_SECRET=...          # openssl rand -base64 32

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

FREE_DAILY_LIMIT=3

# ── 收款（可选，不配则 /pricing 显示 Coming soon）──
CREEM_API_KEY=ck_test_...
CREEM_WEBHOOK_SECRET=...
NEXT_PUBLIC_CREEM_PRODUCT_PRO=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME=prod_...

# ── 广告（可选，不配则广告位不渲染）──
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...
NEXT_PUBLIC_ADSENSE_SLOT_TOP=...
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=...
```

> ⚠️ 改了任何 `NEXT_PUBLIC_*` 后必须 **Redeploy**。  
> ⚠️ Vercel 上**不要**填 `HTTPS_PROXY`（仅本地开发用）。

---

## 7. SEO 与 Google 收录

### 7.1 已内置的 SEO 能力

- **20 个职业落地页**（SSG 静态生成）：`/nurse`、`/warehouse`、`/server`… 每个 targeting 不同长尾词
- 自动生成 `https://hirepen.net/sitemap.xml`
- `robots.txt` 排除 `/login`、`/account`、`/admin`
- `/privacy`、`/terms` 隐私与条款页

### 7.2 Google Search Console（上线后立即做）

1. https://search.google.com/search-console → 添加资源 `https://hirepen.net`
2. 验证所有权（DNS TXT 记录或 HTML 文件，按 Google 提示）
3. **Sitemaps** → 提交 `https://hirepen.net/sitemap.xml`
4. 等 Google 抓取（几天到几周），在「效果」里看哪些词有曝光

### 7.3 持续 SEO（长期）

- 在 `src/config/professions.ts` 加新职业 → 自动多一个 SEO 入口
- 丰富每个职业的 intro / FAQ 内容
- 定期看 Search Console 数据，优化标题和描述

---

## 8. Google AdSense（可选，建议有流量后再申请）

### 8.1 前置条件（本项目已满足）

- ✅ 正式域名 `hirepen.net`
- ✅ `/privacy` 隐私政策
- ✅ `/terms` 服务条款
- ✅ 20 个有实质内容的职业页
- ✅ 广告位代码已集成（配 env 才显示）

### 8.2 申请步骤

1. https://adsense.google.com → 注册 / 登录
2. 添加网站：`https://hirepen.net`
3. 按提示在 `<head>` 放验证代码 → 本项目填 `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxx` 后 Redeploy 即可
4. 等待审核（新站常 pending 或被拒，**正常**——改内容、等流量后再申）

### 8.3 审核通过后

1. 建两个**展示广告**单元，拿到 slot id
2. Vercel 填入：

```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=0987654321
```

3. **Redeploy** → 职业页上下会出现广告位

### 8.4 收款

AdSense 收入通过**电汇到国内银行账户**（美元），与域名/部署无关。

> 💡 建议：上线后先跑 SEO 1–2 周，有一点自然访问再申请，通过率更高。

---

## 9. Creem 收款（可选）

### 9.1 建产品

1. https://creem.io → 注册商家
2. Products → 建 **Pro（订阅）** 和 **Lifetime（一次性）** → Copy 各 product ID
3. Developers → API Keys → 复制 key（测试 `ck_test_` 开头）
4. Developers → Webhooks → URL：`https://hirepen.net/api/webhooks/creem`

### 9.2 环境变量

```
CREEM_API_KEY=ck_test_...
CREEM_WEBHOOK_SECRET=...
NEXT_PUBLIC_CREEM_PRODUCT_PRO=prod_xxx
NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME=prod_yyy
```

配齐后 `/pricing` 按钮变为真实结账；先用测试 key 跑通再换正式 key。

---

## 10. 上线检查清单（打印对照）

### 部署前
- [ ] Supabase 建表 SQL 已跑，`app_users` 等 4 表存在
- [ ] 本地 `npm run dev`：Generate + 注册/登录均正常
- [ ] `AUTH_SESSION_SECRET` 已生成

### Vercel 部署
- [ ] 代码已推 GitHub，Vercel Deploy 成功
- [ ] 必需环境变量已填（AI、Auth、Supabase、SITE_URL）
- [ ] `xxx.vercel.app` 上 Generate 和登录正常

### 域名
- [ ] 腾讯云 `hirepen.net` 实名已通过
- [ ] Vercel Domains 添加了 `hirepen.net` + `www.hirepen.net`
- [ ] 腾讯云 DNS：A 记录 `@` → `76.76.21.21`，CNAME `www` → `cname.vercel-dns.com`
- [ ] `NEXT_PUBLIC_SITE_URL=https://hirepen.net` 已设并 Redeploy
- [ ] https://hirepen.net 能打开且功能正常

### 上线后
- [ ] Supabase / GitHub OAuth Redirect URLs 已改为 `https://hirepen.net/auth/callback`
- [ ] Google Search Console 已验证并提交 sitemap
- [ ] （可选）管理员 SQL 已执行，重新登录后 `/admin` 可访问
- [ ] （可选）Creem 产品 + webhook 已配
- [ ] （可选）AdSense 已申请（建议有流量后）

---

## 11. 常见问题

### Q: 注册报 `Could not find the table 'app_users'`？
→ 还没在 Supabase 跑 `001_initial.sql`，见第 3.1 节。

### Q: 本地注册/登录卡 9 秒超时？
→ VPN/代理导致 Node 连不上 Supabase。在 `.env.local` 加 `HTTPS_PROXY=http://127.0.0.1:你的代理端口`（见第 1.2 节）。Vercel 线上不会有此问题。

### Q: 买了域名还要备案吗？
→ **不用**。域名在腾讯云买，网站托管在 Vercel（海外），不需要 ICP 备案。只需域名**实名认证**。

### Q: AdSense 新站申请被拒？
→ 正常。先积累内容和流量，1–2 周后改内容再申。网站功能不受影响。

### Q: 怎么加新职业页？
→ 编辑 `src/config/professions.ts`，加一个对象或设 `enabled: false` 隐藏。推送后 Vercel 自动生成页面并加入 sitemap。

### Q: 怎么强制「生成前必须登录」？
→ 在 `src/app/api/generate/route.ts` 的 POST 里加：

```ts
import { getSessionUser } from "@/lib/auth/session";
const user = await getSessionUser();
if (!user) {
  return Response.json({ error: "Please log in to generate." }, { status: 401 });
}
```

---

## 12. 费用估算（早期）

| 项目 | 费用 |
|------|------|
| 域名 hirepen.net | ~¥90/年 |
| Vercel | 免费 |
| Supabase | 免费 |
| 通义千问 AI | 按量，低流量一个月几块钱 |
| AdSense / Creem | 免费接入 |
| **合计** | **~¥100/年 + AI 按量** |
