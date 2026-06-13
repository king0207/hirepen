# HirePen SEO 实操手册

> 站点：https://www.hirepen.net  
> 策略：**职业细分长尾词**（如 `nursing cover letter generator`），不做 generic「AI resume builder」大词。  
> 相关文档：部署见 [DEPLOY.md](./DEPLOY.md)，产品范围见 [PRD-MVP.md](./PRD-MVP.md)。

---

## 1. 项目里已经做好的 SEO（不用重复造轮子）

| 能力 | 位置 | 说明 |
|------|------|------|
| 20 个职业落地页 | `src/config/professions.ts` | 每个 `/{slug}` 独立 title / description / keywords / FAQ |
| 静态生成（SSG） | `src/app/[profession]/page.tsx` | 构建时生成 HTML，利于爬虫 |
| Sitemap | `src/app/sitemap.ts` | 访问 `/sitemap.xml`，URL 来自 `NEXT_PUBLIC_SITE_URL` |
| Robots | `src/app/robots.ts` | 允许抓取全站，并声明 sitemap 地址 |
| 全局 metadata | `src/app/layout.tsx` | `metadataBase`、默认 title 模板 |
| JSON-LD | `src/components/profession-landing.tsx` | 每职业页：`WebApplication` + `FAQPage`（GSC 可验证 FAQ） |
| 隐私 / 条款 | `/privacy`、`/terms` | AdSense、Creem 审核需要 |
| 联系邮箱 | 页脚 + 法律页 | `NEXT_PUBLIC_SUPPORT_EMAIL` |
| 不索引页 | login / account / admin 等 | `robots: { index: false }` |

**Sitemap 不是静态文件**，改 URL 列表请编辑 `sitemap.ts` 或 `professions.ts`（`enabled: false` 的 slug 不会进 sitemap）。

---

## 2. 域名与 canonical（必做一致）

Vercel 配置：`hirepen.net` → 308 跳到 `www.hirepen.net`，**主站请统一用 www**。

```env
# Vercel Production + Preview
NEXT_PUBLIC_SITE_URL=https://www.hirepen.net
```

影响范围：sitemap、robots、Creem 成功跳转、密码重置邮件链接、Open Graph 等。

改完后 **Redeploy**，打开 https://www.hirepen.net/sitemap.xml 确认 `<loc>` 均为 `https://www.hirepen.net/...`。

---

## 3. 阶段路线图

### 阶段 0 — 上线基础（你已完成 ✅）

- [x] 站点部署 Vercel，域名 DNS 生效
- [x] Google Search Console 验证并提交 `sitemap.xml`
- [x] 重要页「请求编入索引」（首页、`/nurse`、`/pricing` 等）
- [x] Bing Webmaster Tools 提交 sitemap（可选）
- [x] Creem 商家信息 + 页脚联系邮箱
- [x] 单页网址检查出现「已收录到 Google」

### 阶段 1 — 收录期（上线后 1～4 周）

**目标：** 让更多职业页进入索引，GSC 汇总报表出数据。

