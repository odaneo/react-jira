import { Spin } from 'antd'
import { ButtonNoPadding, ErrorBox, Row, ScreenContainer } from 'components/libs'
import { useDocumentTitle, useDebounce } from 'utils'
import { useEpics } from 'utils/epic'
import { useTasks } from 'utils/task'
import { useUsers } from 'utils/users'
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
  const { data: users } = useUsers()
  const { data: tasks = [] } = useTasks({ projectId })
  const { data: epics = [], isLoading, error } = useEpics(useDebounce(searchParams, 200))

  return (
    <ScreenContainer>
      <Row between={true} marginBottom={2}>
        <h1>{currentProject?.name}任务组</h1>
        <ButtonNoPadding type={'link'} onClick={open}>
          新建任务组
        </ButtonNoPadding>
      </Row>
      <SearchPanel />
      <ErrorBox error={error} />
      {isLoading ? <Spin size={'large'} /> : <List dataSource={epics} users={users || []} tasks={tasks} />}
      <EpicModal />
      <EpicTaskPreview />
    </ScreenContainer>
  )
}
