# People Hub 分期实施总计划

## 目标

从人员中心单页逐步演进到角色化工作台。每一期都可独立上线，并且包含明确的 UIUX 设计约束。

## 分期结构

### P1 人员中心基础
- 新增 People Hub 入口
- 完成 users 列表 筛选 空态
- 建立统一视觉变量和页面骨架

### P2 协作联动
- 用户详情联动项目 任务 看板 Epic
- 建立跨模块跳转与上下文回流
- 补齐详情页的信息层级和交互规范

### P3 分析洞察
- 增加用户负载 进度 风险视图
- 引入轻量图表和数据卡片
- 形成可比较可筛选的分析体验

### P4 角色化工作台
- 同一入口支持管理者与成员视图
- 按角色切换信息优先级
- 形成管理 决策 执行闭环

## UIUX 总原则

### 颜色
- 延续现有 Ant Design 基础色，避免推翻全局主题
- 在 People Hub 局部定义 token，确保不影响其他页面
- 建议色板
  - 主色 `#1D4ED8`
  - 成功 `#16A34A`
  - 警示 `#D97706`
  - 风险 `#DC2626`
  - 中性色 `#0F172A #334155 #94A3B8 #E2E8F0`

### 布局
- 桌面端采用 12 列思路，移动端单列
- 列表和详情采用左右分区，分析页采用卡片网格
- 保持主要内容区最大宽度，减少超宽阅读疲劳

### 交互
- 所有筛选器支持 URL 同步
- 所有跨页跳转保留回到上一视图的入口
- 所有异步态包含 loading 空态 错误态
- 关键动作提供即时反馈

### 文案
- 页面可见文案统一使用中文，不新增英文标题 按钮 占位符 空态和状态文案

### 可选第三方包
- `recharts` 用于趋势和分布图
- `framer-motion` 用于页面切换和卡片入场动画
- `clsx` 用于状态样式组合

引入边界
- 仅在 People Hub 模块内使用
- 不替换现有全局组件体系
- 新包先加单元测试和最小 e2e 冒烟

## 执行规则
- 每一期都先单元测试，再执行 e2e
- 每一期结束同步更新 `api/users.md` 与计划勾选状态
- 如新增依赖，先在计划对应期内落地并验证

## 对应计划文件
- `docs/superpowers/plans/2026-04-07-people-hub-p1-foundation-implementation-plan.md`
- `docs/superpowers/plans/2026-04-07-people-hub-p2-collaboration-implementation-plan.md`
- `docs/superpowers/plans/2026-04-07-people-hub-p3-insights-implementation-plan.md`
- `docs/superpowers/plans/2026-04-07-people-hub-p4-role-workbench-implementation-plan.md`
