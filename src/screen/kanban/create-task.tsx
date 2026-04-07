import { Button, Card, Form, Input, Switch } from 'antd'
import { useEffect, useState } from 'react'
import { useAddTask } from 'utils/kanban'
import { clearObject } from 'utils'
import { UserSelect } from 'components/user-select'
import { TaskTypeSelect } from 'components/task-type-select'
import { EpicSelect } from 'components/epic-select'
import { useProjectIdInUrl, useTasksQueryKey, useTasksSearchParams } from './util'

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [inputMode, setInputMode] = useState(false)

  const toggle = () => setInputMode(mode => !mode)

  if (!inputMode) {
    return <div onClick={toggle}>+创建事务</div>
  }

  return <CreateTaskForm kanbanId={kanbanId} onCancel={toggle} />
}

const CreateTaskForm = ({ kanbanId, onCancel }: { kanbanId: number; onCancel: () => void }) => {
  const [form] = Form.useForm()
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey())
  const projectId = useProjectIdInUrl()
  const searchParams = useTasksSearchParams()

  const submit = async () => {
    const values = form.getFieldsValue()
    await addTask(
      clearObject({
        ...values,
        projectId,
        kanbanId
      })
    )
    form.resetFields()
    onCancel()
  }

  useEffect(() => {
    form.setFieldsValue({ epicId: searchParams.epicId, favorite: false })
  }, [form, searchParams.epicId])

  return (
    <Card>
      <Form form={form} layout={'vertical'} onFinish={submit}>
        <Form.Item label={'任务名'} name={'name'} rules={[{ required: true, message: '请输入任务名' }]}>
          <Input autoFocus={true} placeholder={'需要做些什么'} />
        </Form.Item>
        <Form.Item label={'任务组'} name={'epicId'}>
          <EpicSelect projectId={projectId} defaultOptionName={'任务组'} />
        </Form.Item>
        <Form.Item label={'经办人'} name={'processorId'}>
          <UserSelect defaultOptionName={'经办人'} />
        </Form.Item>
        <Form.Item label={'汇报人'} name={'reporterId'}>
          <UserSelect defaultOptionName={'汇报人'} />
        </Form.Item>
        <Form.Item label={'类型'} name={'typeId'}>
          <TaskTypeSelect defaultOptionName={'类型'} />
        </Form.Item>
        <Form.Item label={'备注'} name={'note'}>
          <Input.TextArea rows={2} placeholder={'选填'} />
        </Form.Item>
        <Form.Item label={'收藏'} name={'favorite'} valuePropName={'checked'}>
          <Switch />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: '0.8rem' }}>
            取消
          </Button>
          <Button htmlType={'submit'} type={'primary'}>
            创建
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
