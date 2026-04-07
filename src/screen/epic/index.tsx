import styled from '@emotion/styled'
import { Spin } from 'antd'
import { ButtonNoPadding, ErrorBox, Row, ScreenContainer } from 'components/libs'
import { useDocumentTitle, useDebounce } from 'utils'
import { useEpics } from 'utils/epic'
import { useTasks } from 'utils/task'
import { EpicModal } from './epic-modal'
import { EpicTaskPreview } from './epic-task-preview'
import { List } from './list'
import { SearchPanel } from './search-panel'
import { useEpicModal, useEpicsSearchParams, useProjectInUrl, useProjectIdInUrl } from './util'

export const EpicScreen = () => {
  useDocumentTitle('任务组管理')
  const projectId = useProjectIdInUrl()
  const searchParams = useEpicsSearchParams()
  const { open } = useEpicModal()
  const { data: currentProject } = useProjectInUrl()
  const { data: tasks = [] } = useTasks({ projectId })
  const { data: epics = [], isLoading, error } = useEpics(useDebounce(searchParams, 200))

  return (
    <ScreenContainer>
      <PageHeader between={true} marginBottom={2}>
        <h1>{currentProject?.name}任务组</h1>
        <ButtonNoPadding type={'link'} onClick={open}>
          新建任务组
        </ButtonNoPadding>
      </PageHeader>
      <SearchPanel />
      <ErrorBox error={error} />
      {isLoading ? <Spin size={'large'} /> : <List dataSource={epics} tasks={tasks} />}
      <EpicModal />
      <EpicTaskPreview />
    </ScreenContainer>
  )
}

const PageHeader = styled(Row)`
  min-height: 4.8rem;
`
