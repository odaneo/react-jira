# users 接口说明

## 前端使用位置
- `src/screen/people/list.tsx`：人员列表页
- `src/screen/people/detail.tsx`：人员详情页
- `src/screen/people/insights.tsx`：人员洞察页
- `src/screen/people/workbench-layout.tsx`、`src/screen/people/workbench-manager.tsx`、`src/screen/people/workbench-member.tsx`：角色工作台

## 类型约定
```ts
type UserEntity = {
  id: number
  name: string
  organization?: string
}

interface ErrorResponse {
  status: number
  message: string
}
```

## 现有接口
| METHOD | PATH | 使用情况 |
|---|---|---|
| GET | `/users` | 已使用，人员列表、人员洞察、角色工作台 |
| GET | `/users/:id` | 已使用，人员详情 |
| POST | `/users` | 未使用 |
| PATCH | `/users/:id` | 未使用 |
| DELETE | `/users/:id` | 未使用 |

## 已使用接口

### GET `/users`
- 请求
```ts
query: {
  name?: string
  organization?: string
}
body: none
```
- 响应
```ts
Array<Pick<UserEntity, 'id' | 'name' | 'organization'>>
```
- 使用说明
  - 人员列表页会把搜索条件传给这个接口。
  - 人员洞察页和角色工作台会直接拉取全量人员，再在前端结合任务、项目做聚合。

### GET `/users/:id`
- 请求
```ts
path: { id: number }
query: none
body: none
```
- 响应
```ts
UserEntity
```
- 使用说明
  - 人员详情页按 `id` 拉取单个用户。

## 前端使用说明
- `/people` 由 `src/screen/people/index.tsx` 统一分发视图，当前覆盖列表、洞察和角色工作台。
- 列表页使用 `useUsers(useDebounce(param, 300))`，支持按 `name` 和 `organization` 过滤。
- 详情页使用 `useUsers(userId ? { id: userId } : undefined)`，再配合任务和项目面板展示完整详情。
- 洞察页和角色工作台都使用 `useUsers()`、`useTasks()`、`useProjects()` 生成前端聚合结果。
- 角色工作台入口是 `/people?view=workbench`，支持 `role=manager|member`，并会保留 `range`、`projectId`、`group` 筛选参数；切换角色时只调整展示方式，不改动现有筛选状态。
- 角色工作台内部由管理者视图和成员视图重组同一批人员数据，管理者偏总览和风险，成员偏个人任务与详情。

## 未覆盖接口
- 当前前端没有调用 `POST /users`、`PATCH /users/:id`、`DELETE /users/:id`。
- 如果后续补人员管理能力，这三类接口再单独对齐页面需求即可。
