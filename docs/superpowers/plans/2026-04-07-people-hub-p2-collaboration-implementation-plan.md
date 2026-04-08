# People Hub P2 Collaboration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. REQUIRED UIUX SKILL: Use UIUXPROMAX for color interaction and layout decisions. Steps use checkbox syntax for tracking.

**Goal:** 新增用户详情协作页，串联用户 项目 任务 看板 Epic

**Architecture:** 以 `userId` 为上下文键，组合 `users projects tasks epics` 查询。详情页拆为资料区 协作区 动作区，保证数据和交互清晰。

**Tech Stack:** React TypeScript react-router react-query antd msw playwright clsx

---

## UIUX 设计范围

### 色彩
- 协作页增加状态色
  - 在制 `#2563EB`
  - 阻塞 `#DC2626`
  - 已完成 `#16A34A`

### 布局
- 上区 用户信息与关键统计
- 中区 协作面板 我负责 我汇报 我参与项目
- 下区 快捷跳转到项目看板和 Epic

### 交互
- 面板支持折叠与展开
- 点击任务和项目可跳转并保留返回入口
- 列表支持按项目和状态二级筛选

### 文案
- 页面可见文案统一使用中文，不新增英文标题 按钮 占位符 空态和状态文案

## 文件结构
- Modify: `src/authenticated-app.tsx`
- Modify: `src/screen/people/list.tsx`
- Create: `src/screen/people/detail.tsx`
- Create: `src/screen/people/detail-panels.tsx`
- Create: `src/screen/people/detail-actions.tsx`
- Create: `src/screen/people/detail-styles.ts`
- Create: `src/__tests__/people-detail-route.tsx`
- Create: `src/__tests__/people-collaboration-panels.tsx`
- Create: `scripts/playwright-people-p2-collaboration.js`

### Task 1 详情路由和壳层
- [ ] Step 1 写失败测试 `/people/:userId`
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-detail-route.tsx` 确认失败
- [ ] Step 3 实现详情路由与基础区块
- [ ] Step 4 测试通过
- [ ] Step 5 提交

### Task 2 协作数据和面板
- [ ] Step 1 写失败测试 过滤和分组逻辑
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-collaboration-panels.tsx` 确认失败
- [ ] Step 3 实现协作面板和跳转
- [ ] Step 4 测试通过
- [ ] Step 5 提交

### Task 3 交互优化
- [ ] Step 1 写失败测试 折叠状态和筛选状态
- [ ] Step 2 运行对应测试确认失败
- [ ] Step 3 实现折叠 筛选 反馈
- [ ] Step 4 测试通过并人工检查
- [ ] Step 5 提交

### Task 4 e2e 冒烟
- [ ] Step 1 先运行本期所有单元测试
- [ ] Step 2 执行 `node scripts/playwright-people-p2-collaboration.js`
- [ ] Step 3 修正问题后再跑一次
- [ ] Step 4 提交

