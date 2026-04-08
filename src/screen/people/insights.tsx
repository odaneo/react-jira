import { ErrorBox } from 'components/libs'
import { useEffect, useMemo, useState } from 'react'
import { useProjects } from 'utils/project'
import { useTasks } from 'utils/task'
import { useUsers } from 'utils/users'
import { Eyebrow, PeopleHero, PeopleShell, SummaryCard, SummaryGrid } from './styles'
import { buildPeopleInsights } from './insights-model'
import { PeopleInsightsCards } from './insights-cards'
import { PeopleInsightsCharts } from './insights-charts'
import {
  InsightsField,
  InsightsFilterGrid,
  InsightsHeader,
  InsightsSelect,
  InsightsSwitch,
  InsightsSwitchButton,
  InsightsToolbar
} from './insights-styles'
import { usePeopleInsightsParams } from './util'

export const PeopleInsightsScreen = ({
  view,
  setView
}: {
  view: 'list' | 'insights'
  setView: (view: 'list' | 'insights') => void
}) => {
  const [filters, setFilters] = usePeopleInsightsParams()
  const { data: users = [], error: usersError } = useUsers()
  const { data: tasks = [], error: tasksError } = useTasks()
  const { data: projects = [], error: projectsError } = useProjects()
  const insights = useMemo(
    () =>
      buildPeopleInsights({
        users,
        tasks,
        projects,
        filters
      }),
    [users, tasks, projects, filters]
  )
  const error = usersError || tasksError || projectsError
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(insights.selectedDetail?.userId)

  useEffect(() => {
    if (!selectedUserId || !insights.details.some(detail => detail.userId === selectedUserId)) {
      setSelectedUserId(insights.selectedDetail?.userId)
    }
  }, [insights.details, insights.selectedDetail, selectedUserId])

  const projectOptions = projects.map(project => ({ label: project.name, value: project.id }))
  const organizationOptions = Array.from(new Set(users.map(user => user.organization).filter(Boolean))).map(value => ({
    label: value,
    value
  }))
  const selectedDetail = insights.details.find(detail => detail.userId === selectedUserId) || insights.selectedDetail

  return (
    <PeopleShell>
      <PeopleHero>
        <div>
          <Eyebrow>分析视图</Eyebrow>
          <h1>人员分析</h1>
          <p>把成员负载、协作进度和风险信号集中展示，先形成稳定的洞察骨架，再继续增强图表联动。</p>
        </div>

        <SummaryGrid>
          <SummaryCard>
            <span>参与成员</span>
            <strong>{insights.filteredUsers.length} 位成员</strong>
          </SummaryCard>
          <SummaryCard>
            <span>当前风险</span>
            <strong>{insights.summary.riskCount} 位高风险</strong>
          </SummaryCard>
          <SummaryCard>
            <span>视图状态</span>
            <strong>{view === 'insights' ? '分析洞察' : '成员列表'}</strong>
          </SummaryCard>
        </SummaryGrid>
      </PeopleHero>

      <InsightsToolbar>
        <InsightsHeader>
          <div>
            <h2>人员分析</h2>
            <p>筛选不同时间、项目和组织后，指标卡与图表会同步更新。</p>
          </div>
          <InsightsSwitch aria-label="人员视图切换">
            <InsightsSwitchButton type="default" data-active={view === 'list'} onClick={() => setView('list')}>
              成员列表
            </InsightsSwitchButton>
            <InsightsSwitchButton
              type="primary"
              ghost={view === 'insights'}
              data-active={view === 'insights'}
              onClick={() => setView('insights')}
            >
              分析洞察
            </InsightsSwitchButton>
          </InsightsSwitch>
        </InsightsHeader>

        <InsightsFilterGrid>
          <InsightsField>
            时间范围
            <InsightsSelect
              value={filters.range}
              onChange={value => setFilters({ ...filters, range: value as typeof filters.range })}
              options={[
                { label: '全部时间', value: 'all' },
                { label: '近 30 天', value: '30d' },
                { label: '近 90 天', value: '90d' }
              ]}
            />
          </InsightsField>

          <InsightsField>
            项目范围
            <InsightsSelect
              value={filters.projectId}
              allowClear={true}
              placeholder={'选择项目'}
              onChange={value => setFilters({ ...filters, projectId: value as number | undefined })}
              options={projectOptions}
            />
          </InsightsField>

          <InsightsField>
            组织分组
            <InsightsSelect
              value={filters.organization || undefined}
              allowClear={true}
              placeholder={'选择组织'}
              onChange={value => setFilters({ ...filters, organization: (value as string) || '' })}
              options={organizationOptions}
            />
          </InsightsField>
        </InsightsFilterGrid>
      </InsightsToolbar>

      <ErrorBox error={error} />

      <PeopleInsightsCards summary={insights.summary} />
      <PeopleInsightsCharts
        workloadChart={insights.workloadChart}
        trendChart={insights.trendChart}
        riskRanking={insights.riskRanking}
        details={insights.details}
        selectedDetail={selectedDetail}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />
    </PeopleShell>
  )
}
