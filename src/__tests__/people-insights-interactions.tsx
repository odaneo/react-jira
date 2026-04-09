import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { PeopleInsightsCharts } from 'screen/people/insights-charts'

const workloadChart = [
  {
    userId: 1,
    name: 'Ada Lovelace',
    organization: '平台研发',
    loadScore: 8,
    ownedTaskCount: 3,
    reportedTaskCount: 1,
    projectCount: 1
  },
  {
    userId: 2,
    name: 'Grace Hopper',
    organization: '平台研发',
    loadScore: 3,
    ownedTaskCount: 1,
    reportedTaskCount: 1,
    projectCount: 0
  }
]

const riskRanking = [
  { userId: 1, name: 'Ada Lovelace', organization: '平台研发', loadScore: 8, riskScore: 8, level: '高风险' as const },
  { userId: 2, name: 'Grace Hopper', organization: '平台研发', loadScore: 3, riskScore: 3, level: '正常' as const }
]

const details = [
  {
    userId: 1,
    name: 'Ada Lovelace',
    organization: '平台研发',
    ownedTaskCount: 3,
    reportedTaskCount: 1,
    projectCount: 1,
    completedTaskCount: 2,
    loadScore: 8,
    riskScore: 8,
    level: '高风险' as const,
    projectNames: ['人员中心']
  },
  {
    userId: 2,
    name: 'Grace Hopper',
    organization: '平台研发',
    ownedTaskCount: 1,
    reportedTaskCount: 1,
    projectCount: 0,
    completedTaskCount: 1,
    loadScore: 3,
    riskScore: 3,
    level: '正常' as const,
    projectNames: []
  }
]

const trendChart = [
  { label: '03-10', 任务数: 1, 完整任务数: 1 },
  { label: '03-12', 任务数: 1, 完整任务数: 0 }
]

const TestHarness = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(1)
  const selectedDetail = details.find(detail => detail.userId === selectedUserId)

  return (
    <PeopleInsightsCharts
      workloadChart={workloadChart}
      trendChart={trendChart}
      riskRanking={riskRanking}
      details={details}
      selectedDetail={selectedDetail}
      selectedUserId={selectedUserId}
      onSelectUser={setSelectedUserId}
    />
  )
}

test('updates insight detail panel when clicking a chart item', async () => {
  render(<TestHarness />)

  const detailCard = screen.getByRole('heading', { name: '联动明细' }).closest('article') as HTMLElement

  expect(within(detailCard).getAllByText('Ada Lovelace').length).toBeGreaterThan(0)

  await userEvent.click(screen.getByRole('button', { name: '查看Grace Hopper的负载明细' }))

  expect(within(detailCard).getAllByText('Grace Hopper').length).toBeGreaterThan(0)
  expect(within(detailCard).getByText('正常')).toBeInTheDocument()
  expect(within(detailCard).getByText('暂无项目')).toBeInTheDocument()
})
