import { Dropdown, Table, TableProps, Menu, Modal } from 'antd'
import { ButtonNoPadding } from 'components/libs'
import { Pin } from 'components/pin'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { useDeleteProject, useEditProject } from 'utils/project'
import { useProjectModal, useProjectQueryKey } from './util'
import { Project } from 'types/project'
import React from 'react'

interface Users {
  id: number
  name: string
}

interface ListProps extends TableProps<Project> {
  users: Users[]
}

export const List = React.memo(
  ({ users, ...props }: ListProps): JSX.Element => {
    const { mutate } = useEditProject(useProjectQueryKey())

    const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin })

    return (
      <Table
        pagination={false}
        rowKey={'id'}
        columns={[
          {
            title: <Pin checked={true} disabled={true}></Pin>,
            render(value, project) {
              return <Pin checked={project.pin || false} onCheckedChange={pinProject(project.id)}></Pin>
            }
          },
          {
            title: '名称',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render(value, project) {
              return <Link to={String(project.id)}>{project.name}</Link>
            }
          },
          { title: '部门', dataIndex: 'organization' },
          {
            title: '负责人',
            render(value, project) {
              return <span>{users.find((user: Users) => user.id === project.personId)?.name || '未知'}</span>
            }
          },
          {
            title: '创建时间',
            render(value, project) {
              return <span>{project.created ? dayjs(project.created).format('YYYY-MM-DD') : '无'}</span>
            }
          },
          {
            render(value, project) {
              return <More project={project} />
            }
          }
        ]}
        {...props}
      ></Table>
    )
  }
)

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal()
  const editProject = (id: number) => () => startEdit(id)
  const { mutate } = useDeleteProject(useProjectQueryKey())
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: '确定删除这个项目么？',
      content: '点击确定删除',
      okText: '确定',
      onOk() {
        mutate({ id })
      }
    })
  }
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={editProject(project.id)} key={'edit'}>
            编辑
          </Menu.Item>
          <Menu.Item onClick={() => confirmDeleteProject(project.id)} key={'delete'}>
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
    </Dropdown>
  )
}
