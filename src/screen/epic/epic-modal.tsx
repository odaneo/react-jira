import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect } from 'react'
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
    form.setFieldsValue({
      ...editingEpic,
      start: editingEpic?.start ? new Date(editingEpic.start).toISOString().slice(0, 10) : undefined,
      end: editingEpic?.end ? new Date(editingEpic.end).toISOString().slice(0, 10) : undefined
    })
  }, [editingEpic, form])

  const closeModal = () => {
    close()
    form.resetFields()
  }

  const onFinish = async () => {
    const values = form.getFieldsValue()
    await mutateAsync({
      ...editingEpic,
      ...values,
      start: values.start ? new Date(values.start).getTime() : undefined,
      end: values.end ? new Date(values.end).getTime() : undefined,
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
        <Form.Item label={'描述'} name={'description'}>
          <Input.TextArea placeholder={'选填'} rows={4} />
        </Form.Item>
        <Form.Item label={'开始日期'} name={'start'}>
          <Input type={'date'} />
        </Form.Item>
        <Form.Item label={'结束日期'} name={'end'}>
          <Input type={'date'} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
