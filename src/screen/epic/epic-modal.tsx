import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect } from 'react'
import { UserSelect } from 'components/user-select'
import { useAddEpic, useEditEpic } from 'utils/epic'
import { useEpicModal, useEpicQueryKey, useProjectIdInUrl } from './util'

export const EpicModal = () => {
  const [form] = useForm()
  const projectId = useProjectIdInUrl()
  const { epicModalOpen, close, editingEpic, editingEpicId } = useEpicModal()
  const isEditing = Boolean(editingEpicId)
  const title = isEditing ? '编辑任务组' : '新建任务组'

  const useMutateEpic = isEditing ? useEditEpic : useAddEpic
  const { mutateAsync, isLoading } = useMutateEpic(useEpicQueryKey())

  useEffect(() => {
    form.setFieldsValue(editingEpic)
  }, [editingEpic, form])

  const closeModal = () => {
    close()
    form.resetFields()
  }

  const onFinish = async () => {
    await mutateAsync({
      ...editingEpic,
      ...form.getFieldsValue(),
      projectId,
      id: isEditing ? Number(editingEpicId) : undefined
    })
    closeModal()
  }

  return (
    <Modal
      title={title}
      visible={epicModalOpen}
      onCancel={closeModal}
      confirmLoading={isLoading}
      okText={'确认'}
      cancelText={'取消'}
      onOk={() => form.submit()}
      forceRender={true}
    >
      <Form form={form} layout={'vertical'} onFinish={onFinish}>
        <Form.Item label={'名称'} name={'name'} rules={[{ required: true, message: '请输入任务组名称' }]}>
          <Input placeholder={'请输入任务组名称'} />
        </Form.Item>
        <Form.Item label={'负责人'} name={'processorId'}>
          <UserSelect defaultOptionName={'负责人'} />
        </Form.Item>
        <Form.Item label={'描述'} name={'description'}>
          <Input.TextArea placeholder={'选填'} rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
