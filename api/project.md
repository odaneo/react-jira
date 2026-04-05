# project 模块

对应代码  
- `src/utils/project.ts`

类型定义

```ts
type ProjectEntity = {
  id: number
  name: string
  personId?: number
  pin?: boolean
  organization?: string
  created?: number
  ownerId?: number
  deleted?: boolean
}

type ProjectListQuery = Partial<{
  id: number
  name: string
  personId: number
  pin: boolean
  organization: string
  ownerId: number
}>

type ErrorResponse = {
  status: number
  message: string
}
```

接口明细

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/projects` | 已使用 |
| GET | `/projects/:id` | 已使用 |
| POST | `/projects` | 已使用 |
| PATCH | `/projects/:id` | 已使用 |
| DELETE | `/projects/:id` | 已使用 |

GET `/projects`

- 入参
```ts
query: ProjectListQuery
body: none
```
- 出参
```ts
ProjectEntity[]
```

GET `/projects/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
ProjectEntity
```

POST `/projects`

- 入参
```ts
body: {
  name: string
} & Partial<ProjectEntity>
query: none
```
- 出参
```ts
ProjectEntity
```

PATCH `/projects/:id`

- 入参
```ts
path: { id: number }
body: Partial<ProjectEntity>
query: none
```
- 出参
```ts
ProjectEntity
```

DELETE `/projects/:id`

- 入参
```ts
path: { id: number }
body: none
query: none
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
