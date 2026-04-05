# Epic 页面实现计划

> **给执行型 Agent：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务清单逐步执行。步骤使用 `- [ ]` 勾选格式。

**目标：** 新增 `/projects/{id}/epic` 任务组管理页，用于任务分组与规划；`kanban` 继续只负责流转与进度推进。

**方案：** 严格复用现有项目模式：`ScreenContainer` 页面骨架、`antd Table` 列表、URL 参数驱动页面状态、`react-query` + `utils` 数据层。Epic 页面负责 CRUD 和关联任务快速查看；Kanban 仅补充 `epicId` 过滤联动。

**技术栈：** React 17、React Router v6、React Query、Ant Design、Emotion、现有 `useHttp`/URL 参数工具。

---

## 现有模式对齐

- 页面骨架：参考 `src/screen/kanban/index.tsx` 与 `src/screen/project-list/index.tsx`
- 查询区：复用 kanban 风格（`Row + Input + Select + Reset`）
- 列表：复用 project-list 的 `antd Table`
- 新建/编辑/删除：复用 `Modal + Form` 和 `Modal.confirm`
- 路由：继续使用 `/projects/:projectId/*` 下兄弟路由
- 状态与请求：继续使用 `useUrlQueryParam` + `useQuery/useMutation` + queryKey

## 交互决策

- Epic 列表形态：**Table**（不是 List）
- Epic 新建/编辑：**Modal**（不是 Drawer）
- 关联任务快速查看：**右侧 Drawer**
- Epic 跳 Kanban：`/projects/{id}/kanban?epicId={epicId}`

原因：
- Table 更适配多列字段（名称、任务数、负责人、描述、操作）
- Modal 对 CRUD 更轻量，符合现有代码习惯
- 右侧 Drawer 可保留表格上下文，便于连续查看不同 Epic
- URL Query 便于分享/刷新后保留状态，和现有实现一致

## 文件规划

### 新增文件

- `src/types/epic.ts`
  - Epic 类型定义（id、name、projectId、processorId、description）
- `src/utils/epic.ts`
  - `useEpics`、`useAddEpic`、`useEditEpic`、`useDeleteEpic`
- `src/screen/epic/util.ts`
  - projectId 读取、epic 查询参数、queryKey、弹窗状态、预览状态
- `src/screen/epic/search-panel.tsx`
  - Epic 查询区（名称、负责人、重置）
- `src/screen/epic/list.tsx`
  - Epic 表格与行内操作
- `src/screen/epic/epic-modal.tsx`
  - Epic 新建/编辑弹窗
- `src/screen/epic/epic-task-preview.tsx`
  - 右侧任务预览 Drawer

### 修改文件

- `src/screen/epic/index.tsx`
  - 从占位页替换为完整页面
- `src/screen/kanban/util.ts`
  - 任务查询参数增加 `epicId`
- `src/screen/kanban/search-panel.tsx`
  - reset 时清理 `epicId`（可选补充 Epic 过滤选择）

---

### 任务 1：补齐 Epic 领域类型与数据层

**文件：**
- 新增 `src/types/epic.ts`
- 新增 `src/utils/epic.ts`

- [ ] 步骤 1：定义 Epic 类型
- [ ] 步骤 2：新增 `useEpics(param)` 查询 hook
- [ ] 步骤 3：新增增删改 mutation hooks
- [ ] 步骤 4：确认类型检查通过
- [ ] 步骤 5：提交 commit

### 任务 2：补齐 Epic 页 URL 状态工具

**文件：**
- 新增 `src/screen/epic/util.ts`

- [ ] 步骤 1：复用/实现 projectId 与 project 数据读取
- [ ] 步骤 2：实现 Epic 查询参数（`name`、`processorId`）
- [ ] 步骤 3：实现 Epic queryKey
- [ ] 步骤 4：实现新建/编辑弹窗 URL 状态
- [ ] 步骤 5：实现任务预览 URL 状态
- [ ] 步骤 6：提交 commit

### 任务 3：实现 Epic 查询区

**文件：**
- 新增 `src/screen/epic/search-panel.tsx`

- [ ] 步骤 1：实现与 kanban 同风格的查询区
- [ ] 步骤 2：联动 URL 查询参数
- [ ] 步骤 3：实现重置逻辑
- [ ] 步骤 4：提交 commit

### 任务 4：实现 Epic 表格

**文件：**
- 新增 `src/screen/epic/list.tsx`

- [ ] 步骤 1：实现列：名称、任务数、负责人、描述、操作
- [ ] 步骤 2：计算并展示每个 Epic 的关联任务数
- [ ] 步骤 3：实现行操作：编辑、删除、查看关联任务
- [ ] 步骤 4：实现“跳转看板（带 epicId）”操作
- [ ] 步骤 5：提交 commit

### 任务 5：实现 Epic 新建/编辑弹窗

**文件：**
- 新增 `src/screen/epic/epic-modal.tsx`

- [ ] 步骤 1：实现表单字段：name（必填）、processorId、description（可选）
- [ ] 步骤 2：按编辑态/创建态切换调用 hook
- [ ] 步骤 3：对齐现有 close/reset 行为
- [ ] 步骤 4：提交 commit

### 任务 6：实现关联任务快速查看

**文件：**
- 新增 `src/screen/epic/epic-task-preview.tsx`

- [ ] 步骤 1：实现右侧 Drawer
- [ ] 步骤 2：展示所选 Epic 下任务列表
- [ ] 步骤 3：实现关闭与状态清理
- [ ] 步骤 4：提交 commit

### 任务 7：组装 Epic 页面主入口

**文件：**
- 修改 `src/screen/epic/index.tsx`

- [ ] 步骤 1：替换占位内容为 `ScreenContainer` 页面结构
- [ ] 步骤 2：接入标题、查询区、创建按钮、错误/加载、列表
- [ ] 步骤 3：接入 Epic modal 与任务预览 drawer
- [ ] 步骤 4：设置文档标题
- [ ] 步骤 5：提交 commit

### 任务 8：接入 Epic -> Kanban 过滤联动

**文件：**
- 修改 `src/screen/kanban/util.ts`
- 修改 `src/screen/kanban/search-panel.tsx`

- [ ] 步骤 1：在 task 查询参数中解析 `epicId`
- [ ] 步骤 2：让 tasks 请求携带 `epicId`（有值时）
- [ ] 步骤 3：kanban 查询重置时清理 `epicId`
- [ ] 步骤 4：提交 commit

### 任务 9：路由与联动验证

**文件：**
- 验证 `src/screen/project/index.tsx`

- [ ] 步骤 1：确认 `/epic` 与 `/kanban` 保持兄弟路由
- [ ] 步骤 2：确认 Epic 行跳转 URL 正确携带 `epicId`
- [ ] 步骤 3：确认 Kanban 进入后过滤生效
- [ ] 步骤 4：提交 commit

### 任务 10：回归验证清单

- [ ] 步骤 1：打开 `/projects/{id}/epic`，确认布局与 kanban 风格一致
- [ ] 步骤 2：验证 Epic 新建/编辑/删除
- [ ] 步骤 3：验证关联任务 Drawer 展示正确
- [ ] 步骤 4：验证 Epic -> Kanban 跳转与过滤
- [ ] 步骤 5：运行仓库可用的检查命令并确认通过

---

## 约束

- 优先复用，不引入新的 UI/状态管理体系
- Epic 页只做分组与规划，不做看板拖拽
- Kanban 改动最小化，仅做 `epicId` 联动
- 当前 mock 数据未包含 epics 资源，实现时需对齐现有接口约定
