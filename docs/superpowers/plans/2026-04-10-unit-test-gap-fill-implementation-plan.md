# 单元测试补全 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 识别并补齐当前项目关键逻辑的单元测试缺口，优先覆盖纯函数与状态管理 Hook，确保行为稳定。

**Architecture:** 本次仅新增测试文件，不改业务实现。先聚焦可确定输入输出的核心逻辑，再覆盖乐观更新配置的关键分支，使用现有 Jest + Testing Library 风格保持一致。

**Tech Stack:** TypeScript, Jest (craco test), @testing-library/react-hooks, react-query

---

### Task 1: 盘点测试缺口并确定优先级

**Files:**
- Modify: `src/__tests__/`（新增测试文件）
- Check: `src/utils/reorder.ts`
- Check: `src/utils/index.ts`
- Check: `src/utils/use-undo.ts`
- Check: `src/utils/use-optimistic-options.ts`

- [ ] **Step 1: 列出候选缺口模块**

Run: `rg --files src/utils src/screen`
Expected: 输出待评估模块列表

- [ ] **Step 2: 读取核心模块逻辑**

Run: `Get-Content -Raw src/utils/reorder.ts` 等
Expected: 明确输入输出与边界分支

- [ ] **Step 3: 确定优先补测范围**

优先覆盖：`reorder`、`isFalsy/isVoid/clearObject`、`useUndo`、`useConfig/useAddConfig/useReorderTaskConfig`

### Task 2: 补齐 reorder 与基础工具函数测试

**Files:**
- Create: `src/__tests__/reorder.ts`
- Create: `src/__tests__/utils-index.ts`
- Test: `src/utils/reorder.ts`
- Test: `src/utils/index.ts`

- [ ] **Step 1: 先写失败测试**

覆盖 `before/after`、`referenceId` 为空、`0` 保留、`null/undefined/''` 清理。

- [ ] **Step 2: 运行目标测试确认行为**

Run: `yarn test --watchAll=false src/__tests__/reorder.ts src/__tests__/utils-index.ts`
Expected: PASS

### Task 3: 补齐 useUndo 状态机测试

**Files:**
- Create: `src/__tests__/use-undo.ts`
- Test: `src/utils/use-undo.ts`

- [ ] **Step 1: 写状态流测试**

覆盖初始态、set 记录历史、undo/redo、reset 清空历史与未来栈。

- [ ] **Step 2: 运行目标测试**

Run: `yarn test --watchAll=false src/__tests__/use-undo.ts`
Expected: PASS

### Task 4: 补齐 use-optimistic-options 关键分支测试

**Files:**
- Create: `src/__tests__/use-optimistic-options.ts`
- Test: `src/utils/use-optimistic-options.ts`

- [ ] **Step 1: 写 QueryClient 驱动测试**

覆盖 `onMutate` 缓存更新、`onError` 回滚、`useAddConfig` 自动补 id、`useReorderTaskConfig` 同步更新 `kanbanId`。

- [ ] **Step 2: 运行目标测试**

Run: `yarn test --watchAll=false src/__tests__/use-optimistic-options.ts`
Expected: PASS

### Task 5: 回归验证

**Files:**
- Test: `src/__tests__/reorder.ts`
- Test: `src/__tests__/utils-index.ts`
- Test: `src/__tests__/use-undo.ts`
- Test: `src/__tests__/use-optimistic-options.ts`

- [ ] **Step 1: 汇总执行新增测试**

Run: `yarn test --watchAll=false src/__tests__/reorder.ts src/__tests__/utils-index.ts src/__tests__/use-undo.ts src/__tests__/use-optimistic-options.ts`
Expected: PASS
