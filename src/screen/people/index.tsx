import { ErrorBox } from 'components/libs'
import { useDebounce, useDocumentTitle } from 'utils'
import { useUsers } from 'utils/users'
import { List } from './list'
import { SearchPanel } from './search-panel'
import { Eyebrow, PeopleHero, PeopleListCard, PeopleShell, PeopleToolbar, SummaryCard, SummaryGrid } from './styles'
import { usePeopleSearchParams } from './util'

export const PeopleScreen = () => {
  useDocumentTitle('People Hub', false)

  const [param, setParam] = usePeopleSearchParams()
  const { data: users, isLoading, error } = useUsers(useDebounce(param, 300))
  const activePeopleCount = users?.length || 0
  const organizationCount = new Set((users || []).map(user => user.organization).filter(Boolean)).size
  const viewLabel = param.name || param.organization ? 'Filtered view' : 'Full roster'

  return (
    <PeopleShell data-testid="people-shell" className="people-shell">
      <PeopleHero data-testid="people-hero" className="people-hero">
        <div>
          <Eyebrow>People</Eyebrow>
          <h1>People Hub</h1>
          <p>Browse teammates, filter by name or organization, and prepare the ground for deeper people workflows.</p>
        </div>

        <SummaryGrid>
          <SummaryCard>
            <span>Live headcount</span>
            <strong>{activePeopleCount} active people</strong>
          </SummaryCard>
          <SummaryCard>
            <span>Organizations</span>
            <strong>{organizationCount} groups visible</strong>
          </SummaryCard>
          <SummaryCard>
            <span>Current mode</span>
            <strong>{viewLabel}</strong>
          </SummaryCard>
        </SummaryGrid>
      </PeopleHero>

      <PeopleToolbar data-testid="people-toolbar" className="people-toolbar">
        <h2>Refine roster</h2>
        <p>Update the filters to narrow the visible teammates and keep the URL in sync.</p>
        <SearchPanel param={param} setParam={setParam} />
      </PeopleToolbar>

      <ErrorBox error={error} />

      <PeopleListCard>
        <List dataSource={users || []} loading={isLoading} />
      </PeopleListCard>
    </PeopleShell>
  )
}
