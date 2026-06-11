# 部署与上线指南

> 技术栈：Next.js 16 · React · Tailwind · shadcn/ui · Supabase · OpenAI 兼容 AI · Creem · AdSense
> 目标：部署到 Vercel，能用 AI 生成、能用 Creem 付费购买、可选 AdSense 广告。

---

## 0. 总览：上线需要的账号

| 服务 | 必需？ | 用途 |
|------|--------|------|
| GitHub | 必需 | 存代码、连 Vercel |
| Vercel | 必需 | 部署托管 |
| AI 提供商（OpenAI / OpenRouter / Groq…） | 必需 | 生成简历/求职信 |
| Supabase | 推荐 | 限次持久化、生成日志、支付记录 |
| Creem | 付费才需 | 收款 |
| Google AdSense | 想接广告才需 | 广告收入 |
| 域名（任意注册商） | 推荐 | 正式品牌 + SEO |

> 缺 AdSense / Creem 时网站照常运行：广告不显示、付费按钮显示「Coming soon」。

---

## 1. AI 提供商（出海可用）

AI 层是 **OpenAI 兼容** 的，换 provider 只改环境变量，**不改代码**。

### 推荐 A：阿里云百炼「通义千问」美区（首选）

官方美区（弗吉尼亚）节点，稳定、延迟低、可用支付宝充值。

1. 打开 https://www.alibabacloud.com/help/zh/model-studio/ （或国内百炼控制台），开通 Model Studio
2. **切换到「美国（弗吉尼亚）」地域**，创建 API Key
   - ⚠️ 地域 Key 不通用：北京 / 新加坡 / 美区的 Key 各自独立，必须用美区 Key 配美区 BaseURL
3. 环境变量：

```
AI_API_KEY=sk-你的美区key
AI_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-flash-us
```

- 模型选择（美区）：
  - `qwen-flash-us` — 最便宜、最快（替代旧的 qwen-turbo，**推荐起步**）
  - `qwen-plus-us` — 质量更高、贵一些
- 说明：官方美区模型名都带 `-us` 后缀。`qwen-turbo-us` 在美区列表中不一定提供，
  以控制台「模型列表」实际可用为准；便宜款直接用 `qwen-flash-us`。

### 备选 B：OpenAI

```
AI_API_KEY=sk-你的key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

### 备选 C：OpenRouter（一个 key 用多家模型）

```
AI_API_KEY=sk-or-你的key
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-4o-mini
```

> DeepSeek 仍可用：留空 `AI_API_KEY`，改填 `DEEPSEEK_API_KEY` 即可自动回退。

---

## 2. Supabase（必需：存用户 + GitHub 登录 + 限次/日志）

1. 打开 https://supabase.com → New project，记下数据库区域（建美国区，离用户近）
2. 项目创建后，进入 **SQL Editor** → New query
3. 把 `supabase/migrations/001_initial.sql` 全部内容粘贴进去 → Run
   - 该脚本会建 `app_users`（账号密码用户表）、`usage_limits`、`generations`、`payment_events`，并开启 RLS（仅服务端 service role 可访问）。
4. 进入 **Project Settings → API**，复制三项：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key（保密！）→ `SUPABASE_SERVICE_ROLE_KEY`

> 不配 Supabase：**登录功能不可用**，限次退化为内存计数（仅本地测试）。

### 2.1 登录架构（自建会话）

本项目**不使用** Supabase 的邮箱/密码登录，而是自建会话：

- **账号密码**：用户存在 `app_users` 表，密码用 scrypt 哈希；登录/注册时需通过**图形验证码**（数字+字母）。
- **GitHub 登录**：走 Supabase OAuth，回调后转换成我们自己的签名 Cookie 会话。
- **会话**：统一用一个签名 Cookie（`hp_session`，jose 签发），由 `AUTH_SESSION_SECRET` 签名。
- **受保护路由**：`/account` 需登录（`src/proxy.ts` 校验会话）。职业页等保持公开以利 SEO。

#### a) 生成会话密钥（必需）

```bash
openssl rand -base64 32
```
把结果填到 `AUTH_SESSION_SECRET`（本地 `.env.local`，线上 Vercel 环境变量）。

#### b) 开启 GitHub 登录（Supabase OAuth）

1. **GitHub** → Settings → Developer settings → **OAuth Apps** → New OAuth App
   - Homepage URL：`https://你的域名`（本地可填 `http://localhost:3000`）
   - **Authorization callback URL**：填 Supabase 的回调地址
     `https://<你的项目ref>.supabase.co/auth/v1/callback`
   - 创建后拿到 **Client ID** 和 **Client Secret**
