# 已使用 API 全量对齐实施计划

> **给执行 Agent：** 必须使用 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans` 按任务清单逐步执行，步骤使用 `- [ ]` 勾选。

**目标：** 仅针对 `api/*.md` 中标记为已使用且非 user 相关接口，完成前端类型、请求参数、页面交互、筛选、回显能力的全量对齐。界面与 API 契约必须一致，不能只做数据层补丁。

**架构：** 先收敛类型与查询参数边界，再补齐界面输入和回显，最后通过单测和 e2e 验证全链路。

**技术栈：** React 17、TypeScript、React Query、Ant Design、msw、Playwright。

---

## 范围确认

本次只覆盖以下已使用接口

- `GET /projects`
- `GET /projects/:id`
- `POST /projects`
- `PATCH /projects/:id`
- `DELETE /projects/:id`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/reorder`
- `GET /kanbans`
- `POST /kanbans`
- `DELETE /kanbans/:id`
- `POST /kanbans/reorder`
- `GET /epics`
- `GET /epics/:id`
- `POST /epics`
- `PATCH /epics/:id`
- `DELETE /epics/:id`
- `GET /taskTypes`

明确不做

- 所有 user 相关接口改造
  - `GET /me`
  - `POST /login`
  - `POST /register`
  - `GET /users`
- `unused.md` 中 persons 和 tags 全部接口
- 标记未使用接口

---

## 排查结论 界面需补全项

### 任务相关

- 创建任务仅支持 `name`，缺少 API 已支持且业务相关字段输入
  - `epicId`
  - `processorId`
  - `reporterId`
  - `typeId`
  - `note`
  - `favorite`
- 编辑任务弹窗缺少
  - `epicId`
  - `reporterId`
  - `note`
  - `favorite`
- 任务筛选缺少 API 查询项入口
  - `epicId` 只有 URL 支持，没有显式控件
  - `reporterId` 无筛选控件

### 任务组相关

- 任务组新建/编辑缺少 API 字段输入
  - `start`
  - `end`
- 任务组列表缺少时间信息回显
  - `start`
  - `end`

### 项目相关

- 项目列表筛选未覆盖 API 查询项中常用字段
  - `organization`
  - `pin`

---

### 任务 1 类型和参数边界对齐

**文件：**
- 修改 `src/types/project.ts`
- 修改 `src/types/task.ts`
- 修改 `src/types/kanban.ts`
- 修改 `src/types/epic.ts`
- 修改 `src/types/task-type.ts`
- 修改 `src/utils/project.ts`
- 修改 `src/utils/task.ts`
- 修改 `src/utils/epic.ts`
- 修改 `src/utils/kanban.ts`

- [ ] 步骤 1 按 API 文档补齐实体字段和可选性
- [ ] 步骤 2 收敛查询参数，只保留后端支持字段
- [ ] 步骤 3 修正 `useTask` 返回类型
- [ ] 步骤 4 运行 `yarn test --watchAll=false src/__tests__/http.ts src/__tests__/project-query-key.tsx src/__tests__/query-client-config.tsx`
- [ ] 步骤 5 提交 commit

### 任务 2 任务创建界面补全

**文件：**
- 修改 `src/screen/kanban/create-task.tsx`
- 新增或修改 `src/components/epic-select.tsx`
- 必要时修改 `src/components/id-select.tsx`
- 必要时修改 `src/screen/kanban/util.ts`

- [ ] 步骤 1 把创建任务从“仅输入名称”升级为可录入关键字段
- [ ] 步骤 2 增加 `epicId` 选择并支持从 URL `epicId` 默认带入
- [ ] 步骤 3 增加 `processorId` `reporterId` `typeId` `note` `favorite` 输入
- [ ] 步骤 4 创建请求仅提交有值字段，避免空值污染
- [ ] 步骤 5 运行 `yarn test --watchAll=false src/__tests__/project-list.tsx`
- [ ] 步骤 6 提交 commit

### 任务 3 任务编辑界面补全

**文件：**
- 修改 `src/screen/kanban/task-modal.tsx`
- 新增或修改 `src/components/epic-select.tsx`

- [ ] 步骤 1 在编辑弹窗补齐 `epicId` `reporterId` `note` `favorite`
- [ ] 步骤 2 保持 `processorId` `typeId` 与新增字段统一回显
- [ ] 步骤 3 PATCH 请求能正确更新新增字段
- [ ] 步骤 4 运行 `yarn test --watchAll=false src/__tests__/http.ts`
- [ ] 步骤 5 提交 commit

### 任务 4 任务筛选界面补全

**文件：**
- 修改 `src/screen/kanban/search-panel.tsx`
- 修改 `src/screen/kanban/util.ts`

- [ ] 步骤 1 增加 `epicId` 显式筛选控件
- [ ] 步骤 2 增加 `reporterId` 筛选控件
- [ ] 步骤 3 保证重置逻辑与查询参数一致
- [ ] 步骤 4 运行 `yarn test --watchAll=false src/__tests__/project-query-key.tsx`
- [ ] 步骤 5 提交 commit

### 任务 5 任务组时间字段补全

**文件：**
- 修改 `src/screen/epic/epic-modal.tsx`
- 修改 `src/screen/epic/list.tsx`
- 修改 `src/screen/epic/epic-task-preview.tsx`
- 修改 `src/screen/epic/index.tsx`

- [ ] 步骤 1 在任务组新建编辑增加 `start` `end` 输入
- [ ] 步骤 2 校验时间输入格式并在请求中传递
- [ ] 步骤 3 在任务组列表增加起止时间回显
- [ ] 步骤 4 保持任务组详情预览与时间信息一致
- [ ] 步骤 5 运行 `yarn test --watchAll=false src/__tests__/project-list.tsx`
- [ ] 步骤 6 提交 commit

### 任务 6 项目筛选补全

**文件：**
- 修改 `src/screen/project-list/search-panel.tsx`
- 修改 `src/screen/project-list/util.ts`

- [ ] 步骤 1 增加 `organization` 筛选输入
- [ ] 步骤 2 增加 `pin` 筛选控件
- [ ] 步骤 3 保证查询参数与 `GET /projects` 定义一致
- [ ] 步骤 4 运行 `yarn test --watchAll=false src/__tests__/project-list.tsx`
- [ ] 步骤 5 提交 commit

### 任务 7 API 契约单元测试补齐

**文件：**
- 修改 `src/__tests__/api-used-routes-contract.tsx`
- 修改 `src/setupTests.ts`
- 必要时修改 `src/App.test.tsx`

- [ ] 步骤 1 增加 `task` 创建编辑新增字段断言
- [ ] 步骤 2 增加 `epic` 时间字段断言
- [ ] 步骤 3 增加项目筛选参数断言
- [ ] 步骤 4 修复阻断测试执行的基础问题
- [ ] 步骤 5 运行 `yarn test --watchAll=false src/__tests__/api-used-routes-contract.tsx`
- [ ] 步骤 6 提交 commit

### 任务 8 e2e 前单元测试闸门

**文件：**
- 无新增文件

- [ ] 步骤 1 运行 `yarn test --watchAll=false src/__tests__/api-used-routes-contract.tsx`
- [ ] 步骤 2 运行 `yarn test --watchAll=false src/__tests__/http.ts src/__tests__/project-query-key.tsx src/__tests__/query-client-config.tsx`
- [ ] 步骤 3 运行 `yarn test --watchAll=false`
- [ ] 步骤 4 全部通过后进入 e2e

### 任务 9 e2e 回归

**文件：**
- 修改 `scripts/playwright-epic-check.js`
- 修改 `scripts/playwright-used-api-check.js`

- [ ] 步骤 1 覆盖项目 看板 任务 任务组主流程
- [ ] 步骤 2 覆盖任务创建与编辑的 `epicId` `reporterId` `note` `favorite`
- [ ] 步骤 3 覆盖任务组 `start` `end` 创建和编辑
- [ ] 步骤 4 运行 `node scripts/playwright-epic-check.js`
- [ ] 步骤 5 运行 `node scripts/playwright-used-api-check.js`
- [ ] 步骤 6 提交 commit

### 任务 10 总体验收

**文件：**
- 无新增文件，验收结论写回计划末尾

- [ ] 步骤 1 手工回归项目页 看板页 任务组页
- [ ] 步骤 2 逐项核对“排查结论”中的界面补全项
- [ ] 步骤 3 记录剩余风险
- [ ] 步骤 4 提交收尾 commit

---

## 实施顺序建议

1. 先做类型与参数边界
2. 再做任务创建编辑和筛选补全
3. 再做任务组和项目筛选补全
4. 补单元测试并通过闸门
5. 最后跑 e2e 和手工回归

## 风险点

- 创建任务字段增加后，快速录入效率可能下降，需要保留简洁交互
- `epicId` 默认带入逻辑要避免误绑定
- e2e 对本地服务稳定性敏感，执行前必须做端口就绪检查
