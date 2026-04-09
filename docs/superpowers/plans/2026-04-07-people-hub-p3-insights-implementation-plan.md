# People Hub P3 Insights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. REQUIRED UIUX SKILL: Use UIUXPROMAX for color interaction and layout decisions. Steps use checkbox syntax for tracking.

**Goal:** 新增人员分析页，提供负载 进度 风险的可视化分析

**Architecture:** 保持读接口方案，通过纯函数模型计算指标。图表和卡片分离，保证可测性和样式一致性。

**Tech Stack:** React TypeScript react-query antd msw playwright recharts clsx

---

## UIUX 设计范围

### 色彩
- 指标卡色阶
  - 正常 `#16A34A`
  - 关注 `#D97706`
  - 风险 `#DC2626`
- 图表系列色
  - `#1D4ED8 #0891B2 #7C3AED #EA580C`

### 布局
- 顶部筛选条 时间范围 项目 用户组
- 中部 KPI 卡片网格
- 下部图表区 负载分布 趋势 风险排行

### 交互
- hover 展示详细数值
- 点击图表项联动右侧明细表
- 筛选变化时保持图表平滑更新

### 文案
- 页面可见文案统一使用中文，不新增英文标题 按钮 占位符 空态和状态文案

## 文件结构
- Modify: `src/screen/people/index.tsx`
- Create: `src/screen/people/insights.tsx`
- Create: `src/screen/people/insights-model.ts`
- Create: `src/screen/people/insights-cards.tsx`
- Create: `src/screen/people/insights-charts.tsx`
- Create: `src/screen/people/insights-styles.ts`
- Create: `src/__tests__/people-insights-route.tsx`
- Create: `src/__tests__/people-insights-model.ts`
- Create: `scripts/playwright-people-p3-insights.js`

### Task 1 分析页骨架
- [ ] Step 1 写失败测试 路由和筛选区渲染
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-insights-route.tsx` 确认失败
- [ ] Step 3 实现页面骨架
- [ ] Step 4 测试通过
- [ ] Step 5 提交

### Task 2 指标模型
- [ ] Step 1 写失败测试 指标纯函数
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-insights-model.ts` 确认失败
- [ ] Step 3 实现指标计算
- [ ] Step 4 测试通过
- [ ] Step 5 提交

### Task 3 图表与联动
- [ ] Step 1 写失败测试 图表数据映射和联动
- [ ] Step 2 运行对应测试确认失败
- [ ] Step 3 引入 `recharts` 完成图表
- [ ] Step 4 测试通过并人工验收
- [ ] Step 5 提交

### Task 4 e2e 冒烟
- [ ] Step 1 先跑本期单元测试
- [ ] Step 2 执行 `node scripts/playwright-people-p3-insights.js`
- [ ] Step 3 修正后复跑
- [ ] Step 4 提交