2. **Supabase** → Authentication → **Providers → GitHub** → 开启，填入 Client ID / Secret → Save
3. **Supabase** → Authentication → **URL Configuration**
   - Site URL：本地 `http://localhost:3000`，上线后改 `https://你的域名`
   - Redirect URLs：加入 `http://localhost:3000/auth/callback` 和 `https://你的域名/auth/callback`

> 说明：GitHub 把用户送回 Supabase 的 `/auth/v1/callback`，Supabase 再回到我们站点的
> `/auth/callback`，我们在那里换取用户信息、写入 `app_users` 并签发自己的会话。

#### c) 设置管理员（可选）

管理员由 `app_users.is_admin` 控制。先注册/登录一次，再在 SQL Editor 执行：

```sql
update public.app_users set is_admin = true where lower(email) = lower('you@example.com');
```

> 想强制「生成前必须登录」：在 `src/app/api/generate/route.ts` 里加一行会话校验（见第 9 节）。

---

## 3. Creem 收款（让用户能购买）

### 3.1 建产品

1. 打开 https://creem.io → 注册商家账号
2. **Products → Add product**，建两个：
   - Pro（订阅 / 月付）→ 创建后 **Copy ID**，形如 `prod_xxx`
   - Lifetime（Single payment 一次性）→ 同样 **Copy ID**
3. **Developers → API Keys**，复制 API Key（测试模式以 `ck_test_` 开头）
4. **Developers → Webhooks**，新增 webhook：
   - URL：`https://你的域名/api/webhooks/creem`
   - 复制 **Webhook Secret**

### 3.2 对应环境变量

```
CREEM_API_KEY=ck_test_你的key        # 测试用 ck_test_，正式用正式 key
CREEM_WEBHOOK_SECRET=你的webhook_secret
NEXT_PUBLIC_CREEM_PRODUCT_PRO=prod_xxx
NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME=prod_yyy
```

配齐后 `/pricing` 页的「Coming soon」按钮会自动变成 **Subscribe / Buy** 真实结账按钮。
点击 → 后端调 `/api/checkout` 创建 Creem 结账会话 → 跳转 Creem 支付页 →
付款成功后 Creem 回调 `/api/webhooks/creem`（已做签名校验，记录到 `payment_events` 表）。

> 测试卡 / 测试模式见 Creem 文档。先用 `ck_test_` 跑通，再换正式 key。

---

## 4. Google AdSense（可选，广告收入）

1. https://adsense.google.com 申请账号（需要网站有内容、有隐私政策——本项目已带 `/privacy`、`/terms`）
2. 审核通过后，获取 `ca-pub-xxxxxxxxxxxxxxxx`
3. 建两个广告单元（展示广告），各拿一个 slot id
4. 环境变量：

```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_TOP=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=0987654321
```

> 不填 = 广告位完全不渲染，不影响功能。建议先上线攒内容/流量，再申请 AdSense。

---

## 5. 部署到 Vercel

### 5.1 推到 GitHub

```bash
cd E:\吴凯伟\出海\出海第一站\project
git add .
git commit -m "feat: MVP multi-profession resume generator"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

> Windows 上若 `npm`/`git` 报「禁止运行脚本」，用 `npm.cmd` 代替 `npm`；git 一般不受影响。

### 5.2 在 Vercel 导入

1. 打开 https://vercel.com → Add New → Project → 选你的 GitHub 仓库
2. Framework 自动识别为 Next.js，Build 命令默认即可
3. **Environment Variables**：把下面所有要用的变量逐条填入（见第 6 节清单）
4. Deploy

### 5.3 域名

- 暂无域名：先用 Vercel 自动给的 `xxx.vercel.app`，`NEXT_PUBLIC_SITE_URL` 可不填（会自动用该域名）
- 已买域名：Vercel → Project → Settings → Domains 添加，然后设 `NEXT_PUBLIC_SITE_URL=https://你的域名` 并 Redeploy

