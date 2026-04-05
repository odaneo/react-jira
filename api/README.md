# jira-dev-tool API 总览

来源  
- `node_modules/jira-dev-tool/dist/index.modern.js`

统计口径  
- 按 `请求方法 + 路径模板` 统计

总数  
- 45 条路由规则

分类文件  
- `api/http.md`
- `api/project.md`
- `api/task.md`
- `api/kanban.md`
- `api/epic.md`
- `api/users.md`
- `api/task-type.md`
- `api/unused.md`

本次补充
- 每个接口已标注 当前项目是否使用
- 每个接口已标注 入参类型 和 出参类型

除 `unused.md` 之外 仍未使用的接口
- `kanban.md` 里  
  - `GET /kanbans/:id`  
  - `PATCH /kanbans/:id`
- `users.md` 里  
  - `GET /users/:id`  
  - `POST /users`  
  - `PATCH /users/:id`  
  - `DELETE /users/:id`
- `task-type.md` 里  
  - `GET /taskTypes/:id`  
  - `POST /taskTypes`  
  - `PATCH /taskTypes/:id`  
  - `DELETE /taskTypes/:id`
