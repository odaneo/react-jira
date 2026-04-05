import { Button, Input } from 'antd'
import { Row } from 'components/libs'
import { UserSelect } from 'components/user-select'
import { useSetUrlSearchParam } from 'utils/url'
import { useProjectIdInUrl, useTasksSearchParams } from './util'
import { TaskTypeSelect } from 'components/task-type-select'
import { EpicSelect } from 'components/epic-select'

export const SearchPanel = () => {
  const searchParams = useTasksSearchParams()
  const projectId = useProjectIdInUrl()
  const setSearchParams = useSetUrlSearchParam()

  const reset = () => {
    setSearchParams({
      name: undefined,
      typeId: undefined,
      processorId: undefined,
      reporterId: undefined,
      epicId: undefined
    })
  }

  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: `20rem` }}
        placeholder={`任务名`}
        value={searchParams.name}
        onChange={evt => setSearchParams({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={'经办人'}
        value={searchParams.processorId}
        onChange={value => setSearchParams({ processorId: value })}
      />
      <UserSelect
        defaultOptionName={'汇报人'}
        value={searchParams.reporterId}
        onChange={value => setSearchParams({ reporterId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={'类型'}
        value={searchParams.typeId}
        onChange={value => setSearchParams({ typeId: value })}
      />
      <EpicSelect
        projectId={projectId}
        defaultOptionName={'任务组'}
        value={searchParams.epicId}
        onChange={value => setSearchParams({ epicId: value })}
      />
      <Button onClick={reset}>清空筛选条件</Button>
    </Row>
  )
}
