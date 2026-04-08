# People Hub P1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. REQUIRED UIUX SKILL: Use UIUXPROMAX for color interaction and layout decisions. Steps use checkbox syntax for tracking.

**Goal:** 新增人员中心入口和用户列表页，建立可复用的 UI 设计基线

**Architecture:** 复用 `useUsers` 读取接口，新增 `people` 路由和页面模块。UI 在现有 antd 体系上做局部增强，不改全局主题。

**Tech Stack:** React TypeScript react-router react-query antd msw playwright clsx

---

## UIUX 设计范围

### 色彩
- 人员中心局部 token
  - `--people-primary: #1D4ED8`
  - `--people-bg: #F8FAFC`
  - `--people-card: #FFFFFF`
  - `--people-text: #0F172A`
  - `--people-subtext: #475569`

### 布局
- 页面头部 区域筛选区 列表区
- 列表上方固定操作条，包含搜索和过滤
- 桌面端左右留白，移动端改为纵向堆叠

### 交互
- 搜索输入 300ms 防抖
- 筛选变更写入 URL
- 表格 loading 空态 错误态明确

### 文案
- 页面可见文案统一使用中文，不新增英文标题 按钮 占位符 空态和状态文案

## 文件结构
- Modify: `src/authenticated-app.tsx`
- Create: `src/screen/people/index.tsx`
- Create: `src/screen/people/list.tsx`
- Create: `src/screen/people/search-panel.tsx`
- Create: `src/screen/people/util.ts`
- Create: `src/screen/people/styles.ts`
- Create: `src/__tests__/people-route.tsx`
- Create: `src/__tests__/people-list.tsx`
- Create: `scripts/playwright-people-p1-smoke.js`
- Modify: `src/__tests__/api-used-routes-contract.tsx`
- Modify: `api/users.md`

### Task 1 路由和入口
- [ ] Step 1 写失败测试 路由与入口展示
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-route.tsx` 确认失败
- [ ] Step 3 最小实现路由和入口
- [ ] Step 4 运行同一测试确认通过
- [ ] Step 5 提交

### Task 2 列表与筛选
- [ ] Step 1 写失败测试 列表渲染和筛选 URL 同步
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-list.tsx` 确认失败
- [ ] Step 3 实现列表 筛选 空态
- [ ] Step 4 运行同一测试确认通过
- [ ] Step 5 提交

### Task 3 UI 基线样式
- [ ] Step 1 写失败测试 关键样式类存在与状态切换
- [ ] Step 2 运行对应测试确认失败
- [ ] Step 3 在 `styles.ts` 实现局部 token 和布局
- [ ] Step 4 测试通过并人工检查 3000 端页面
- [ ] Step 5 提交

### Task 4 契约与 e2e
- [ ] Step 1 新增 users 查询契约单元测试
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/api-used-routes-contract.tsx` 确认通过
- [ ] Step 3 执行 `node scripts/playwright-people-p1-smoke.js`
- [ ] Step 4 同步 `api/users.md`
- [ ] Step 5 提交

