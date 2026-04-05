import { Drawer, List, Spin } from 'antd'
import { useEpic } from 'utils/epic'
import { useTasks } from 'utils/task'
import { useEpicPreview, useProjectIdInUrl } from './util'

export const EpicTaskPreview = () => {
  const { epicPreviewId, close } = useEpicPreview()
  const projectId = useProjectIdInUrl()
  const { data: epic } = useEpic(epicPreviewId)

  const { data: tasks, isLoading } = useTasks({
    projectId,
    epicId: epicPreviewId
  })

  return (
    <Drawer
      width={'40rem'}
      title={epic ? `${epic.name} - 关联任务` : '关联任务'}
      visible={Boolean(epicPreviewId)}
      onClose={close}
    >
      {isLoading ? (
        <Spin size={'large'} />
      ) : (
        <List
          dataSource={tasks || []}
          renderItem={task => (
            <List.Item key={task.id}>
              <List.Item.Meta title={task.name} description={task.note || '无描述'} />
            </List.Item>
          )}
        />
      )}
    </Drawer>
  )
}
