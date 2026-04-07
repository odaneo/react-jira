import { List } from './list'
import { SearchPanel } from './search-panel'
import { useDebounce, useDocumentTitle } from '../../utils/index'
import styled from '@emotion/styled'
import { useProjects } from 'utils/project'
import { useUsers } from 'utils/users'
import { useProjectModal, useProjectsSearchParams } from './util'
import { Row, ButtonNoPadding, ErrorBox } from 'components/libs'

export const ProjectListScreen = (): JSX.Element => {
  useDocumentTitle('任务列表', false)

  const [param, setParam] = useProjectsSearchParams()
  const { open } = useProjectModal()

  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200))
  const { data: users } = useUsers()

  return (
    <Container>
      <PageHeader between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding onClick={open} type={'link'}>
          创建项目
        </ButtonNoPadding>
      </PageHeader>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      <ErrorBox error={error} />
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  )
}

ProjectListScreen.whyDidYouRender = false

const Container = styled.div`
  padding: 2.4rem;
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
`

const PageHeader = styled(Row)`
  min-height: 4.8rem;
  margin-bottom: 1.6rem;
`