### 5.4 部署后回填

- **Supabase Auth URL**：把 Site URL / Redirect URLs 改成正式域名，并在 Redirect URLs 加上 `https://你的域名/auth/callback`（否则 GitHub 登录回跳失败）
- **GitHub OAuth App**：把 Homepage URL 改成正式域名（callback 仍是 Supabase 的 `/auth/v1/callback`，不用改）
- 把 Creem webhook URL 改成正式域名：`https://你的域名/api/webhooks/creem`
- 把正式域名提交到 Google Search Console，提交 `https://你的域名/sitemap.xml`

---

## 6. Vercel 环境变量清单（复制对照）

```
# 站点
NEXT_PUBLIC_SITE_URL=https://你的域名        # 没域名可不填

# AI（必需，推荐百炼通义千问美区；用美区 API Key）
AI_API_KEY=sk-...
AI_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-flash-us

# 会话密钥（必需：登录）— openssl rand -base64 32
AUTH_SESSION_SECRET=...

# Supabase（必需：用户表 + GitHub 登录 + 限次/日志）
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Creem（要收款才填）
CREEM_API_KEY=ck_test_...
CREEM_WEBHOOK_SECRET=...
NEXT_PUBLIC_CREEM_PRODUCT_PRO=prod_...
NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME=prod_...

# AdSense（想接广告才填）
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...
NEXT_PUBLIC_ADSENSE_SLOT_TOP=...
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=...

# 限次
FREE_DAILY_LIMIT=3
```

> 改了任何 `NEXT_PUBLIC_*` 变量后，必须在 Vercel **Redeploy** 才生效（它们在构建期注入）。

---

## 7. 本地验证

```bash
cd E:\吴凯伟\出海\出海第一站\project
npm.cmd install      # 首次
npm.cmd run dev
```

- 生成测试：http://localhost:3000/nurse → 填表 → Generate，能流式出文字即说明 AI 配好了。
- 登录测试：http://localhost:3000/login →
  - 「Password」标签：输入邮箱+密码+图形验证码 → Sign up 注册 / Sign in 登录
  - 「GitHub」按钮：跳转 GitHub 授权 → 回跳后自动建立会话（需先配好第 2.1.b 节）
  - 登录后右上角出现「Account / Log out」，访问 `/account` 可见账户信息。
  - 验证码看不清可点图片刷新。

---

## 8. 上线最小可用清单

- [ ] AI：`AI_API_KEY` 已填，本地能生成
- [ ] 会话：`AUTH_SESSION_SECRET` 已生成填好
- [ ] Supabase：跑过建表 SQL，三个 key 填好
- [ ] 登录：账号密码 + 验证码可注册登录；（可选）GitHub OAuth 已配好、Redirect URLs 含 `/auth/callback`
- [ ] 代码推 GitHub，Vercel 部署成功
- [ ] （收款）Creem 产品建好、webhook 指向正式域名、4 个变量填好、`/pricing` 按钮变实
- [ ] （广告）AdSense 通过后填 client + 两个 slot
- [ ] （SEO）域名绑定、sitemap 提交 Search Console

---

## 9. 常见扩展

### 9.1 强制「生成前必须登录」（可选）

默认职业页对游客开放（利于 SEO）。若要求登录后才能生成，在
`src/app/api/generate/route.ts` 顶部加：

```ts
import { getSessionUser } from "@/lib/auth/session";
// ...在 POST 内、校验通过后：
const user = await getSessionUser();
if (!user) {
  return Response.json({ error: "Please log in to generate." }, { status: 401 });
}
```

并可在前端 `generator-form.tsx` 里把 401 错误提示引导到 `/login`。

### 9.2 以后加职业（无需改其它代码）

编辑 `src/config/professions.ts`，新增一个对象或把 `enabled` 改成 `false`：

```ts
{
  slug: "barista",
  enabled: true,
  // metaTitle / keywords / hero / faqs / samplePhrases ...
}
```

推送后 Vercel 自动生成 `/barista` 页并加入 sitemap。
