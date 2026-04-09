import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { http } from 'utils/http'

const apiUrl = process.env.REACT_APP_API_URL
const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('POST /tasks sends task relation fields', async () => {
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
      name: 'New task',
      projectId: 1,
      kanbanId: 2,
      epicId: 3,
      processorId: 4,
      reporterId: 5,
      typeId: 6,
      note: 'task note',
      favorite: true
    }
  })

  expect(body).toMatchObject({
    epicId: 3,
    processorId: 4,
    reporterId: 5,
    typeId: 6,
    note: 'task note',
    favorite: true
  })
  expect(result).toMatchObject({ id: 1, epicId: 3, reporterId: 5 })
})

test('PATCH /tasks/:id updates task relation fields', async () => {
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
      note: 'updated note',
      favorite: false
    }
  })

  expect(body).toMatchObject({
    id: 8,
    epicId: 11,
    reporterId: 12,
    note: 'updated note',
    favorite: false
  })
  expect(result).toMatchObject({ id: 8, epicId: 11, reporterId: 12, favorite: false })
})

test('POST /epics sends start and end timestamps', async () => {
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
      name: 'Epic launch',
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

test('GET /projects sends organization pin and personId query params', async () => {
  let query: Record<string, string> = {}

  server.use(
    rest.get(`${apiUrl}/projects`, (req, res, ctx) => {
      query = Object.fromEntries(req.url.searchParams)
      return res(ctx.json([]))
    })
  )

  await http('projects', {
    data: { name: 'Project', organization: 'Studio', pin: true, personId: 3 }
  })

  expect(query).toMatchObject({
    name: 'Project',
    organization: 'Studio',
    pin: 'true',
    personId: '3'
  })
})

test('GET /users supports name and organization filters for People P1', async () => {
  let query: Record<string, string> = {}

  server.use(
    rest.get(`${apiUrl}/users`, (req, res, ctx) => {
      query = Object.fromEntries(req.url.searchParams)
      return res(
        ctx.json([
          {
            id: 1,
            name: 'Ada Lovelace',
            organization: 'Math Lab',
            email: 'ada@example.com',
            title: 'Engineer'
          }
        ])
      )
    })
  )

  const result = await http('users', {
    data: { name: 'Ada', organization: 'Math Lab' }
  })

  expect(query).toMatchObject({
    name: 'Ada',
    organization: 'Math Lab'
  })
  expect(result).toMatchObject([{ id: 1, name: 'Ada Lovelace', organization: 'Math Lab' }])
})
