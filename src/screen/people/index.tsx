import { ErrorBox } from 'components/libs'
import { useDebounce, useDocumentTitle } from 'utils'
import { useUsers } from 'utils/users'
import { List } from './list'
import { SearchPanel } from './search-panel'
import { Eyebrow, PeopleHero, PeopleListCard, PeopleShell, PeopleToolbar, SummaryCard, SummaryGrid } from './styles'
import { usePeopleSearchParams } from './util'

export const PeopleScreen = () => {
  useDocumentTitle('人员中心', false)

  const [param, setParam] = usePeopleSearchParams()
  const { data: users, isLoading, error } = useUsers(useDebounce(param, 300))
  const activePeopleCount = users?.length || 0
  const organizationCount = new Set((users || []).map(user => user.organization).filter(Boolean)).size
  const viewLabel = param.name || param.organization ? '筛选视图' : '完整名单'

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
