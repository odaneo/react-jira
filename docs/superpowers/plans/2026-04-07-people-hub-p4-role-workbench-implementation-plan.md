# People Hub P4 Role Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 在 People Hub 上增加角色化视图，支持管理者和成员两种工作台

**Architecture:** 通过 URL 参数控制视图模式，不做后端权限改造。复用 P2 P3 的面板和模型，按角色组合展示。

**Tech Stack:** React TypeScript react-router react-query antd msw playwright

---

### Task 1 角色视图状态

**Files:**
- Create: `src/screen/people/role-mode.ts`
- Modify: `src/screen/people/index.tsx`
- Modify: `src/screen/people/util.ts`

- [ ] **Step 1: 写失败测试 角色切换与 URL 同步**
Test file: `src/__tests__/people-role-mode.tsx`

- [ ] **Step 2: 跑测试确认失败**
Run: `yarn test --watchAll=false src/__tests__/people-role-mode.tsx`
Expected: FAIL

- [ ] **Step 3: 最小实现通过测试**
实现要点
- URL 参数 `role=manager|member`
- 页面刷新后角色保持
- 默认 manager

- [ ] **Step 4: 跑测试确认通过**
Run: `yarn test --watchAll=false src/__tests__/people-role-mode.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

### Task 2 管理者与成员视图编排

**Files:**
- Create: `src/screen/people/workbench-manager.tsx`
- Create: `src/screen/people/workbench-member.tsx`
- Modify: `src/screen/people/index.tsx`
- Reuse: `src/screen/people/detail-panels.tsx`
- Reuse: `src/screen/people/insights-cards.tsx`

- [ ] **Step 1: 写失败测试 两种视图内容差异**
Test file: `src/__tests__/people-workbench-views.tsx`

测试要点
- manager 默认看到团队指标和风险排行
- member 默认看到个人任务和最近项目

- [ ] **Step 2: 跑测试确认失败**
Run: `yarn test --watchAll=false src/__tests__/people-workbench-views.tsx`
Expected: FAIL

- [ ] **Step 3: 最小实现通过测试**
实现要点
- manager 组合 P3 指标卡与团队面板
- member 组合 P2 个人协作面板
- 保持单页切换，不新增一级路由

- [ ] **Step 4: 跑测试确认通过**
Run: `yarn test --watchAll=false src/__tests__/people-workbench-views.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

### Task 3 全链路验收

**Files:**
- Create: `scripts/playwright-people-p4-role-workbench.js`
- Modify: `api/users.md`

- [ ] **Step 1: 先跑单元测试**
Run: `yarn test --watchAll=false src/__tests__/people-role-mode.tsx src/__tests__/people-workbench-views.tsx`
Expected: PASS

- [ ] **Step 2: 跑 e2e**
Run: `node scripts/playwright-people-p4-role-workbench.js`
Expected: PASS

- [ ] **Step 3: 同步 API 文档并提交**
说明
- 仅更新 users 相关已使用状态与页面映射说明
