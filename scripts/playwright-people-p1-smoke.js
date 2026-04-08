const { chromium } = require('playwright')

const WEB_URL = 'http://127.0.0.1:3000/people'
const AUTH_STORAGE_KEY = '__auth_provider_token__'
const USERS_STORAGE_KEY = '__jira_users__'
const AUTH_NAME = 'playwright-user'
const AUTH_PASSWORD = 'playwright-pass'

function hash(value) {
  let result = 5381
  let index = value.length

  while (index) {
    result = (result * 33) ^ value.charCodeAt(--index)
  }

  return String(result >>> 0)
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const userId = Number(hash(AUTH_NAME))
  const passwordHash = hash(AUTH_PASSWORD)
  const token = Buffer.from(String(userId)).toString('base64')

  await page.addInitScript(
    ({ authStorageKey, usersStorageKey, id, name, userPasswordHash, authToken }) => {
      window.localStorage.setItem(
        usersStorageKey,
        JSON.stringify({
          [id]: {
            id,
            name,
            passwordHash: userPasswordHash
          }
        })
      )
      window.localStorage.setItem(authStorageKey, authToken)
    },
    {
      authStorageKey: AUTH_STORAGE_KEY,
      usersStorageKey: USERS_STORAGE_KEY,
      id: userId,
      name: AUTH_NAME,
      userPasswordHash: passwordHash,
      authToken: token
    }
  )

  await page.goto(WEB_URL, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'People Hub' }).waitFor()

  const table = page.locator('table')
  await page.waitForFunction(() => document.querySelectorAll('table tbody tr').length > 0)
  const rows = table.locator('tbody tr')
  const initialRows = await rows.count()
  const initialTexts = await rows.allTextContents()
  const firstRowText = (initialTexts[0] || '').trim()
  const searchSeed = firstRowText.slice(0, 2)

  const searchInput = page.getByPlaceholder('Search by name')
  if (!searchSeed) {
    throw new Error('expected the initial people table to include searchable text')
  }

  await searchInput.fill(searchSeed)

  await page.waitForFunction(
    previousCount => {
      const tbodyRows = document.querySelectorAll('table tbody tr').length
      return tbodyRows > 0 && tbodyRows <= previousCount
    },
    initialRows
  )

  const rowCount = await rows.count()
  if (rowCount === 0) {
    throw new Error('expected filtered people list to show at least one row')
  }

  const visibleTexts = await rows.allTextContents()
  const matchesSearch = visibleTexts.every(text => text.includes(searchSeed))

  if (!matchesSearch) {
    throw new Error(`expected filtered people list to match search seed "${searchSeed}"`)
  }

  await browser.close()
  console.log('PLAYWRIGHT_PEOPLE_P1_SMOKE_PASSED')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
