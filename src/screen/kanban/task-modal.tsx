import { useForm } from 'antd/es/form/Form'
import { useEffect } from 'react'
import { useDeleteTask, useEditTask } from 'utils/task'
import { useProjectIdInUrl, useTaskModal, useTasksQueryKey } from './util'
import { Modal, Form, Input, Button, Switch } from 'antd'
import { UserSelect } from 'components/user-select'
import { TaskTypeSelect } from 'components/task-type-select'
import { EpicSelect } from 'components/epic-select'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export const TaskModal = () => {
  const [form] = useForm()
  const { editingTask, editingTaskId, close } = useTaskModal()
  const projectId = useProjectIdInUrl()

  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(useTasksQueryKey())

  const { mutate: deleteTask } = useDeleteTask(useTasksQueryKey())

  const onCancel = () => {
    close()
    form.resetFields()
  }

  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() })
    close()
  }

  const startDelete = () => {
    close()
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: '确定删除任务吗？',
      onOk() {
        return deleteTask({ id: Number(editingTaskId) })
      }
    })
  }

  useEffect(() => {
    form.setFieldsValue(editingTask)
  }, [form, editingTask])

  return (
    <Modal
      okText={'确认'}
      cancelText={'取消'}
      confirmLoading={editLoading}
      title={'编辑任务'}
      visible={!!editingTaskId}
      onCancel={onCancel}
      onOk={onOk}
      forceRender={true}
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item label={'任务名'} name={'name'} rules={[{ required: true, message: '请输入任务名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'经办人'} name={'processorId'}>
          <UserSelect defaultOptionName={'经办人'} />
        </Form.Item>
        <Form.Item label={'汇报人'} name={'reporterId'}>
          <UserSelect defaultOptionName={'汇报人'} />
        </Form.Item>
        <Form.Item label={'任务组'} name={'epicId'}>
          <EpicSelect projectId={projectId} defaultOptionName={'任务组'} />
        </Form.Item>
        <Form.Item label={'类型'} name={'typeId'}>
          <TaskTypeSelect />
        </Form.Item>
        <Form.Item label={'备注'} name={'note'}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label={'收藏'} name={'favorite'} valuePropName={'checked'}>
          <Switch />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={startDelete} style={{ fontSize: '14px' }} size={'small'}>
          删除
        </Button>
      </div>
    </Modal>
  )
}
