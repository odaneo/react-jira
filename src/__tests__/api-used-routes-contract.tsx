import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { http } from 'utils/http'

const apiUrl = process.env.REACT_APP_API_URL
const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('POST /tasks 可以提交任务关联字段', async () => {
  let body: Record<string, unknown> = {}

  server.use(
    rest.post(`${apiUrl}/tasks`, (req, res, ctx) => {
      body = req.body as Record<string, unknown>
      return res(ctx.json({ id: 1, ...body }))
    })
  )

  const result = await http('tasks', {
    method: 'POST',
    data: {
      name: '新任务',
      projectId: 1,
      kanbanId: 2,
      epicId: 3,
      processorId: 4,
      reporterId: 5,
      typeId: 6,
      note: '说明',
      favorite: true
    }
  })

  expect(body).toMatchObject({
    epicId: 3,
    processorId: 4,
    reporterId: 5,
    typeId: 6,
    note: '说明',
    favorite: true
  })
  expect(result).toMatchObject({ id: 1, epicId: 3, reporterId: 5 })
})

test('PATCH /tasks/:id 可以更新任务关联字段', async () => {
  let body: Record<string, unknown> = {}

  server.use(
    rest.patch(`${apiUrl}/tasks/:id`, (req, res, ctx) => {
      body = req.body as Record<string, unknown>
      return res(ctx.json({ id: Number(req.params.id), ...body }))
    })
  )

  const result = await http('tasks/8', {
    method: 'PATCH',
    data: {
      id: 8,
      epicId: 11,
      reporterId: 12,
      note: '更新说明',
      favorite: false
    }
  })

  expect(body).toMatchObject({
    id: 8,
    epicId: 11,
    reporterId: 12,
    note: '更新说明',
    favorite: false
  })
  expect(result).toMatchObject({ id: 8, epicId: 11, reporterId: 12, favorite: false })
})

test('POST /epics 可以提交开始和结束时间', async () => {
  let body: Record<string, unknown> = {}

  server.use(
    rest.post(`${apiUrl}/epics`, (req, res, ctx) => {
      body = req.body as Record<string, unknown>
      return res(ctx.json({ id: 21, ...body }))
    })
  )

  const result = await http('epics', {
    method: 'POST',
    data: {
      name: '任务组A',
      projectId: 1,
      start: 1710000000000,
      end: 1710600000000
    }
  })

  expect(body).toMatchObject({
    start: 1710000000000,
    end: 1710600000000
  })
  expect(result).toMatchObject({ id: 21, start: 1710000000000, end: 1710600000000 })
})

test('GET /projects 支持 organization 和 pin 查询参数', async () => {
  let query: Record<string, string> = {}

  server.use(
    rest.get(`${apiUrl}/projects`, (req, res, ctx) => {
      query = Object.fromEntries(req.url.searchParams)
      return res(ctx.json([]))
    })
  )

  await http('projects', {
    data: { name: '项目', organization: '研发', pin: true, personId: 3 }
  })

  expect(query).toMatchObject({
    name: '项目',
    organization: '研发',
    pin: 'true',
    personId: '3'
  })
})
