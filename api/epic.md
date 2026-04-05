# epic 模块

对应代码  
- `src/utils/epic.ts`

类型定义

```ts
type EpicEntity = {
  id: number
  name: string
  projectId?: number
  start?: number
  end?: number
  description?: string
  created?: number
  ownerId?: number
  deleted?: boolean
}

type EpicListQuery = Partial<{
  id: number
  name: string
  projectId: number
}>

type ErrorResponse = {
  status: number
  message: string
}
```

接口明细

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/epics` | 已使用 |
| GET | `/epics/:id` | 已使用 |
| POST | `/epics` | 已使用 |
| PATCH | `/epics/:id` | 已使用 |
| DELETE | `/epics/:id` | 已使用 |

GET `/epics`

- 入参
```ts
query: EpicListQuery
body: none
```
- 出参
```ts
EpicEntity[]
```

GET `/epics/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
EpicEntity
```

POST `/epics`

- 入参
```ts
body: {
  name: string
} & Partial<EpicEntity>
query: none
```
- 出参
```ts
EpicEntity
```

PATCH `/epics/:id`

- 入参
```ts
path: { id: number }
body: Partial<EpicEntity>
query: none
```
- 出参
```ts
EpicEntity
```

DELETE `/epics/:id`

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
