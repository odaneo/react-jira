# kanban 模块

对应代码  
- `src/utils/kanban.ts`

类型定义

```ts
type KanbanEntity = {
  id: number
  name: string
  projectId?: number
  created?: number
  ownerId?: number
  deleted?: boolean
}

type KanbanListQuery = Partial<{
  id: number
  name: string
  projectId: number
}>

type KanbanReorderBody = {
  fromId: number
  referenceId?: number
  type: "before" | "after"
}

type ErrorResponse = {
  status: number
  message: string
}
```

接口明细

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/kanbans` | 已使用 |
| GET | `/kanbans/:id` | 未使用 |
| POST | `/kanbans` | 已使用 |
| PATCH | `/kanbans/:id` | 未使用 |
| DELETE | `/kanbans/:id` | 已使用 |
| POST | `/kanbans/reorder` | 已使用 |

GET `/kanbans`

- 入参
```ts
query: KanbanListQuery
body: none
```
- 出参
```ts
KanbanEntity[]
```

GET `/kanbans/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
KanbanEntity
```

POST `/kanbans`

- 入参
```ts
body: {
  name: string
} & Partial<KanbanEntity>
query: none
```
- 出参
```ts
KanbanEntity
```

PATCH `/kanbans/:id`

- 入参
```ts
path: { id: number }
body: Partial<KanbanEntity>
query: none
```
- 出参
```ts
KanbanEntity
```

DELETE `/kanbans/:id`

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

POST `/kanbans/reorder`

- 入参
```ts
body: KanbanReorderBody
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
