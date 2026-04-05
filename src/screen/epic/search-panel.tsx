import { Button, Input } from 'antd'
import { Row } from 'components/libs'
import { UserSelect } from 'components/user-select'
import { useSetUrlSearchParam } from 'utils/url'
import { useEpicsSearchParams } from './util'

export const SearchPanel = () => {
  const searchParams = useEpicsSearchParams()
  const setSearchParams = useSetUrlSearchParam()

  const reset = () => {
    setSearchParams({
      name: undefined,
      processorId: undefined
    })
  }

  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: '20rem' }}
        placeholder={'任务组名称'}
        value={searchParams.name}
        onChange={evt => setSearchParams({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={'负责人'}
        value={searchParams.processorId}
        onChange={value => setSearchParams({ processorId: value })}
      />
      <Button onClick={reset}>清除筛选条件</Button>
    </Row>
  )
}
