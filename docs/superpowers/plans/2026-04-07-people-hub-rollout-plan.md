# People Hub 计划总览

> 目标是从单页用户中心逐步过渡到角色化工作台。每一期都可以独立上线，不依赖未来代码。

## 分期

1. P1 人员中心基础页
- 新增 people 入口和用户列表页
- 支持搜索和基础筛选
- 保持只读，不引入 users 写接口

2. P2 协作联动页
- 用户详情页串联任务和项目
- 让用户与任务 看板 项目关系可见

3. P3 运营分析页
- 基于已有数据做负载和风险指标
- 提供按人按项目切换视角

4. P4 角色化工作台
- 在同一套数据上支持管理者与成员视图
- 形成从入口到执行到分析的闭环

## 执行顺序

- 严格按 P1 到 P4 执行
- 每一期先单元测试 后 e2e
- 每一期完成后更新 api 使用标记和 plan 勾选状态

## 对应计划文件

- `docs/superpowers/plans/2026-04-07-people-hub-p1-foundation-implementation-plan.md`
- `docs/superpowers/plans/2026-04-07-people-hub-p2-collaboration-implementation-plan.md`
- `docs/superpowers/plans/2026-04-07-people-hub-p3-insights-implementation-plan.md`
- `docs/superpowers/plans/2026-04-07-people-hub-p4-role-workbench-implementation-plan.md`
