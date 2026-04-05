# users 模块

对应代码  
- `src/utils/users.ts`

类型定义

```ts
type UserEntity = {
  id: number
  name: string
  organization?: string
  created?: number
  ownerId?: number
  deleted?: boolean
}

type UserListQuery = Partial<{
  id: number
  name: string
  organization: string
}>

type ErrorResponse = {
  status: number
  message: string
}
```

接口明细

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/users` | 已使用 |
| GET | `/users/:id` | 未使用 |
| POST | `/users` | 未使用 |
| PATCH | `/users/:id` | 未使用 |
| DELETE | `/users/:id` | 未使用 |

GET `/users`

- 入参
```ts
query: UserListQuery
body: none
```
- 出参
```ts
UserEntity[]
```

GET `/users/:id`

- 入参
```ts
path: { id: number }
query: none
body: none
```
- 出参
```ts
UserEntity
```

POST `/users`

- 入参
```ts
body: {
  name: string
} & Partial<UserEntity>
query: none
```
- 出参
```ts
UserEntity
```

PATCH `/users/:id`

- 入参
```ts
path: { id: number }
body: Partial<UserEntity>
query: none
```
- 出参
```ts
UserEntity
```

DELETE `/users/:id`

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
