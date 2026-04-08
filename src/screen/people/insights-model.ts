import dayjs from 'dayjs'
import { Project } from 'types/project'
import { Task } from 'types/task'
import { User } from 'types/user'
import { PeopleInsightsRange } from './util'

type InsightUser = Pick<User, 'id' | 'name' | 'organization'>
type InsightTask = Pick<Task, 'id' | 'name' | 'processorId' | 'reporterId' | 'projectId' | 'created'>
type InsightProject = Pick<Project, 'id' | 'name' | 'personId' | 'organization'>

interface BuildPeopleInsightsOptions {
  users: InsightUser[]
  tasks: InsightTask[]
  projects: InsightProject[]
  filters: {
    range: PeopleInsightsRange
    organization: string
    projectId?: number
  }
}

interface UserInsight {
  userId: number
  name: string
  organization: string
  ownedTaskCount: number
  reportedTaskCount: number
  projectCount: number
  completedTaskCount: number
  loadScore: number
  riskScore: number
  level: '正常' | '关注' | '高风险'
  projectNames: string[]
}

export const buildPeopleInsights = ({ users, tasks, projects, filters }: BuildPeopleInsightsOptions) => {
  const filteredUsers = users.filter(user =>
    filters.organization ? user.organization?.includes(filters.organization) : true
  )
  const userIds = new Set(filteredUsers.map(user => user.id))
  const scopedTasks = tasks.filter(task => {
    const matchesProject = filters.projectId ? task.projectId === filters.projectId : true
    const matchesUser =
      userIds.size === 0 ||
      userIds.has(task.processorId || 0) ||
      userIds.has(task.reporterId || 0) ||
      userIds.has(projects.find(project => project.id === task.projectId)?.personId || 0)
    const matchesRange = matchRange(task.created, filters.range)
    return matchesProject && matchesUser && matchesRange
  })
  const scopedProjects = projects.filter(project => {
    const matchesProject = filters.projectId ? project.id === filters.projectId : true
    const matchesOrganization = filters.organization ? project.organization?.includes(filters.organization) : true
    const matchesOwner = userIds.size === 0 || userIds.has(project.personId || 0)
    return matchesProject && matchesOrganization && matchesOwner
  })

  const userInsights = filteredUsers
    .map<UserInsight>(user => {
      const ownedTaskCount = scopedTasks.filter(task => task.processorId === user.id).length
      const reportedTaskCount = scopedTasks.filter(task => task.reporterId === user.id).length
      const projectCount = scopedProjects.filter(project => project.personId === user.id).length
      const completedTaskCount = scopedTasks.filter(
        task => (task.processorId === user.id || task.reporterId === user.id) && isCompletedTask(task)
      ).length
      const loadScore = ownedTaskCount * 2 + reportedTaskCount + projectCount
      const riskScore = loadScore + (completedTaskCount === 0 && ownedTaskCount > 0 ? 2 : 0)
      const level = riskScore >= 6 ? '高风险' : riskScore >= 4 ? '关注' : '正常'

      return {
        userId: user.id,
        name: user.name,
        organization: user.organization || '未填写组织',
        ownedTaskCount,
        reportedTaskCount,
        projectCount,
        completedTaskCount,
        loadScore,
        riskScore,
        level,
        projectNames: scopedProjects.filter(project => project.personId === user.id).map(project => project.name)
      }
    })
    .sort((left, right) => right.loadScore - left.loadScore || left.userId - right.userId)

  const completedTaskCount = scopedTasks.filter(task => isCompletedTask(task)).length
  const summary = {
    totalLoad: scopedTasks.length,
    progressRate: scopedTasks.length ? Math.round((completedTaskCount / scopedTasks.length) * 100) : 0,
    riskCount: userInsights.filter(user => user.level === '高风险').length,
    coveredProjectCount: scopedProjects.length
  }

  const workloadChart = userInsights.map(user => ({
    userId: user.userId,
    name: user.name,
    organization: user.organization,
    loadScore: user.loadScore,
    ownedTaskCount: user.ownedTaskCount,
    reportedTaskCount: user.reportedTaskCount,
    projectCount: user.projectCount
  }))

  const riskRanking = [...userInsights]
    .sort((left, right) => right.riskScore - left.riskScore || right.loadScore - left.loadScore)
    .filter(user => user.loadScore > 0 || user.projectCount > 0)

  const trendChart = buildTrendChart(scopedTasks)
  const selectedDetail = riskRanking[0] ? userInsights.find(user => user.userId === riskRanking[0].userId) : undefined

  return {
    filteredUsers,
    filteredTasks: scopedTasks,
    filteredProjects: scopedProjects,
    summary,
    workloadChart,
    riskRanking,
    trendChart,
    details: userInsights,
    selectedDetail
  }
}

const isCompletedTask = (task: Pick<Task, 'processorId' | 'reporterId' | 'projectId'>) =>
  Boolean(task.processorId && task.reporterId && task.projectId)

const matchRange = (created: number | undefined, range: PeopleInsightsRange) => {
  if (range === 'all' || !created) {
    return true
  }

  const diffDays = dayjs().diff(dayjs(created), 'day')
  return range === '30d' ? diffDays <= 30 : diffDays <= 90
}

const buildTrendChart = (tasks: InsightTask[]) => {
  const orderedTasks = [...tasks].sort((left, right) => (left.created || 0) - (right.created || 0))

  if (!orderedTasks.length) {
    return [{ label: '当前', 任务数: 0, 完整任务数: 0 }]
  }

  return orderedTasks.map((task, index) => ({
    label: task.created ? dayjs(task.created).format('MM-DD') : `任务${index + 1}`,
    任务数: 1,
    完整任务数: isCompletedTask(task) ? 1 : 0
  }))
}
