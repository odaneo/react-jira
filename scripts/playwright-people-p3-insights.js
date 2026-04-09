const { chromium } = require('playwright')

const WEB_URL = 'http://127.0.0.1:3000'
const AUTH_STORAGE_KEY = '__auth_provider_token__'
const REGISTER_USER = `playwright-user-${Date.now()}`
const REGISTER_PASSWORD = 'playwright-pass'

const INSIGHTS_TITLE = '\u4eba\u5458\u5206\u6790'
const DETAIL_HEADING = '\u8054\u52a8\u660e\u7ec6'
const MEMBER_LABEL = '\u6210\u5458'
const RISK_LABEL = '\u98ce\u9669\u7ea7\u522b'
const KPI_LABELS = [
  '\u4efb\u52a1\u8d1f\u8f7d',
  '\u534f\u4f5c\u8fdb\u5ea6',
  '\u98ce\u9669\u6210\u5458',
  '\u8986\u76d6\u9879\u76ee'
]

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

  await page.goto(`${WEB_URL}/people?view=insights`, { waitUntil: 'networkidle' })
  await page.waitForFunction(expectedTitle => document.title === expectedTitle, INSIGHTS_TITLE)

  for (const label of KPI_LABELS) {
    await page.waitForFunction(expectedLabel => document.body.innerText.includes(expectedLabel), label)
  }

  const initialDetailText = await getDetailText(page)
  const initialMemberName = await getSelectedMemberName(page)
  const chartButtons = page.locator('[role="button"][aria-label]')
  const chartButtonCount = await chartButtons.count()

  if (!chartButtonCount) {
    throw new Error('expected insights charts to expose clickable detail buttons')
  }

  let switched = false

  for (let index = 0; index < chartButtonCount; index += 1) {
    const button = chartButtons.nth(index)
    const label = (await button.getAttribute('aria-label')) || ''

    if (!label.startsWith('\u67e5\u770b') || !label.endsWith('\u660e\u7ec6')) {
      continue
    }

    if (extractName(label) === initialMemberName) {
      continue
    }

    await page.evaluate(targetLabel => {
      const target = Array.from(document.querySelectorAll('[role="button"][aria-label]')).find(
        node => node.getAttribute('aria-label') === targetLabel
      )

      if (!target) {
        throw new Error(`missing chart button: ${targetLabel}`)
      }

      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    }, label)

    await page.waitForFunction(
      ({ detailHeading, previousMemberName }) => {
        const articles = Array.from(document.querySelectorAll('article'))
        const detailArticle = articles.find(article => (article.textContent || '').includes(detailHeading))
        const currentMemberName = detailArticle?.querySelector('strong')?.textContent || ''
        return currentMemberName.length > 0 && currentMemberName !== previousMemberName
      },
      {
        detailHeading: DETAIL_HEADING,
        previousMemberName: initialMemberName
      }
    )

    switched = true
    break
  }

  if (!switched) {
    throw new Error('expected clicking a chart item to switch the detail panel')
  }

  const nextDetailText = await getDetailText(page)
  const nextMemberName = await getSelectedMemberName(page)

  if (!nextMemberName || nextMemberName === initialMemberName) {
    throw new Error('expected detail panel member to change after selecting a chart item')
  }

  if (!nextDetailText.includes(MEMBER_LABEL) || !nextDetailText.includes(RISK_LABEL)) {
    throw new Error('expected detail panel to show member and risk details after chart interaction')
  }

  await browser.close()
  console.log('PLAYWRIGHT_PEOPLE_P3_INSIGHTS_PASSED')
}

async function getDetailText(page) {
  return page.evaluate(detailHeading => {
    const articles = Array.from(document.querySelectorAll('article'))
    const detailArticle = articles.find(article => (article.textContent || '').includes(detailHeading))
    return detailArticle?.textContent || ''
  }, DETAIL_HEADING)
}

async function getSelectedMemberName(page) {
  return page.evaluate(detailHeading => {
    const articles = Array.from(document.querySelectorAll('article'))
    const detailArticle = articles.find(article => (article.textContent || '').includes(detailHeading))
    return detailArticle?.querySelector('strong')?.textContent || ''
  }, DETAIL_HEADING)
}

function extractName(label) {
  return label.replace(/^\u67e5\u770b/, '').replace(/\u7684(?:\u8d1f\u8f7d|\u98ce\u9669)\u660e\u7ec6$/, '')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
