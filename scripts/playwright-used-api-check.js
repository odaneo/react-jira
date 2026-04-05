const { chromium } = require('playwright')

const WEB_URL = 'http://localhost:3000'
const API_URL = 'http://localhost:3002'
const PASSWORD = '12345678'

async function request(page, token, endpoint, method, body) {
  return page.evaluate(
    async ({ apiUrl, tokenValue, endpointValue, methodValue, bodyValue }) => {
      const response = await fetch(`${apiUrl}/${endpointValue}`, {
        method: methodValue,
        headers: {
          Authorization: `Bearer ${tokenValue}`,
          'Content-Type': 'application/json'
        },
        body: bodyValue ? JSON.stringify(bodyValue) : undefined
      })
      return response.json()
    },
    {
      apiUrl: API_URL,
      tokenValue: token,
      endpointValue: endpoint,
      methodValue: method,
      bodyValue: body
    }
  )
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const username = `used_api_e2e_${Date.now()}`
  const projectName = `API Project ${Date.now()}`
  const projectNameEdited = `${projectName} Edited`
  const taskName = `Task ${Date.now()}`
  const taskNameEdited = `${taskName} Edited`

  await page.goto(WEB_URL, { waitUntil: 'networkidle' })
  await page.locator('button').nth(1).click()
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(PASSWORD)
  await page.locator('#cpassword').fill(PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/\/projects/)

  await page.locator('button, a', { hasText: '创建项目' }).first().click()
  const drawer = page.locator('.ant-drawer-content')
  await drawer.locator('input').nth(0).fill(projectName)
  await drawer.locator('input').nth(1).fill('研发')
  await drawer.locator('button[type="submit"]').click()
  await page.locator('tbody tr a', { hasText: projectName }).waitFor()

  const row = page.locator('tbody tr', { hasText: projectName })
  await row.locator('button', { hasText: '...' }).click()
  await page.locator('.ant-dropdown:not(.ant-dropdown-hidden) .ant-dropdown-menu-item', { hasText: '编辑' }).click()
  await drawer.locator('input').nth(0).fill(projectNameEdited)
  await drawer.locator('button[type="submit"]').click()
  await page.locator('tbody tr a', { hasText: projectNameEdited }).waitFor()

  await page.locator('tbody tr a', { hasText: projectNameEdited }).first().click()
  await page.waitForURL(/\/projects\/\d+\/kanban/)
  const projectId = Number(page.url().match(/projects\/(\d+)/)[1])

  const token = await page.evaluate(() => localStorage.getItem('__auth_provider_token__') || '')
  const taskTypes = await request(page, token, 'taskTypes', 'GET')
  const typeId = taskTypes?.[0]?.id

  await request(page, token, 'kanbans', 'POST', { name: '看板A', projectId })
  const kanbans = await request(page, token, `kanbans?projectId=${projectId}`, 'GET')
  const kanbanId = kanbans?.[0]?.id

  const createdEpic = await request(page, token, 'epics', 'POST', {
    name: `Epic-${Date.now()}`,
    projectId,
    start: 1711929600000,
    end: 1712707200000
  })

  const createdTask = await request(page, token, 'tasks', 'POST', {
    name: taskName,
    projectId,
    kanbanId,
    epicId: createdEpic.id,
    typeId,
    note: 'task note',
    favorite: true
  })

  await request(page, token, `tasks/${createdTask.id}`, 'PATCH', {
    id: createdTask.id,
    name: taskNameEdited,
    reporterId: 1,
    note: 'task note edited',
    favorite: false,
    epicId: createdEpic.id
  })

  await request(page, token, 'tasks/reorder', 'POST', {
    fromId: createdTask.id,
    type: 'before',
    fromKanbanId: kanbanId,
    toKanbanId: kanbanId
  })

  await request(page, token, `tasks/${createdTask.id}`, 'DELETE')
  await request(page, token, `epics/${createdEpic.id}`, 'DELETE')

  await page.goto(`${WEB_URL}/projects?organization=研发&pin=true`, { waitUntil: 'networkidle' })

  await page.goto(`${WEB_URL}/projects`, { waitUntil: 'networkidle' })
  const editedRow = page.locator('tbody tr', { hasText: projectNameEdited })
  await editedRow.locator('button', { hasText: '...' }).click()
  await page.locator('.ant-dropdown:not(.ant-dropdown-hidden) .ant-dropdown-menu-item', { hasText: '删除' }).click()
  await page.locator('.ant-modal-confirm .ant-btn-primary').click()

  await browser.close()
  console.log('PLAYWRIGHT_USED_API_CHECK_PASSED')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
