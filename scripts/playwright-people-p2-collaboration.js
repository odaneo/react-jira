const { chromium } = require('playwright')

const WEB_URL = 'http://127.0.0.1:3000'
const AUTH_STORAGE_KEY = '__auth_provider_token__'
const REGISTER_USER = `playwright-user-${Date.now()}`
const REGISTER_PASSWORD = 'playwright-pass'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(WEB_URL, { waitUntil: 'networkidle' })

  const registerResult = await page.evaluate(
    async ({ authStorageKey, username, password }) => {
      const response = await fetch('http://localhost:3002/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        throw new Error(`register failed with status ${response.status}`)
      }

      const data = await response.json()
      window.localStorage.setItem(authStorageKey, data.user.token)
      return data.user
    },
    {
      authStorageKey: AUTH_STORAGE_KEY,
      username: REGISTER_USER,
      password: REGISTER_PASSWORD
    }
  )

  if (!registerResult?.token) {
    throw new Error('expected register flow to return an auth token')
  }

  const targetUserId = await page.evaluate(async token => {
    const response = await fetch('http://localhost:3002/projects', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`projects request failed with status ${response.status}`)
    }

    const projects = await response.json()
    const targetProject = projects.find(project => typeof project.personId === 'number')

    if (!targetProject) {
      throw new Error('expected at least one project with a personId')
    }

    return targetProject.personId
  }, registerResult.token)

  await page.goto(`${WEB_URL}/people`, { waitUntil: 'networkidle' })
  await page.locator('table tbody tr a').first().waitFor({ state: 'visible' })

  const memberLink = page.locator('table tbody tr a').first()
  const memberName = (await memberLink.textContent())?.trim() || ''

  if (!memberName) {
    throw new Error('expected at least one member link on the people list page')
  }

  await page.goto(`${WEB_URL}/people/${targetUserId}`, { waitUntil: 'networkidle' })
  await page.waitForURL(/\/people\/\d+/)
  await page.getByRole('heading', { name: '成员详情' }).waitFor()
  await page.getByRole('heading', { name: '我参与的项目' }).waitFor()

  const projectLinks = page.locator('a[href^="/projects/"]')
  const initialProjectCount = await projectLinks.count()

  if (!initialProjectCount) {
    throw new Error('expected collaboration panel to render at least one project link')
  }

  const firstProjectName = (await projectLinks.first().textContent())?.trim() || ''
  const filterSeed = firstProjectName.slice(0, Math.min(2, firstProjectName.length))

  if (!filterSeed) {
    throw new Error('expected at least one project name to build a filter seed')
  }

  await page.getByPlaceholder('按项目名称筛选').fill(filterSeed)

  await page.waitForFunction(
    ({ initialCount, seed }) => {
      const links = Array.from(document.querySelectorAll('a[href^="/projects/"]'))
      return (
        links.length > 0 &&
        links.length <= initialCount &&
        links.every(link => (link.textContent || '').includes(seed))
      )
    },
    { initialCount: initialProjectCount, seed: filterSeed }
  )

  const filteredProjectCount = await projectLinks.count()

  if (initialProjectCount > 1 && filteredProjectCount >= initialProjectCount) {
    throw new Error('expected project filtering to narrow the collaboration list')
  }

  await browser.close()
  console.log('PLAYWRIGHT_PEOPLE_P2_COLLABORATION_PASSED')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
