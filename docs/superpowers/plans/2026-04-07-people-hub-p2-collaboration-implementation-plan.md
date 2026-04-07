# People Hub P2 Collaboration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 新增用户详情协作页，展示用户与项目任务看板关系

**Architecture:** 详情页使用 `userId` 作为主键，通过并行查询组合 `users projects tasks` 数据，在前端完成分组与聚合，不新增后端接口。

**Tech Stack:** React TypeScript react-router react-query antd msw playwright

---

### Task 1 用户详情路由与基础布局

**Files:**
- Modify: `src/authenticated-app.tsx`
- Modify: `src/screen/people/list.tsx`
- Create: `src/screen/people/detail.tsx`

- [ ] **Step 1: 写失败测试 用户详情路由**
Test file: `src/__tests__/people-detail-route.tsx`

- [ ] **Step 2: 运行测试并确认失败**
Run: `yarn test --watchAll=false src/__tests__/people-detail-route.tsx`
Expected: FAIL

- [ ] **Step 3: 最小实现通过测试**
实现要点
- 增加 `/people/:userId`
- 列表姓名列可点击跳详情
- 详情页先渲染用户基础信息卡片

- [ ] **Step 4: 再跑测试确认通过**
Run: `yarn test --watchAll=false src/__tests__/people-detail-route.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

### Task 2 协作数据联动

**Files:**
- Modify: `src/screen/people/detail.tsx`
- Create: `src/screen/people/detail-panels.tsx`
- Reuse: `src/utils/users.ts`
- Reuse: `src/utils/project.ts`
- Reuse: `src/utils/task.ts`

- [ ] **Step 1: 写失败测试 协作面板数据正确性**
Test file: `src/__tests__/people-collaboration-panels.tsx`

测试要点
- 我负责任务 processorId 过滤正确
- 我汇报任务 reporterId 过滤正确
- 我负责项目 personId 过滤正确

- [ ] **Step 2: 运行测试并确认失败**
Run: `yarn test --watchAll=false src/__tests__/people-collaboration-panels.tsx`
Expected: FAIL

- [ ] **Step 3: 最小实现通过测试**
实现要点
- 详情页并行拉取 tasks projects
- 纯函数做过滤与统计，避免组件内重复逻辑
- 面板支持点击跳转到对应项目看板

- [ ] **Step 4: 再跑测试确认通过**
Run: `yarn test --watchAll=false src/__tests__/people-collaboration-panels.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

### Task 3 e2e 协作链路

**Files:**
- Create: `scripts/playwright-people-p2-collaboration.js`

- [ ] **Step 1: 先补单元测试再跑 e2e**
Run: `yarn test --watchAll=false src/__tests__/people-detail-route.tsx src/__tests__/people-collaboration-panels.tsx`
Expected: PASS

- [ ] **Step 2: 执行 e2e**
Run: `node scripts/playwright-people-p2-collaboration.js`
Expected: PASS

- [ ] **Step 3: 提交**
