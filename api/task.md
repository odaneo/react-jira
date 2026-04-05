# task 模块

对应代码  
- `src/utils/task.ts`  
- `src/utils/kanban.ts` 里的 `useAddTask`  
- `src/utils/project.ts` 里的 `useTask`

类型定义

```ts
type TaskEntity = {
  id: number
  name: string
  projectId?: number
  processorId?: number
  reporterId?: number
  kanbanId?: number
  epicId?: number
  typeId?: number
  tags?: number[]
  favorite?: boolean
  note?: string
  created?: number
  ownerId?: number
  deleted?: boolean
}

type TaskListQuery = Partial<{
  id: number
  name: string
  projectId: number
  processorId: number
  reporterId: number
  kanbanId: number
  epicId: number
  typeId: number
}>

type TaskReorderBody = {
  fromId: number
  referenceId?: number
  type: "before" | "after"
  fromKanbanId?: number
  toKanbanId?: number
}

type ErrorResponse = {
  status: number
  message: string
}
```

接口明细

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/tasks` | 已使用 |
| GET | `/tasks/:id` | 已使用 |
| POST | `/tasks` | 已使用 |
| PATCH | `/tasks/:id` | 已使用 |
| DELETE | `/tasks/:id` | 已使用 |
| POST | `/tasks/reorder` | 已使用 |

GET `/tasks`

- 入参
```ts
query: TaskListQuery
body: none
```
- 出参
```ts
TaskEntity[]
```

GET `/tasks/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
TaskEntity
```

POST `/tasks`

- 入参
```ts
body: {
  name: string
} & Partial<TaskEntity>
query: none
```
- 出参
```ts
TaskEntity
```

PATCH `/tasks/:id`

- 入参
```ts
path: { id: number }
body: Partial<TaskEntity>
query: none
```
- 出参
```ts
TaskEntity
```

DELETE `/tasks/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
{
  success: true
}
```

POST `/tasks/reorder`

- 入参
```ts
body: TaskReorderBody
query: none
```
- 出参
```ts
{}
```

失败返回

```ts
ErrorResponse
```
