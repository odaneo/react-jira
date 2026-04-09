import { ErrorBox } from 'components/libs'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useProjects } from 'utils/project'
import { useTasks } from 'utils/task'
import { useUsers } from 'utils/users'
import { Eyebrow, SummaryCard, SummaryGrid } from './styles'
import { buildPeopleInsights } from './insights-model'
import { usePeopleRoleMode } from './role-mode'
import { PeopleInsightsRange, PeopleView, usePeopleInsightsParams } from './util'
import { PeopleWorkbenchManager } from './workbench-manager'
import { PeopleWorkbenchMember } from './workbench-member'
import {
  RoleSwitch,
  RoleSwitchButton,
  WorkbenchField,
  WorkbenchFilterGrid,
  WorkbenchHero,
  WorkbenchMotionBody,
  WorkbenchSelect,
  WorkbenchShell,
  WorkbenchSwitch,
  WorkbenchSwitchButton,
  WorkbenchToolbar,
  WorkbenchTopbar
} from './workbench-styles'

export const PeopleWorkbenchScreen = ({ view, setView }: { view: PeopleView; setView: (view: PeopleView) => void }) => {
  const [filters, setFilters] = usePeopleInsightsParams()
  const [role, setRole] = usePeopleRoleMode()
  const { data: users = [], error: usersError } = useUsers()
  const { data: tasks = [], error: tasksError } = useTasks()
  const { data: projects = [], error: projectsError } = useProjects()
  const insights = useMemo(
    () =>
      buildPeopleInsights({
        users,
        tasks,
        projects,
        filters
      }),
    [users, tasks, projects, filters]
  )
  const error = usersError || tasksError || projectsError
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(insights.selectedDetail?.userId)

  useEffect(() => {
    if (!selectedUserId || !insights.details.some(detail => detail.userId === selectedUserId)) {
      setSelectedUserId(insights.selectedDetail?.userId)
    }
  }, [insights.details, insights.selectedDetail, selectedUserId])

  const projectOptions = projects.map(project => ({ label: project.name, value: project.id }))
  const organizationOptions = Array.from(new Set(users.map(user => user.organization).filter(Boolean))).map(value => ({
    label: value,
    value
  }))
  const roleLabel = role === 'manager' ? '管理者' : '成员'
  const roleDescription =
    role === 'manager'
      ? '从团队负载、风险和组织覆盖快速判断当前状态，再决定下一步跟进对象。'
      : '围绕单个成员查看任务、项目和协作细节，把管理判断转成具体执行动作。'

  return (
    <WorkbenchShell data-role={role}>
      <WorkbenchHero>
        <div>
          <Eyebrow>{role === 'manager' ? '管理者视角' : '成员视角'}</Eyebrow>
          <h1>角色工作台</h1>
          <p>{roleDescription}</p>
        </div>

        <SummaryGrid>
          <SummaryCard>
            <span>当前角色</span>
            <strong>{roleLabel}</strong>
          </SummaryCard>
          <SummaryCard>
            <span>覆盖成员</span>
            <strong>{insights.filteredUsers.length} 位成员</strong>
          </SummaryCard>
          <SummaryCard>
            <span>覆盖项目</span>
            <strong>{insights.summary.coveredProjectCount} 个项目</strong>
          </SummaryCard>
        </SummaryGrid>
      </WorkbenchHero>

      <WorkbenchToolbar>
        <WorkbenchTopbar>
          <div>
            <WorkbenchSwitch aria-label="人员视图切换">
              <WorkbenchSwitchButton type="default" data-active={view === 'list'} onClick={() => setView('list')}>
                成员列表
              </WorkbenchSwitchButton>
              <WorkbenchSwitchButton
                type="default"
                data-active={view === 'insights'}
                onClick={() => setView('insights')}
              >
                分析洞察
              </WorkbenchSwitchButton>
              <WorkbenchSwitchButton
                type="default"
                data-active={view === 'workbench'}
                onClick={() => setView('workbench')}
              >
                角色工作台
              </WorkbenchSwitchButton>
            </WorkbenchSwitch>
            <h2>角色工作台</h2>
            <p>切换角色时会保留当前筛选条件，便于在管理判断和成员执行之间来回切换。</p>
          </div>

          <RoleSwitch aria-label="角色视图切换">
            <RoleSwitchButton type="button" data-active={role === 'manager'} onClick={() => setRole('manager')}>
              管理者视角
            </RoleSwitchButton>
            <RoleSwitchButton type="button" data-active={role === 'member'} onClick={() => setRole('member')}>
              成员视角
            </RoleSwitchButton>
          </RoleSwitch>
        </WorkbenchTopbar>

        <WorkbenchFilterGrid>
          <WorkbenchField>
            时间范围
            <WorkbenchSelect
              value={filters.range}
              onChange={value => setFilters({ ...filters, range: value as PeopleInsightsRange })}
              options={[
                { label: '全部时间', value: 'all' },
                { label: '最近 30 天', value: '30d' },
                { label: '最近 90 天', value: '90d' }
              ]}
            />
          </WorkbenchField>

          <WorkbenchField>
            项目范围
            <WorkbenchSelect
              value={filters.projectId}
              allowClear={true}
              placeholder={'选择项目'}
              onChange={value => setFilters({ ...filters, projectId: value as number | undefined })}
              options={projectOptions}
            />
          </WorkbenchField>

          <WorkbenchField>
            组织分组
            <WorkbenchSelect
              value={filters.organization || undefined}
              allowClear={true}
              placeholder={'选择组织'}
              onChange={value => setFilters({ ...filters, organization: (value as string) || '' })}
              options={organizationOptions}
            />
          </WorkbenchField>
        </WorkbenchFilterGrid>
      </WorkbenchToolbar>

      <ErrorBox error={error} />

      <AnimatePresence exitBeforeEnter={true} initial={false}>
        <WorkbenchMotionBody
          key={role}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          {role === 'manager' ? (
            <PeopleWorkbenchManager
              insights={insights}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
              onOpenInsights={() => setView('insights')}
            />
          ) : (
            <PeopleWorkbenchMember
              insights={insights}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
              tasks={insights.filteredTasks}
              projects={insights.filteredProjects}
            />
          )}
        </WorkbenchMotionBody>
      </AnimatePresence>
    </WorkbenchShell>
  )
}
