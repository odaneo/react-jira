import { ErrorBox } from 'components/libs'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useProjects } from 'utils/project'
import { useTasks } from 'utils/task'
import { useUsers } from 'utils/users'
import { useDocumentTitle } from 'utils'
import { BackLink, DetailHero, DetailSection, DetailShell, DetailTopbar, MetaCard, MetaGrid } from './detail-styles'
import { PeopleDetailPanels } from './detail-panels'

export const PeopleDetailScreen = () => {
  const params = useParams()
  const userId = Number(params.userId)
  const { data, isLoading, error } = useUsers(userId ? { id: userId } : undefined)
  const { data: tasks = [] } = useTasks()
  const { data: projects = [] } = useProjects()
  const user = useMemo(() => data?.[0], [data])

  useDocumentTitle(user ? `${user.name} - 成员详情` : '成员详情', false)

  if (isLoading) {
    return <DetailShell>正在加载成员详情...</DetailShell>
  }

  if (!user) {
    return (
      <DetailShell>
        <DetailTopbar>
          <BackLink to={'/people'}>返回人员中心</BackLink>
        </DetailTopbar>
        <ErrorBox error={error} />
        <DetailSection>
          <h2>未找到该成员</h2>
          <p>请返回人员中心重新选择成员。</p>
        </DetailSection>
      </DetailShell>
    )
  }

  return (
    <DetailShell>
      <DetailTopbar>
        <BackLink to={'/people'}>返回人员中心</BackLink>
      </DetailTopbar>

      <DetailHero>
        <h2>成员详情</h2>
        <h1>{user.name}</h1>
        <MetaGrid>
          <MetaCard>
            <span>所属组织</span>
            <strong>{user.organization || '未填写'}</strong>
          </MetaCard>
          <MetaCard>
            <span>成员编号</span>
            <strong>#{user.id}</strong>
          </MetaCard>
          <MetaCard>
            <span>当前阶段</span>
            <strong>协作视图准备中</strong>
          </MetaCard>
        </MetaGrid>
      </DetailHero>

      <ErrorBox error={error} />

      <DetailSection>
        <h2>概览</h2>
        <p>这一页会承接后续的协作面板、项目联动和任务分组。当前阶段先确认成员详情路由和基础资料展示稳定可用。</p>
      </DetailSection>

      <PeopleDetailPanels userId={user.id} tasks={tasks} projects={projects} />
    </DetailShell>
  )
}
