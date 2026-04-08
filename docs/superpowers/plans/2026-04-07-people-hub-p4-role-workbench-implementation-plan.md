# People Hub P4 Role Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development recommended or superpowers:executing-plans to implement this plan task-by-task. REQUIRED UIUX SKILL: Use UIUXPROMAX for color interaction and layout decisions. Steps use checkbox syntax for tracking.

**Goal:** 实现管理者和成员两种角色视图，形成统一人员工作台

**Architecture:** 使用 URL 参数控制角色模式，复用 P2 P3 组件并按角色重组。避免权限系统改造，只做前端视图策略。

**Tech Stack:** React TypeScript react-router react-query antd msw playwright framer-motion clsx

---

## UIUX 设计范围

### 色彩
- 角色识别色
  - 管理者 `#0F766E`
  - 成员 `#1D4ED8`
- 角色切换时仅改变局部强调色，保持整体一致

### 布局
- 顶部角色切换条
- 主体区域按角色展示不同信息密度
- 管理者偏总览和风险，成员偏任务和行动

### 交互
- 角色切换保留当前筛选条件
- 进入页面默认管理者，可通过 URL 覆盖
- 切换动画时长控制在 200ms 到 300ms

### 文案
- 页面可见文案统一使用中文，不新增英文标题 按钮 占位符 空态和状态文案

## 文件结构
- Create: `src/screen/people/role-mode.ts`
- Modify: `src/screen/people/index.tsx`
- Create: `src/screen/people/workbench-manager.tsx`
- Create: `src/screen/people/workbench-member.tsx`
- Create: `src/screen/people/workbench-layout.tsx`
- Create: `src/screen/people/workbench-styles.ts`
- Create: `src/__tests__/people-role-mode.tsx`
- Create: `src/__tests__/people-workbench-views.tsx`
- Create: `scripts/playwright-people-p4-role-workbench.js`
- Modify: `api/users.md`

### Task 1 角色状态与路由
- [ ] Step 1 写失败测试 role URL 同步
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-role-mode.tsx` 确认失败
- [ ] Step 3 实现角色状态管理
- [ ] Step 4 测试通过
- [ ] Step 5 提交

### Task 2 角色视图编排
- [ ] Step 1 写失败测试 manager member 视图差异
- [ ] Step 2 运行 `yarn test --watchAll=false src/__tests__/people-workbench-views.tsx` 确认失败
- [ ] Step 3 实现双视图页面
- [ ] Step 4 测试通过
- [ ] Step 5 提交

### Task 3 动画与交互完善
- [ ] Step 1 写失败测试 角色切换状态保持
- [ ] Step 2 运行对应测试确认失败
- [ ] Step 3 引入 `framer-motion` 完成切换动画
- [ ] Step 4 测试通过并人工检查
- [ ] Step 5 提交

### Task 4 验收
- [ ] Step 1 先运行本期单元测试
- [ ] Step 2 执行 `node scripts/playwright-people-p4-role-workbench.js`
- [ ] Step 3 同步 `api/users.md` 使用说明
- [ ] Step 4 提交

