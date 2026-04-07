# People Hub P1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 新增人员中心入口和用户列表页，完成 users 只读管理基础能力

**Architecture:** 复用现有 `useUsers` 查询能力，新增 `people` 路由与页面模块。UI 与现有项目列表风格保持一致，避免引入新状态管理。

**Tech Stack:** React TypeScript react-router react-query antd msw playwright

---

### Task 1 路由与导航接入

**Files:**
- Modify: `src/authenticated-app.tsx`
- Create: `src/screen/people/index.tsx`

- [ ] **Step 1: 写失败测试 路由可达**

Test file: `src/__tests__/people-route.tsx`

测试要点
- 访问 `/people` 可以渲染人员中心标题
- 从主布局可见入口文案

- [ ] **Step 2: 运行测试并确认失败**

Run: `yarn test --watchAll=false src/__tests__/people-route.tsx`
Expected: FAIL 出现路由或页面不存在

- [ ] **Step 3: 最小实现通过测试**

实现要点
- 在 `authenticated-app.tsx` 增加 `<Route path={'/people'} ...>`
- 在头部区域增加跳转按钮或链接
- 新建 `people/index.tsx` 先输出页面壳与标题

- [ ] **Step 4: 再跑测试确认通过**

Run: `yarn test --watchAll=false src/__tests__/people-route.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

Run:
`git add src/authenticated-app.tsx src/screen/people/index.tsx src/__tests__/people-route.tsx`
`git commit -m "feat: add people route and entry"`

### Task 2 用户列表与筛选

**Files:**
- Create: `src/screen/people/list.tsx`
- Create: `src/screen/people/search-panel.tsx`
- Create: `src/screen/people/util.ts`
- Modify: `src/screen/people/index.tsx`
- Reuse: `src/utils/users.ts`

- [ ] **Step 1: 写失败测试 列表和筛选行为**

Test file: `src/__tests__/people-list.tsx`

测试要点
- 初始渲染用户列表
- 输入姓名筛选参数会触发 `useUsers` 新查询键
- 空结果时展示空态

- [ ] **Step 2: 运行测试并确认失败**

Run: `yarn test --watchAll=false src/__tests__/people-list.tsx`
Expected: FAIL 出现组件未实现或断言失败

- [ ] **Step 3: 最小实现通过测试**

实现要点
- `search-panel.tsx` 放姓名和组织筛选
- `util.ts` 管理 URL 查询参数
- `list.tsx` 使用 antd Table 渲染 id name organization created
- `index.tsx` 组织搜索和列表

- [ ] **Step 4: 再跑测试确认通过**

Run: `yarn test --watchAll=false src/__tests__/people-list.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

Run:
`git add src/screen/people src/__tests__/people-list.tsx`
`git commit -m "feat: add people list and filters"`

### Task 3 接口契约与 e2e 冒烟

**Files:**
- Modify: `src/__tests__/api-used-routes-contract.tsx`
- Create: `scripts/playwright-people-p1-smoke.js`
- Modify: `api/users.md`

- [ ] **Step 1: 写失败测试 users 列表查询契约**

测试要点
- `GET /users` 支持 name organization 查询参数
- 返回数组字段满足页面使用字段

- [ ] **Step 2: 运行测试并确认失败**

Run: `yarn test --watchAll=false src/__tests__/api-used-routes-contract.tsx`
Expected: FAIL 出现新增断言失败

- [ ] **Step 3: 补齐测试和脚本**

实现要点
- 在契约测试中新增 users 场景
- playwright 脚本覆盖 打开 people 页 搜索 查看结果
- 如 `api/users.md` 的已使用说明与实际不一致，同步更新

- [ ] **Step 4: 验证通过**

Run:
`yarn test --watchAll=false src/__tests__/api-used-routes-contract.tsx src/__tests__/people-route.tsx src/__tests__/people-list.tsx`
`node scripts/playwright-people-p1-smoke.js`
Expected: 全部 PASS

- [ ] **Step 5: 提交**

Run:
`git add src/__tests__/api-used-routes-contract.tsx scripts/playwright-people-p1-smoke.js api/users.md`
`git commit -m "test: add users contract and people p1 e2e smoke"`
