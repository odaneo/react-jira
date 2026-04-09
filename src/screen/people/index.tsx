import { ErrorBox } from 'components/libs'
import styled from '@emotion/styled'
import { Button } from 'antd'
import { useDebounce, useDocumentTitle } from 'utils'
import { useUsers } from 'utils/users'
import { PeopleInsightsScreen } from './insights'
import { List } from './list'
import { SearchPanel } from './search-panel'
import { Eyebrow, PeopleHero, PeopleListCard, PeopleShell, PeopleToolbar, SummaryCard, SummaryGrid } from './styles'
import { PeopleView, usePeopleSearchParams, usePeopleView } from './util'
import { PeopleWorkbenchScreen } from './workbench-layout'

export const PeopleScreen = () => {
  const [view, setView] = usePeopleView()
  useDocumentTitle(view === 'insights' ? '人员分析' : view === 'workbench' ? '角色工作台' : '人员中心', false)

  if (view === 'insights') {
    return <PeopleInsightsScreen view={view} setView={setView} />
  }

  if (view === 'workbench') {
    return <PeopleWorkbenchScreen view={view} setView={setView} />
  }

  return <PeopleDirectoryScreen view={view} setView={setView} />
}

const PeopleDirectoryScreen = ({ view, setView }: { view: PeopleView; setView: (view: PeopleView) => void }) => {
  const [param, setParam] = usePeopleSearchParams()
  const { data: users, isLoading, error } = useUsers(useDebounce(param, 300))
  const activePeopleCount = users?.length || 0
  const organizationCount = new Set((users || []).map(user => user.organization).filter(Boolean)).size
  const viewLabel = param.name || param.organization ? '筛选结果' : '完整名单'

  return (
    <PeopleShell data-testid="people-shell" className="people-shell">
      <PeopleHero data-testid="people-hero" className="people-hero">
        <div>
          <Eyebrow>人员视图</Eyebrow>
          <h1>人员中心</h1>
          <p>集中查看团队成员，按姓名和组织快速筛选，为后续协作联动和分析视图打好基础。</p>
        </div>

        <SummaryGrid>
          <SummaryCard>
            <span>当前人数</span>
            <strong>{activePeopleCount} 位成员</strong>
          </SummaryCard>
          <SummaryCard>
            <span>组织数</span>
            <strong>{organizationCount} 个组织</strong>
          </SummaryCard>
          <SummaryCard>
            <span>当前视图</span>
            <strong>{viewLabel}</strong>
          </SummaryCard>
        </SummaryGrid>
      </PeopleHero>

      <PeopleToolbar data-testid="people-toolbar" className="people-toolbar">
        <ViewSwitch aria-label="人员视图切换">
          <ViewButton type="default" data-active={view === 'list'} onClick={() => setView('list')}>
            成员列表
          </ViewButton>
          <ViewButton type="default" data-active={view === 'insights'} onClick={() => setView('insights')}>
            分析洞察
          </ViewButton>
          <ViewButton type="default" data-active={view === 'workbench'} onClick={() => setView('workbench')}>
            角色工作台
          </ViewButton>
        </ViewSwitch>
        <h2>筛选成员</h2>
        <p>调整筛选条件后，列表和 URL 会保持同步，便于分享和回到当前视图。</p>
        <SearchPanel param={param} setParam={setParam} />
      </PeopleToolbar>

      <ErrorBox error={error} />

      <PeopleListCard>
        <List dataSource={users || []} loading={isLoading} />
      </PeopleListCard>
    </PeopleShell>
  )
}

const ViewSwitch = styled.div`
  display: inline-flex;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
`

const ViewButton = styled(Button)`
  min-width: 9.6rem;

  &[data-active='true'] {
    border-color: #1d4ed8;
    color: #1d4ed8;
    background: #dbeafe;
  }
`
