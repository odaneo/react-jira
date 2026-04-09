import { buildPeopleInsights } from 'screen/people/insights-model'

const users = [
  { id: 1, name: 'Ada Lovelace', organization: '平台研发' },
  { id: 2, name: 'Grace Hopper', organization: '平台研发' },
  { id: 3, name: 'Linus Torvalds', organization: '基础架构' }
]

const tasks = [
  { id: 1, name: '搭建筛选器', processorId: 1, reporterId: 2, projectId: 8, created: 1710000000000 },
  { id: 2, name: '沉淀样式规范', processorId: 2, reporterId: 1, projectId: 8, created: 1710500000000 },
  { id: 3, name: '分析风险队列', processorId: 1, reporterId: 3, projectId: 9, created: 1711000000000 },
  { id: 4, name: '补齐协作文案', processorId: 1, reporterId: undefined, projectId: 9, created: 1711500000000 }
]

const projects = [
  { id: 8, name: '人员中心', personId: 1, organization: '平台研发' },
  { id: 9, name: '风险看板', personId: 3, organization: '基础架构' }
]

test('builds people insights metrics charts and default detail panel', () => {
  const result = buildPeopleInsights({
    users,
    tasks,
    projects,
    filters: { range: 'all', organization: '', projectId: undefined }
  })

  expect(result.summary.totalLoad).toBe(4)
  expect(result.summary.progressRate).toBe(75)
  expect(result.summary.riskCount).toBe(1)
  expect(result.summary.coveredProjectCount).toBe(2)
  expect(result.workloadChart[0]).toMatchObject({
    userId: 1,
    name: 'Ada Lovelace',
    loadScore: 8
  })
  expect(result.riskRanking[0]).toMatchObject({
    userId: 1,
    name: 'Ada Lovelace',
    level: '高风险'
  })
  expect(result.selectedDetail?.name).toBe('Ada Lovelace')
  expect(result.trendChart).toHaveLength(4)
})

test('filters insights by organization and project scope', () => {
  const result = buildPeopleInsights({
    users,
    tasks,
    projects,
    filters: { range: 'all', organization: '平台研发', projectId: 8 }
  })

  expect(result.filteredUsers.map(user => user.name)).toEqual(['Ada Lovelace', 'Grace Hopper'])
  expect(result.summary.coveredProjectCount).toBe(1)
  expect(result.summary.totalLoad).toBe(2)
  expect(result.riskRanking).toHaveLength(2)
})
