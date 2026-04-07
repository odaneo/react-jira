# React Jira UI风格与配色方案对比

更新时间：2026-04-07  
范围：仅探索风格与配色，不引入额外 CSS/JS 包，基于当前 `antd + emotion + craco-less` 体系。

## 现状基线

- 当前主色：`@primary-color: rgb(0,82,204)`，视觉上接近 Jira 蓝
- 页面结构：信息密度偏高，强调任务与表格可读性
- 已有硬编码色：`rgb(244,245,247)`、`#257AFD`、浅阴影
- 当前问题：
1. 页面层次主要靠背景灰和阴影，层级区分偏弱
2. 交互强调不一致，链接蓝与主色蓝略有偏差
3. 头部、侧栏、内容区风格统一度一般

## 方案筛选依据

来源：`ui-ux-pro-max` 数据集中的 `products.csv`、`ui-reasoning.csv`、`styles.csv`、`colors.csv`、`typography.csv`、`ux-guidelines.csv`。  
目标类型匹配：`SaaS (General)`、`Productivity Tool`、`B2B Service`。  
约束：不引入新包，仅调整主题变量和少量现有样式。

## 方案A 专业效率蓝

风格定位：`Minimalism + Flat Design`，稳定、清晰、企业感强。  
适配优先级：高。

配色
- Primary `#2563EB`
- Secondary `#3B82F6`
- CTA `#F97316`
- Background `#F8FAFC`
- Surface `#FFFFFF`
- Text Primary `#1E293B`
- Border `#E2E8F0`
- Success `#22C55E`
- Warning `#F59E0B`
- Error `#EF4444`

页面观感
- 项目列表：更像企业控制台，筛选区与列表区边界清晰
- 看板：列容器更干净，卡片与背景层次更明确
- Epic：与项目列表视觉统一，弱化“拼接感”

实现映射
- `antd modifyVars` 优先调整：
  - `@primary-color: #2563EB`
  - `@link-color: #2563EB`
  - `@success-color: #22C55E`
  - `@warning-color: #F59E0B`
  - `@error-color: #EF4444`
  - `@border-color-base: #E2E8F0`
  - `@component-background: #FFFFFF`
  - `@body-background: #F8FAFC`
  - `@text-color: #1E293B`
  - `@text-color-secondary: #475569`

优点
1. 改动最小，落地最快
2. 与项目管理场景高度匹配
3. 可读性和可维护性最好

风险
1. 风格偏稳，品牌记忆点中等

## 方案B 冷静青绿生产力

风格定位：`Flat Design + Micro-interactions`，偏现代协作工具气质。  
适配优先级：中高。

配色
- Primary `#0D9488`
- Secondary `#14B8A6`
- CTA `#F97316`
- Background `#F0FDFA`
- Surface `#FFFFFF`
- Text Primary `#134E4A`
- Border `#99F6E4`
- Success `#16A34A`
- Warning `#D97706`
- Error `#DC2626`

页面观感
- 项目列表：更轻快，筛选区和操作入口更“工具化”
- 看板：列头与卡片状态区分更明显，适合任务流转感
- Epic：关联关系展示更“流程导向”

实现映射
- `antd modifyVars` 优先调整：
  - `@primary-color: #0D9488`
  - `@link-color: #0D9488`
  - `@success-color: #16A34A`
  - `@warning-color: #D97706`
  - `@error-color: #DC2626`
  - `@border-color-base: #99F6E4`
  - `@component-background: #FFFFFF`
  - `@body-background: #F0FDFA`
  - `@text-color: #134E4A`
  - `@text-color-secondary: #0F766E`

优点
1. 与“任务完成、状态推进”心智更一致
2. 相比蓝色系更有辨识度

风险
1. 若青绿色使用过多，企业感会变弱
2. 需要更严格控制按钮和标签饱和度

## 方案C 深海企业蓝灰

风格定位：`Trust & Authority + Minimal`，偏 B2B Enterprise。  
适配优先级：中。

配色
- Primary `#0F172A`
- Secondary `#334155`
- CTA `#0369A1`
- Background `#F8FAFC`
- Surface `#FFFFFF`
- Text Primary `#020617`
- Border `#CBD5E1`
- Success `#15803D`
- Warning `#B45309`
- Error `#B91C1C`

页面观感
- 项目列表：更正式，偏“企业后台”
- 看板：视觉更克制，强调信息本身
- Epic：结构化感强，但活力偏弱

实现映射
- `antd modifyVars` 优先调整：
  - `@primary-color: #0369A1`
  - `@link-color: #0369A1`
  - `@success-color: #15803D`
  - `@warning-color: #B45309`
  - `@error-color: #B91C1C`
  - `@border-color-base: #CBD5E1`
  - `@component-background: #FFFFFF`
  - `@body-background: #F8FAFC`
  - `@text-color: #020617`
  - `@text-color-secondary: #334155`

优点
1. 最稳重，适合企业场景
2. 复杂信息场景可读性高

风险
1. 可能过于保守
2. 与现有 Jira 感知差异不大

## 三案横向对比

| 维度 | 方案A 专业效率蓝 | 方案B 冷静青绿生产力 | 方案C 深海企业蓝灰 |
|---|---|---|---|
| 视觉一致性 | 高 | 中高 | 高 |
| 可读性 | 高 | 中高 | 高 |
| 品牌辨识度 | 中 | 高 | 中 |
| 实施成本 | 低 | 低-中 | 低 |
| 与现有代码贴合度 | 高 | 中高 | 高 |
| 风险 | 低 | 中 | 低-中 |

## 推荐结论

推荐顺序：`方案A > 方案B > 方案C`

理由
1. 方案A在不加包、不重构组件的前提下，能获得最大收益
2. 方案A最容易统一当前硬编码蓝色与主题蓝，减少视觉噪音
3. 方案B适合后续做品牌差异化增强，作为第二阶段
4. 方案C作为稳妥备选，适用于明确强调“企业合规感”的场景

## 最小改动落地清单

第一批必改
1. `craco.config.js` 的 `modifyVars` 主色与语义色
2. 全局背景/文本/边框 token 对齐
3. 统一 `#257AFD` 与链接色到同一 token

第二批可选
1. 头部阴影和侧栏背景层级微调
2. 看板列容器和卡片边框对比增强
3. 交互动效统一到 `150-250ms`，并保留 `prefers-reduced-motion`

## 不做项

1. 不新增 UI 框架或主题库
2. 不引入字体或图标 npm 包
3. 不改动业务交互逻辑
