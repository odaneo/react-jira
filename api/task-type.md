# task-type 模块

对应代码  
- `src/utils/task-type.ts`

类型定义

```ts
type TaskTypeEntity = {
  id: number
  name: string
  created?: number
  ownerId?: number
  deleted?: boolean
}

type ErrorResponse = {
  status: number
  message: string
}
```

接口明细

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/taskTypes` | 已使用 |
| GET | `/taskTypes/:id` | 未使用 |
| POST | `/taskTypes` | 未使用 |
| PATCH | `/taskTypes/:id` | 未使用 |
| DELETE | `/taskTypes/:id` | 未使用 |

GET `/taskTypes`

- 入参
```ts
query: none
body: none
```
- 出参
```ts
TaskTypeEntity[]
```

GET `/taskTypes/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
TaskTypeEntity
```

POST `/taskTypes`

- 入参
```ts
body: {
  name: string
} & Partial<TaskTypeEntity>
query: none
```
- 出参
```ts
TaskTypeEntity
```

PATCH `/taskTypes/:id`

- 入参
```ts
path: { id: number }
body: Partial<TaskTypeEntity>
query: none
```
- 出参
```ts
TaskTypeEntity
```

DELETE `/taskTypes/:id`

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

失败返回

```ts
ErrorResponse
```
