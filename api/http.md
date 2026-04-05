# http 模块

对应代码  
- `src/utils/http.ts`  
- `src/auth-provider.ts`  
- `src/context/auth-context.tsx`

类型定义

```ts
type AuthForm = {
  username: string
  password: string
}

type AuthUser = {
  id: number
  name: string
  token: string
}

type AuthEnvelope = {
  user: AuthUser
}

type ErrorResponse = {
  status: number
  message: string
}
```

接口明细

| METHOD | PATH | 当前项目是否使用 |
|---|---|---|
| GET | `/me` | 已使用 |
| POST | `/login` | 已使用 |
| POST | `/register` | 已使用 |

GET `/me`

- 入参
```ts
headers: {
  Authorization: `Bearer ${token}`
}
body: none
query: none
```
- 出参
```ts
AuthEnvelope
```

POST `/login`

- 入参
```ts
body: AuthForm
headers: {
  "Content-Type": "application/json"
}
query: none
```
- 出参
```ts
AuthEnvelope
```

POST `/register`

- 入参
```ts
body: AuthForm
headers: {
  "Content-Type": "application/json"
}
query: none
```
- 出参
```ts
AuthEnvelope
```

失败返回

```ts
ErrorResponse
```
