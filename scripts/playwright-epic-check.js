const { chromium } = require('playwright')

const WEB_URL = 'http://localhost:3000'
const PASSWORD = '12345678'

const setDateInput = async (page, selector, value, index = 0) => {
  await page
    .locator(selector)
    .nth(index)
    .evaluate((input, nextValue) => {
      input.value = nextValue
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }, value)
}

async function main() {
  const username = `epic_e2e_${Date.now()}`

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(`${WEB_URL}`, { waitUntil: 'networkidle' })
  await page.locator('button').nth(1).click()
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(PASSWORD)
  await page.locator('#cpassword').fill(PASSWORD)
  await page.locator('button[type="submit"]').click()

  await page.waitForURL(/\/projects/)
  await page.locator('tbody tr a').first().click()
  await page.waitForURL(/\/projects\/\d+\/kanban/)

  const projectMatch = page.url().match(/projects\/(\d+)/)
  if (!projectMatch) throw new Error('failed to parse project id from url')
  const projectId = Number(projectMatch[1])

  const allTaskCount = await page.locator('.ant-card').count()
  await page.goto(`${WEB_URL}/projects/${projectId}/epic`, { waitUntil: 'networkidle' })
  await page.waitForURL(new RegExp(`/projects/${projectId}/epic`))

  const epicName = `E2E Epic ${Date.now()}`
  await page.goto(`${WEB_URL}/projects/${projectId}/epic?epicCreate=true`, { waitUntil: 'networkidle' })
  await page.locator('.ant-modal input').first().fill(epicName)
  await page.locator('.ant-modal textarea').first().fill('playwright e2e description')
  await setDateInput(page, '.ant-modal input[type="date"]', '2026-04-01', 0)
  await setDateInput(page, '.ant-modal input[type="date"]', '2026-04-10', 1)
  await page.locator('.ant-modal .ant-btn-primary').click()
  await page.locator('tr', { hasText: epicName }).waitFor()

  const row = page.locator('tr', { hasText: epicName })
  const actionCell = row.locator('td').last()

  await actionCell.locator('button').nth(0).click()
  await page.locator('.ant-drawer.ant-drawer-open').waitFor()
  await page.keyboard.press('Escape')

  await actionCell.locator('a').nth(0).click()
  await page.waitForURL(new RegExp(`/projects/${projectId}/kanban\\?epicId=\\d+`))
  const filteredTaskCount = await page.locator('.ant-card').count()
  if (filteredTaskCount > allTaskCount) {
    throw new Error('epic filter seems invalid: filtered count > all count')
  }

  await page.goto(`${WEB_URL}/projects/${projectId}/epic`, { waitUntil: 'networkidle' })
  const rowAfterBack = page.locator('tr', { hasText: epicName })
  const actionCellAfterBack = rowAfterBack.locator('td').last()

  await actionCellAfterBack.locator('button').nth(1).click()
  await page.locator('.ant-dropdown:not(.ant-dropdown-hidden) .ant-dropdown-menu-item').first().click()
  await page.locator('.ant-modal').waitFor()
  await page.locator('.ant-modal input').first().fill(`${epicName} Edited`)
  await setDateInput(page, '.ant-modal input[type="date"]', '2026-04-03', 0)
  await setDateInput(page, '.ant-modal input[type="date"]', '2026-04-15', 1)
  await page.locator('.ant-modal .ant-btn-primary').click()
  await page.locator('.ant-modal').waitFor({ state: 'hidden' })

  const deleteRow = page.locator('tr', { hasText: epicName })
  const deleteActionCell = deleteRow.locator('td').last()
  await deleteActionCell.locator('button').nth(1).click()
  await page.locator('.ant-dropdown:not(.ant-dropdown-hidden) .ant-dropdown-menu-item').nth(1).click()
  await page.locator('.ant-modal-confirm .ant-btn-primary').click()
  await deleteRow.waitFor({ state: 'detached' })

  await browser.close()
  console.log('PLAYWRIGHT_EPIC_CHECK_PASSED')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
