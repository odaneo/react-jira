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
          <PanelHeading>
            <PanelTitleRow>
              <h2>我负责的任务</h2>
              <FoldButton
                type="button"
                aria-label={collapsed.ownedTasks ? '展开我负责的任务' : '收起我负责的任务'}
                aria-expanded={!collapsed.ownedTasks}
                onClick={() => setCollapsed(state => ({ ...state, ownedTasks: !state.ownedTasks }))}
              >
                {collapsed.ownedTasks ? '+' : '-'}
              </FoldButton>
            </PanelTitleRow>
            {!collapsed.ownedTasks ? <p>查看当前由我推进的任务。</p> : null}
          </PanelHeading>
        </PanelHeader>
        {!collapsed.ownedTasks ? (
          <PanelContent>
            <TaskList>
              {ownedTasks.map(task => (
                <li key={task.id}>{task.name}</li>
              ))}
              {!ownedTasks.length ? <li>暂无负责中的任务</li> : null}
            </TaskList>
          </PanelContent>
        ) : null}
      </PanelCard>

      <PanelCard>
        <PanelHeader>
          <PanelHeading>
            <PanelTitleRow>
              <h2>我汇报的任务</h2>
              <FoldButton
                type="button"
                aria-label={collapsed.reportedTasks ? '展开我汇报的任务' : '收起我汇报的任务'}
                aria-expanded={!collapsed.reportedTasks}
                onClick={() => setCollapsed(state => ({ ...state, reportedTasks: !state.reportedTasks }))}
              >
                {collapsed.reportedTasks ? '+' : '-'}
              </FoldButton>
            </PanelTitleRow>
            {!collapsed.reportedTasks ? <p>查看需要我跟进汇报的任务。</p> : null}
          </PanelHeading>
        </PanelHeader>
        {!collapsed.reportedTasks ? (
          <PanelContent>
            <TaskList>
              {reportedTasks.map(task => (
                <li key={task.id}>{task.name}</li>
              ))}
              {!reportedTasks.length ? <li>暂无需要我汇报的任务</li> : null}
            </TaskList>
          </PanelContent>
        ) : null}
      </PanelCard>

      <PanelCard>
        <PanelHeader>
          <PanelHeading>
            <PanelTitleRow>
              <h2>我参与的项目</h2>
              <FoldButton
                type="button"
                aria-label={collapsed.ownedProjects ? '展开我参与的项目' : '收起我参与的项目'}
                aria-expanded={!collapsed.ownedProjects}
                onClick={() => setCollapsed(state => ({ ...state, ownedProjects: !state.ownedProjects }))}
              >
                {collapsed.ownedProjects ? '+' : '-'}
              </FoldButton>
            </PanelTitleRow>
            {!collapsed.ownedProjects ? <p>快速跳转到我当前负责的项目看板。</p> : null}
          </PanelHeading>
        </PanelHeader>
        {!collapsed.ownedProjects ? (
          <PanelContent>
            <ProjectList>
              {ownedProjects.map(project => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}/kanban`}>{project.name}</Link>
                  <span>{project.organization || '未填写组织'}</span>
                </li>
              ))}
              {!ownedProjects.length ? <li>暂无参与中的项目</li> : null}
            </ProjectList>
          </PanelContent>
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
  display: block;

  h2 {
    margin: 0;
  }

  p {
    margin: 0.8rem 0 0;
    color: #475569;
    line-height: 1.5;
  }
`

const PanelHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const PanelTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.2rem;
`

const FoldButton = styled.button`
  flex: 0 0 auto;
  width: 3.2rem;
  height: 3.2rem;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.8rem;
  line-height: 1;

  &:hover {
    background: #dbeafe;
  }
`

const PanelContent = styled.div`
  margin-top: 1.4rem;
  padding-top: 1.4rem;
  border-top: 1px solid #e2e8f0;
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
