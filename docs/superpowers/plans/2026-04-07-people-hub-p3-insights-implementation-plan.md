# People Hub P3 Insights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 新增人员分析页，提供负载完成风险三类指标

**Architecture:** 继续复用 `users tasks projects epics` 读接口，在前端构建分析模型。分析页与详情页共享统计函数，避免重复定义。

**Tech Stack:** React TypeScript react-query antd msw playwright

---

### Task 1 分析路由与页面骨架

**Files:**
- Modify: `src/authenticated-app.tsx`
- Modify: `src/screen/people/index.tsx`
- Create: `src/screen/people/insights.tsx`

- [ ] **Step 1: 写失败测试 insights 路由可达**
Test file: `src/__tests__/people-insights-route.tsx`

- [ ] **Step 2: 跑测试确认失败**
Run: `yarn test --watchAll=false src/__tests__/people-insights-route.tsx`
Expected: FAIL

- [ ] **Step 3: 最小实现**
实现要点
- 在 people 模块内加二级页签 总览 协作 分析
- 完成 `insights.tsx` 空骨架和筛选区

- [ ] **Step 4: 跑测试确认通过**
Run: `yarn test --watchAll=false src/__tests__/people-insights-route.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

### Task 2 指标模型与可视化

**Files:**
- Create: `src/screen/people/insights-model.ts`
- Modify: `src/screen/people/insights.tsx`
- Create: `src/screen/people/insights-cards.tsx`

- [ ] **Step 1: 写失败测试 指标计算**
Test file: `src/__tests__/people-insights-model.ts`

指标范围
- 人均在制任务数
- 超阈值负载人数
- 无 Epic 任务占比
- 按任务类型分布

- [ ] **Step 2: 跑测试确认失败**
Run: `yarn test --watchAll=false src/__tests__/people-insights-model.ts`
Expected: FAIL

- [ ] **Step 3: 最小实现通过测试**
实现要点
- 指标函数全部纯函数
- UI 先用表格和统计卡，不引入新图表库

- [ ] **Step 4: 跑测试确认通过**
Run: `yarn test --watchAll=false src/__tests__/people-insights-model.ts`
Expected: PASS

- [ ] **Step 5: 提交**

### Task 3 e2e 分析页冒烟

**Files:**
- Create: `scripts/playwright-people-p3-insights.js`

- [ ] **Step 1: 先跑单元测试**
Run: `yarn test --watchAll=false src/__tests__/people-insights-route.tsx src/__tests__/people-insights-model.ts`
Expected: PASS

- [ ] **Step 2: 跑 e2e**
Run: `node scripts/playwright-people-p3-insights.js`
Expected: PASS

- [ ] **Step 3: 提交**
