import React from 'react'
import { Dropdown, Menu, Modal, Table, TableProps } from 'antd'
import { Link } from 'react-router-dom'
import { ButtonNoPadding } from 'components/libs'
import { Epic } from 'types/epic'
import { Task } from 'types/task'
import { useDeleteEpic } from 'utils/epic'
import { useEpicModal, useEpicPreview, useEpicQueryKey } from './util'
import dayjs from 'dayjs'

interface ListProps extends TableProps<Epic> {
  tasks: Task[]
}

export const List = React.memo(({ tasks, ...props }: ListProps) => {
  return (
    <Table
      pagination={false}
      rowKey={'id'}
      columns={[
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '关联任务数',
          render(value, epic) {
            return tasks.filter(task => task.epicId === epic.id).length
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          render(value) {
            return value || '-'
          }
        },
        {
          title: '开始日期',
          render(value, epic) {
            return epic.start ? dayjs(epic.start).format('YYYY-MM-DD') : '-'
          }
        },
        {
          title: '结束日期',
          render(value, epic) {
            return epic.end ? dayjs(epic.end).format('YYYY-MM-DD') : '-'
          }
        },
        {
          title: '操作',
          render(value, epic) {
            return <Actions epic={epic} />
          }
        }
      ]}
      {...props}
    />
  )
})

const Actions = ({ epic }: { epic: Epic }) => {
  const { startEdit } = useEpicModal()
  const { open } = useEpicPreview()
  const { mutate } = useDeleteEpic(useEpicQueryKey())

  const confirmDeleteEpic = (id: number) => {
    Modal.confirm({
      title: '确定删除这个任务组吗？',
      content: '删除后不可恢复',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        mutate({ id })
      }
    })
  }

  return (
    <>
      <ButtonNoPadding type={'link'} onClick={() => open(epic.id)}>
        查看任务
      </ButtonNoPadding>
      <Link to={`/projects/${epic.projectId}/kanban?epicId=${epic.id}`}>去看板</Link>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key={'edit'} onClick={() => startEdit(epic.id)}>
              编辑
            </Menu.Item>
            <Menu.Item key={'delete'} onClick={() => confirmDeleteEpic(epic.id)}>
              删除
            </Menu.Item>
          </Menu>
        }
      >
        <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
      </Dropdown>
    </>
  )
}
