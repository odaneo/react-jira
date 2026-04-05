# 当前 utils 未直接使用的接口集合

说明  
- 本文件内接口在 `src/utils` 里没有直接调用  
- 但 `jira-dev-tool` 已提供完整路由能力

类型定义

```ts
type PersonEntity = {
  id: number
  name: string
  organization?: string
  created?: number
  ownerId?: number
  deleted?: boolean
}

type TagEntity = {
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

persons

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/persons` | 未使用 |
| GET | `/persons/:id` | 未使用 |
| POST | `/persons` | 未使用 |
| PATCH | `/persons/:id` | 未使用 |
| DELETE | `/persons/:id` | 未使用 |

GET `/persons`

- 入参
```ts
query: Partial<PersonEntity>
body: none
```
- 出参
```ts
PersonEntity[]
```

GET `/persons/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
PersonEntity
```

POST `/persons`

- 入参
```ts
body: {
  name: string
} & Partial<PersonEntity>
query: none
```
- 出参
```ts
PersonEntity
```

PATCH `/persons/:id`

- 入参
```ts
path: { id: number }
body: Partial<PersonEntity>
query: none
```
- 出参
```ts
PersonEntity
```

DELETE `/persons/:id`

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

tags

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/tags` | 未使用 |
| GET | `/tags/:id` | 未使用 |
| POST | `/tags` | 未使用 |
| PATCH | `/tags/:id` | 未使用 |
| DELETE | `/tags/:id` | 未使用 |

GET `/tags`

- 入参
```ts
query: Partial<TagEntity>
body: none
```
- 出参
```ts
TagEntity[]
```

GET `/tags/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
TagEntity
```

POST `/tags`

- 入参
```ts
body: {
  name: string
} & Partial<TagEntity>
query: none
```
- 出参
```ts
TagEntity
```

PATCH `/tags/:id`

- 入参
```ts
path: { id: number }
body: Partial<TagEntity>
query: none
```
- 出参
```ts
TagEntity
```

DELETE `/tags/:id`

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
