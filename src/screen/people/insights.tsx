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
import { PeopleInsightsRange, PeopleView, usePeopleInsightsParams } from './util'

export const PeopleInsightsScreen = ({ view, setView }: { view: PeopleView; setView: (view: PeopleView) => void }) => {
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
          <p>围绕成员负载、协作效率和风险状态，形成可比较的团队交付洞察。</p>
        </div>

        <SummaryGrid>
          <SummaryCard>
            <span>覆盖成员</span>
            <strong>{insights.filteredUsers.length} 位成员</strong>
          </SummaryCard>
          <SummaryCard>
            <span>风险成员</span>
            <strong>{insights.summary.riskCount} 位成员</strong>
          </SummaryCard>
          <SummaryCard>
            <span>当前视图</span>
            <strong>分析洞察</strong>
          </SummaryCard>
        </SummaryGrid>
      </PeopleHero>

      <InsightsToolbar>
        <InsightsHeader>
          <div>
            <h2>人员分析</h2>
            <p>通过时间范围、项目范围和组织分组观察团队状态变化。</p>
          </div>
          <InsightsSwitch aria-label="人员视图切换">
            <InsightsSwitchButton type="default" data-active={view === 'list'} onClick={() => setView('list')}>
              成员列表
            </InsightsSwitchButton>
            <InsightsSwitchButton type="default" data-active={view === 'insights'} onClick={() => setView('insights')}>
              分析洞察
            </InsightsSwitchButton>
            <InsightsSwitchButton
              type="default"
              data-active={view === 'workbench'}
              onClick={() => setView('workbench')}
            >
              角色工作台
            </InsightsSwitchButton>
          </InsightsSwitch>
        </InsightsHeader>

        <InsightsFilterGrid>
          <InsightsField>
            时间范围
            <InsightsSelect
              value={filters.range}
              onChange={value => setFilters({ ...filters, range: value as PeopleInsightsRange })}
              options={[
                { label: '全部时间', value: 'all' },
                { label: '最近 30 天', value: '30d' },
                { label: '最近 90 天', value: '90d' }
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
