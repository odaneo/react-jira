const { chromium } = require('playwright')

const WEB_URL = 'http://127.0.0.1:3000'
const AUTH_STORAGE_KEY = '__auth_provider_token__'
const REGISTER_USER = `playwright-user-${Date.now()}`
const REGISTER_PASSWORD = 'playwright-pass'

const WORKBENCH_TITLE = '\u89d2\u8272\u5de5\u4f5c\u53f0'
const MANAGER_LABEL = '\u7ba1\u7406\u8005\u89c6\u89d2'
const MEMBER_LABEL = '\u6210\u5458\u89c6\u89d2'
const OVERVIEW_HEADING = '\u56e2\u961f\u8d1f\u8f7d\u6982\u89c8'
const FOCUS_HEADING = '\u5f53\u524d\u805a\u7126\u6210\u5458'
const OWNED_TASKS_HEADING = '\u6211\u8d1f\u8d23\u7684\u4efb\u52a1'
const REPORTED_TASKS_HEADING = '\u6211\u6c47\u62a5\u7684\u4efb\u52a1'
const OWNED_PROJECTS_HEADING = '\u6211\u53c2\u4e0e\u7684\u9879\u76ee'

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

  const group = await page.evaluate(async token => {
    const response = await fetch('http://localhost:3002/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`users request failed with status ${response.status}`)
    }

    const users = await response.json()
    const targetUser = users.find(user => user.organization) || users[0]
    return targetUser?.organization || ''
  }, registerResult.token)

  const workbenchUrl = `${WEB_URL}/people?view=workbench&range=all${
    group ? `&group=${encodeURIComponent(group)}` : ''
  }`

  await page.goto(workbenchUrl, { waitUntil: 'networkidle' })
  await page.waitForFunction(expectedTitle => document.title === expectedTitle, WORKBENCH_TITLE)
  await page.getByRole('button', { name: MANAGER_LABEL }).waitFor()
  await page.getByRole('button', { name: MEMBER_LABEL }).waitFor()

  const selectedName = await page.evaluate(overviewHeading => {
    const articles = Array.from(document.querySelectorAll('article'))
    const overviewArticle = articles.find(article => (article.textContent || '').includes(overviewHeading))

    if (!overviewArticle) {
      throw new Error('expected manager overview card to be rendered')
    }

    const memberButtons = Array.from(overviewArticle.querySelectorAll('button[data-active]'))
    const targetButton = memberButtons[Math.min(1, memberButtons.length - 1)] || memberButtons[0]

    if (!targetButton) {
      throw new Error('expected manager overview card to expose at least one member button')
    }

    targetButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    return (targetButton.textContent || '').trim()
  }, OVERVIEW_HEADING)

  if (!selectedName) {
    throw new Error('expected to capture a selected member name from the manager workbench')
  }

  await page.getByRole('button', { name: MEMBER_LABEL }).click()
  await page.waitForURL(url => {
    const search = url.searchParams
    return (
      search.get('view') === 'workbench' &&
      search.get('role') === 'member' &&
      search.get('range') === 'all' &&
      search.get('group') === group
    )
  })

  await page.waitForFunction(
    ({ focusHeading, currentName }) => {
      const articles = Array.from(document.querySelectorAll('article'))
      const focusArticle = articles.find(article => (article.textContent || '').includes(focusHeading))
      return Boolean(focusArticle && (focusArticle.textContent || '').includes(currentName))
    },
    {
      focusHeading: FOCUS_HEADING,
      currentName: selectedName
    }
  )

  for (const heading of [OWNED_TASKS_HEADING, REPORTED_TASKS_HEADING, OWNED_PROJECTS_HEADING]) {
    await page.getByRole('heading', { name: heading }).waitFor()
  }

  await browser.close()
  console.log('PLAYWRIGHT_PEOPLE_P4_ROLE_WORKBENCH_PASSED')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
