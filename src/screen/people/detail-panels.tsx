import styled from '@emotion/styled'
import { Input } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Project } from 'types/project'
import { Task } from 'types/task'

interface PeopleDetailPanelsProps {
  userId: number
  tasks: Array<Pick<Task, 'id' | 'name' | 'processorId' | 'reporterId' | 'projectId'>>
  projects: Array<Pick<Project, 'id' | 'name' | 'personId' | 'organization'>>
}

export const PeopleDetailPanels = ({ userId, tasks, projects }: PeopleDetailPanelsProps) => {
  const [projectKeyword, setProjectKeyword] = useState('')
  const [collapsed, setCollapsed] = useState({
    ownedTasks: false,
    reportedTasks: false,
    ownedProjects: false
  })

  const matchProject = (projectId?: number) => {
    if (!projectKeyword) {
      return true
    }

    const projectName = projects.find(project => project.id === projectId)?.name || ''
    return projectName.toLowerCase().includes(projectKeyword.toLowerCase())
  }

  const ownedTasks = tasks.filter(task => task.processorId === userId && matchProject(task.projectId))
  const reportedTasks = tasks.filter(task => task.reporterId === userId && matchProject(task.projectId))
  const ownedProjects = projects.filter(
    project => project.personId === userId && project.name.toLowerCase().includes(projectKeyword.toLowerCase())
  )

  return (
    <PanelGrid>
      <PanelCard>
        <PanelHeader>
          <div>
            <h2>我负责的任务</h2>
            <p>查看当前由我推进的任务。</p>
          </div>
          <ToggleButton
            type="button"
            onClick={() => setCollapsed(state => ({ ...state, ownedTasks: !state.ownedTasks }))}
          >
            切换我负责的任务
          </ToggleButton>
        </PanelHeader>
        {!collapsed.ownedTasks ? (
          <TaskList>
            {ownedTasks.map(task => (
              <li key={task.id}>{task.name}</li>
            ))}
            {!ownedTasks.length ? <li>暂无负责中的任务</li> : null}
          </TaskList>
        ) : null}
      </PanelCard>

      <PanelCard>
        <PanelHeader>
          <div>
            <h2>我汇报的任务</h2>
            <p>查看需要我跟进汇报的任务。</p>
          </div>
          <ToggleButton
            type="button"
            onClick={() => setCollapsed(state => ({ ...state, reportedTasks: !state.reportedTasks }))}
          >
            切换我汇报的任务
          </ToggleButton>
        </PanelHeader>
        {!collapsed.reportedTasks ? (
          <TaskList>
            {reportedTasks.map(task => (
              <li key={task.id}>{task.name}</li>
            ))}
            {!reportedTasks.length ? <li>暂无需要我汇报的任务</li> : null}
          </TaskList>
        ) : null}
      </PanelCard>

      <PanelCard>
        <PanelHeader>
          <div>
            <h2>我参与的项目</h2>
            <p>快速跳转到我当前负责的项目看板。</p>
          </div>
          <ToggleButton
            type="button"
            onClick={() => setCollapsed(state => ({ ...state, ownedProjects: !state.ownedProjects }))}
          >
            切换我参与的项目
          </ToggleButton>
        </PanelHeader>
        {!collapsed.ownedProjects ? (
          <ProjectList>
            {ownedProjects.map(project => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}/kanban`}>{project.name}</Link>
                <span>{project.organization || '未填写组织'}</span>
              </li>
            ))}
            {!ownedProjects.length ? <li>暂无参与中的项目</li> : null}
          </ProjectList>
        ) : null}
      </PanelCard>

      <FilterCard>
        <h2>项目筛选</h2>
        <p>输入项目名称关键字，联动缩小当前协作视图。</p>
        <Input
          placeholder={'按项目名称筛选'}
          value={projectKeyword}
          onChange={event => setProjectKeyword(event.target.value)}
        />
      </FilterCard>
    </PanelGrid>
  )
}

const PanelGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.6rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`

const PanelCard = styled.article`
  padding: 2rem;
  border-radius: 1.8rem;
  background: #ffffff;
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);

  h2 {
    margin-top: 0;
    margin-bottom: 1.2rem;
    color: #0f172a;
  }
`

const FilterCard = styled(PanelCard)`
  grid-column: 1 / -1;

  p {
    margin: 0 0 1.2rem;
    color: #475569;
  }
`

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.2rem;

  h2 {
    margin-bottom: 0.6rem;
  }

  p {
    margin: 0;
    color: #475569;
    line-height: 1.5;
  }
`

const ToggleButton = styled.button`
  align-self: flex-start;
  border: none;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
`

const TaskList = styled.ul`
  padding-left: 1.8rem;
  margin: 0;
  color: #475569;

  li + li {
    margin-top: 0.8rem;
  }
`

const ProjectList = styled.ul`
  padding-left: 0;
  margin: 0;
  list-style: none;

  li + li {
    margin-top: 1rem;
  }

  a {
    display: block;
    color: #1d4ed8;
    font-weight: 600;
    text-decoration: none;
  }

  span {
    display: block;
    margin-top: 0.4rem;
    color: #64748b;
  }
`
