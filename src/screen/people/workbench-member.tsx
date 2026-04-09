import { Project } from 'types/project'
import { Task } from 'types/task'
import { buildPeopleInsights } from './insights-model'
import { PeopleDetailPanels } from './detail-panels'
import {
  WorkbenchCard,
  WorkbenchEmptyState,
  WorkbenchGrid,
  WorkbenchPillButton,
  WorkbenchPillList,
  WorkbenchStatCard,
  WorkbenchStatGrid,
  WorkbenchTag
} from './workbench-styles'

interface PeopleWorkbenchMemberProps {
  insights: ReturnType<typeof buildPeopleInsights>
  selectedUserId?: number
  onSelectUser: (userId: number) => void
  tasks: Array<Pick<Task, 'id' | 'name' | 'processorId' | 'reporterId' | 'projectId'>>
  projects: Array<Pick<Project, 'id' | 'name' | 'personId' | 'organization'>>
}

export const PeopleWorkbenchMember = ({
  insights,
  selectedUserId,
  onSelectUser,
  tasks,
  projects
}: PeopleWorkbenchMemberProps) => {
  const selectedDetail = insights.details.find(detail => detail.userId === selectedUserId) || insights.selectedDetail
  const totalTaskCount = (selectedDetail?.ownedTaskCount || 0) + (selectedDetail?.reportedTaskCount || 0)

  if (!selectedDetail) {
    return <WorkbenchEmptyState>当前筛选条件下没有可查看的成员。</WorkbenchEmptyState>
  }

  return (
    <>
      <WorkbenchCard>
        <h3>当前聚焦成员</h3>
        <p>从成员视角查看任务、项目和协作细节，方便快速进入执行状态。</p>

        <WorkbenchStatGrid>
          <WorkbenchStatCard>
            <span>当前成员</span>
            <strong>{selectedDetail.name}</strong>
          </WorkbenchStatCard>
          <WorkbenchStatCard>
            <span>当前负载</span>
            <strong>{selectedDetail.loadScore} 分</strong>
          </WorkbenchStatCard>
          <WorkbenchStatCard>
            <span>协作总量</span>
            <strong>{totalTaskCount} 项</strong>
          </WorkbenchStatCard>
          <WorkbenchStatCard>
            <span>风险级别</span>
            <strong>{selectedDetail.level}</strong>
          </WorkbenchStatCard>
        </WorkbenchStatGrid>

        <WorkbenchGrid>
          <WorkbenchCard>
            <h3>{selectedDetail.name}</h3>
            <p>{selectedDetail.organization || '未分组组织'}</p>
            <p>
              <WorkbenchTag>{selectedDetail.level}</WorkbenchTag>
            </p>
            <p>{selectedDetail.projectNames.length ? selectedDetail.projectNames.join('、') : '当前没有关联项目。'}</p>
          </WorkbenchCard>

          <WorkbenchCard>
            <h3>成员切换</h3>
            <p>保持当前筛选条件，直接在不同成员之间切换执行视角。</p>
            <WorkbenchPillList>
              {insights.details.map(detail => (
                <li key={detail.userId}>
                  <WorkbenchPillButton
                    type="button"
                    data-active={detail.userId === selectedUserId}
                    onClick={() => onSelectUser(detail.userId)}
                  >
                    {detail.name}
                  </WorkbenchPillButton>
                </li>
              ))}
            </WorkbenchPillList>
          </WorkbenchCard>

          <WorkbenchCard>
            <h3>执行提示</h3>
            <p>先看我负责的任务，再看我汇报的任务，最后结合我参与的项目确认协作边界。</p>
          </WorkbenchCard>
        </WorkbenchGrid>
      </WorkbenchCard>

      <PeopleDetailPanels userId={selectedDetail.userId} tasks={tasks} projects={projects} />
    </>
  )
}