| 频率 | 做什么 | 在哪看 |
|------|--------|--------|
| 一次性 | 确认 `NEXT_PUBLIC_SITE_URL=https://www.hirepen.net` 并 Redeploy | Vercel |
| 每周 1 次 | **编制索引 → 网页**：已编入索引数量是否上升（目标 ~24 页） | [GSC](https://search.google.com/search-console) |
| 每周 1 次 | **站点地图**：Discovered URLs 是否从 0 变为 20+ | GSC |
| 按需 | **网址检查**：抽查未收录的职业页，点「请求编入索引」（每天有限额） | GSC |
| 按需 | **PageSpeed Insights** 测 `/nurse` | [pagespeed.web.dev](https://pagespeed.web.dev) |

**本阶段不要：** 买外链包、SEMrush/Ahrefs 月付、每天发 AI 水文、急着 AdSense。

**GSC 显示「正在处理数据」：** 汇总报表比单页检查慢 1～3 天，单页已绿则正常。

### 阶段 2 — 展示与优化（约 1～3 个月）

**目标：** GSC「效果」里出现 **展示（impressions）**，知道用户在搜什么词。

| 频率 | 做什么 |
|------|--------|
| 每周 | GSC → **效果 → 查询**：记录有展示但 0 点击的词 |
| 每月 | 根据查询词改对应职业的 `metaTitle` / `metaDescription` / `hero.h1`（`professions.ts`） |
| 每月 | 给展示高、点击低的页面试改 title（更具体、带年份或「free」等，但勿标题党） |
| 可选 | 接入 **GA4** + **Microsoft Clarity**（见第 6 节） |
| 可选 | [keywordtool.io](https://keywordtool.io) 免费额度：为新职业找长尾词 |

**内容优化原则：**

- 一个职业页主攻 2～4 个相关长尾，写在 `keywords`、H1、intro、FAQ 里自然出现
- FAQ 至少 3 条，回答真实求职场景（GSC 已能识别 FAQ 结构化数据）
- 不要堆无关大词（`resume builder`、`AI writer`）

### 阶段 3 — 增长与变现（约 3～6 个月+）

**目标：** 稳定点击、第一笔 Creem 订阅、再考虑广告与外链。

| 事项 | 说明 |
|------|------|
| Creem Live | 审核通过后切正式 key，确保 `/pricing` 可付 |
| AdSense | GSC 每月有稳定展示/点击后再申，被拒很常见，等流量再申 |
| 新职业页 | 在 `professions.ts` 增加 slug → 自动 sitemap + 新落地页 |
| 竞品 / 外链工具 | SEMrush、Ahrefs **7 天试用**即可，查竞品词与外链，不必长期月付 |
| 外链 | 少量高质量 &gt; 批量目录（见第 5 节） |
| 可选内容 | 每月 1～2 篇职业向指南（Medium / Dev.to），内链到 `/{slug}` |

---

## 4. 站内 SEO：改 `professions.ts`

文件：`src/config/professions.ts`

```typescript
{
  slug: "cna",
  enabled: true,                    // false = 下线该页，不进 sitemap
  metaTitle: "...",                 // &lt; 60 字符为宜，含主长尾词
  metaDescription: "...",           // &lt; 155 字符，说明免费 + 场景
  keywords: ["cna cover letter", "..."],
  hero: { h1: "...", subtitle: "..." },
  intro: "...",                     // 2～4 句，唯一、可读
  faqs: [{ question, answer }, ...],
}
```

**新增职业 checklist：**

1. 复制一个相近职业对象，改 slug / 文案  
2. `enabled: true`  
3. 本地 `npm run build` 确认无报错  
4. push → Vercel 部署  
5. GSC 网址检查新 URL → 请求编入索引  

**优化已有职业（有 GSC 数据后）：**

1. 在「效果 → 查询」找到带展示的词  
2. 若查询是 `warehouse resume no experience`，确保该 phrase 出现在 title、H1 或 FAQ 之一  
3. 改完 deploy，可选「请求编入索引」加速更新  

---

## 5. 站外 SEO（外链与社区）

**不推荐（HirePen 现阶段）：**

- 批量提交泛 AI 工具目录、付费 Product Hunt 发帖包  
- Reddit / Quora 硬广 spam  
- 购买大量低质量外链  

**可以考虑（免费、相关、低频）：**

| 渠道 | 做法 |
|------|------|
| Reddit | `r/resumes`、`r/jobs`、`r/nursing` 等认真回答问题，仅在 genuinely 有帮助时带链接 |
| Medium / Dev.to | 一篇「How to write a CNA cover letter with no experience」→ 文末链到 `/cna` |
| Indie Hackers | Build in public 发产品故事（偏开发者受众） |
| Product Hunt | 产品成熟、有截图与稳定功能后 **发一次** 即可 |

**检查外链（免费）：**

- [Ahrefs Backlink Checker](https://ahrefs.com/backlink-checker) — 每月看 1 次是否有自然外链  
- GSC → **链接** → 外部链接（有数据后）

---

## 6. 分析工具：GA4 与 Clarity 接入

### 6.1 和 Search Console 有什么区别？

| 工具 | 看什么 | 典型问题 |
|------|--------|----------|
| **Google Search Console** | 搜索表现：展示、点击、**搜什么词找到你** | 「哪个长尾词有曝光？」 |
| **Google Analytics 4 (GA4)** | 站内行为：**多少人来了、从哪来、看了哪些页** | 「今天多少访问？/nurse 比 /cna 热吗？」 |
| **Microsoft Clarity** | 可视化：**热力图、会话录屏** | 「用户有没有点 Generate？在哪放弃？」 |

三者互补：**GSC = 搜索入口，GA4 = 流量统计，Clarity = 为什么没转化。**

---

### 6.2 代码里怎么接的（已内置）

| 文件 | 作用 |
|------|------|
| `src/components/analytics-scripts.tsx` | 读取 env，有值才加载脚本 |
| `src/app/layout.tsx` | 全站注入 `<AnalyticsScripts />` |
| `src/lib/env.ts` | `getGa4MeasurementId()` / `getClarityProjectId()` |

**不配 env = 完全不加载**（和 AdSense 一样），本地开发可留空。

---

### 6.3 Google Analytics 4 — 注册与配置

#### 用处（你要看什么）

- **Reports → Acquisition**：用户从 Google 搜索、直接打开、外链来的比例  
- **Reports → Engagement → Pages**：哪个职业页浏览最多  
- **Realtime**：刚部署后确认 tracking 是否生效  
- **Events（默认）**：`page_view` 等，无需额外写代码  

#### 注册步骤

1. 打开 [Google Analytics](https://analytics.google.com/)（用 Google 账号）  
2. **Admin（管理）** → **Create account**（账户名如 `HirePen`）  
3. **Create property** → 属性名 `HirePen Web`，时区 **United States**，货币 **USD**  
4. **Web 数据流** → 网站 URL：`https://www.hirepen.net`  
5. 复制 **Measurement ID**（格式 `G-XXXXXXXXXX`）  

#### 环境变量

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

- 填到 **Vercel → Environment Variables**（Production + Preview 可选）  
- 本地 `.env.local` 可留空，避免污染生产数据  
- 改完后 **Redeploy**  

#### 验证是否生效

1. 部署后打开 https://www.hirepen.net  
2. GA4 → **Reports → Realtime** → 应看到 1 个 active user  
3. 或浏览器装 [Google Analytics Debugger](https://chrome.google.com/webstore) 看 network 请求  

---

### 6.4 Microsoft Clarity — 注册与配置

#### 用处（你要看什么）

- **Dashboard → Traffic**：访问量趋势（比 GA4 简单）  
- **Heatmaps**：用户常点哪里、滚动多深（看 Generate 按钮是否被看到）  
- **Recordings**：匿名录屏回放（看用户是否卡在表单、报错、离开）  
- **免费、无流量上限**（适合 indie 小站）  

注意：录屏可能含用户输入的文字，Clarity 默认会遮罩部分敏感字段；仍勿在公开环境记录密码等。

#### 注册步骤

1. 打开 [Microsoft Clarity](https://clarity.microsoft.com/)（Microsoft 账号登录）  
2. **Add new project** → 名称 `HirePen`，URL `https://www.hirepen.net`  
3. 选行业 **Technology / Software** 即可  
4. 创建后进入 **Settings → Setup** → 复制 **Project ID**（一串字母数字，非完整 script）  

#### 环境变量

```env
NEXT_PUBLIC_CLARITY_PROJECT_ID=abcdefghij
```

同样填 Vercel + Redeploy。可与 GA4 同时启用。

#### 验证是否生效

1. 打开站点浏览 1～2 分钟  
2. Clarity 项目页 **Dashboard** → 几分钟内应出现 session  
3. 首次 **Recordings** 可能要等 30 分钟～几小时才有回放  

---

### 6.5 Vercel 一次性配置清单

```env
NEXT_PUBLIC_SITE_URL=https://www.hirepen.net
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxx
```

保存 → **Deployments → Redeploy**。  
两个 ID 都 **不要** 勾 Sensitive（会出现在前端，非秘密）。

---

### 6.6 其他工具（无需嵌入代码）

| 工具 | 现在 | 作用 | 用法 |
|------|------|------|------|
| **Google Search Console** | ✅ 必用 | 收录、查询词、展示/点击 | 已配置 |
| **Bing Webmaster** | ✅ 可选 | Bing 收录 | sitemap 已提交 |
| **PageSpeed Insights** | 偶尔 | 性能 / Core Web Vitals | [pagespeed.web.dev](https://pagespeed.web.dev) 手动测 |
| **SEMrush / Ahrefs** | 3 月+ | 竞品词、外链 | 浏览器试用，非嵌入 |
| **keywordtool.io** | 按需 | 新职业关键词 | 浏览器使用 |

---

### 6.7 建议启用时机

| 阶段 | GA4 | Clarity |
|------|-----|---------|
| 刚上线、在等收录 | 可选（先看 Realtime 确认部署） | 可选 |
| 开始有自然访问 | ✅ 建议开 | ✅ 建议开 |
| 要优化转化（点 Generate / 注册 / 付费） | 看页面与来源 | **重点看录屏与热力图** |

**隐私：** 已在 `/privacy` 声明 Analytics / Clarity；欧盟用户未来如需 cookie banner 再单独加（MVP 阶段美国流量为主可暂不处理）。

---

## 7. Google Search Console 操作速查

### 7.1 日常看哪里

| 菜单 | 看什么 |
|------|--------|
| 概述 | 总点击、展示趋势 |
| 效果 | **查询**（搜什么词）、**网页**（哪页有展示） |
| 编制索引 → 网页 | 已收录 / 未收录数量与原因 |
| 编制索引 → 站点地图 | sitemap 是否 Success、发现 URL 数 |
| 网址检查 | 单页是否已收录、FAQ 是否有效 |
| 链接 | 谁链向你（数据较晚才有） |

### 7.2 不用逐个 URL 检查

- **批量状态** → 「编制索引 → 网页」  
- **单页排查** → 「网址检查」  

### 7.3 常见状态

| 提示 | 含义 |
|------|------|
| 正在处理数据 | 新站正常，等 1～3 天 |
| 网址已收录 | 该页可出现在搜索结果 |
| 站点地图 Success 但 URL 为 0 | 刚提交，等 Google 爬 sitemap |
| 已发现 - 尚未编入索引 | Google 知道 URL，排队索引中 |

---

## 8. 技术 SEO checklist

- [ ] `NEXT_PUBLIC_SITE_URL=https://www.hirepen.net`（Vercel + Redeploy）  
- [ ] https://www.hirepen.net/sitemap.xml 可访问且 URL 带 www  
- [ ] https://www.hirepen.net/robots.txt 含 `Sitemap:` 行  
- [ ] 首页、职业页、pricing、privacy、terms 返回 200  
- [ ] `/login`、`/account` 不被索引（view-source 或 GSC 检查）  
- [ ] 页脚 Contact 邮箱与 Creem 商家邮箱一致  
- [ ] 站内无面向用户的开发者说明（如 professions.ts 配置提示）  

---

## 9. 与其他增长手段的关系

| 手段 | 与 SEO 关系 | 建议时机 |
|------|-------------|----------|
| Creem 订阅 | 独立；SEO 带来免费用户，部分转化付费 | Live 审核通过后 |
| AdSense | 独立；需要流量 | 有稳定 GSC 展示后 |
| PayPal / Payhip | 非 SEO；个人 PayPal 中国难收软件款 | 暂不优先 |
| 日更博客 | 辅助；质量 &gt; 数量 | 阶段 3，月 1～2 篇即可 |

---

## 10. 预期时间线（ realistic ）

| 时间 | 合理预期 |
|------|----------|
| 1～2 周 | 多页「已收录」；GSC 汇总报表出数 |
| 2～6 周 | 「效果」里出现少量展示 |
| 2～4 月 | 部分长尾词有偶发点击 |
| 4～6 月+ | 可能出现第一笔自然搜索带来的注册/付费 |

SEO 是慢变量；**收录快 ≠ 流量快**。坚持看 GSC 查询词、迭代 `professions.ts` 比频繁改架构更有效。

---

## 11. 每周 10 分钟例行（复制即用）

```
□ GSC → 编制索引 → 网页：已收录数 ___
□ GSC → 效果：展示 ___  点击 ___  （无数据则跳过）
□ 记录 1 个有展示/query 的词，决定是否改 professions.ts
□ （可选）Ahrefs 免费查一次外链数量
□ 不要：批量买链、日更水文、反复提交 sitemap
```

---

## 12. 相关文件索引

| 文件 | 用途 |
|------|------|
| `src/config/professions.ts` | 职业 SEO 文案、启用/下线 |
| `src/app/sitemap.ts` | 生成 sitemap |
| `src/app/robots.ts` | robots.txt |
| `src/config/site.ts` | `getSiteUrl()`、`NEXT_PUBLIC_SUPPORT_EMAIL` |
| `src/components/profession-landing.tsx` | FAQ JSON-LD |
| `src/components/analytics-scripts.tsx` | GA4 + Clarity（env 有值才加载） |
| `env.example` | 环境变量模板 |

---

*最后更新：2026-06-12 · 与 HirePen 当前代码结构一致*
