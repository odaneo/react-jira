# users 讓｡蝮・
蟇ｹ蠎比ｻ｣遐・ 
- `src/utils/users.ts`

邀ｻ蝙句ｮ壻ｹ・
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

謗･蜿｣譏守ｻ・
| METHOD | PATH | 蠖灘燕鬘ｹ逶ｮ譏ｯ蜷ｦ菴ｿ逕ｨ |
|---|---|---|
| GET | `/users` | 已使用，People P1 |
| GET | `/users/:id` | 譛ｪ菴ｿ逕ｨ |
| POST | `/users` | 譛ｪ菴ｿ逕ｨ |
| PATCH | `/users/:id` | 譛ｪ菴ｿ逕ｨ |
| DELETE | `/users/:id` | 譛ｪ菴ｿ逕ｨ |

GET `/users`

- 蜈･蜿・```ts
query: {
  name?: string
  organization?: string
}
body: none
```
- 蜃ｺ蜿・```ts
Array<Pick<UserEntity, 'id' | 'name' | 'organization'>>
```
- People P1 只会?取 `id`、`name`、`organization`。

GET `/users/:id`

- 蜈･蜿・```ts
path: { id: number }
query: none
body: none
```
- 蜃ｺ蜿・```ts
UserEntity
```

POST `/users`

- 蜈･蜿・```ts
body: {
  name: string
} & Partial<UserEntity>
query: none
```
- 蜃ｺ蜿・```ts
UserEntity
```

PATCH `/users/:id`

- 蜈･蜿・```ts
path: { id: number }
body: Partial<UserEntity>
query: none
```
- 蜃ｺ蜿・```ts
UserEntity
```

DELETE `/users/:id`

- 蜈･蜿・```ts
path: { id: number }
query: none
body: none
```
- 蜃ｺ蜿・```ts
{
  success: true
}
```

螟ｱ雍･霑泌屓

```ts
ErrorResponse
```
