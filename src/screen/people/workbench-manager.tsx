import { buildPeopleInsights } from './insights-model'
import { PeopleInsightsCards } from './insights-cards'
import {
  WorkbenchActionButton,
  WorkbenchCard,
  WorkbenchCardHeader,
  WorkbenchGrid,
  WorkbenchMetricList,
  WorkbenchMetricRow,
  WorkbenchNameButton
} from './workbench-styles'

interface PeopleWorkbenchManagerProps {
  insights: ReturnType<typeof buildPeopleInsights>
  selectedUserId?: number
  onSelectUser: (userId: number) => void
  onOpenInsights: () => void
}

export const PeopleWorkbenchManager = ({
  insights,
  selectedUserId,
  onSelectUser,
  onOpenInsights
}: PeopleWorkbenchManagerProps) => {
  const organizationSummary = Array.from(
    insights.details.reduce((summary, detail) => {
      const current = summary.get(detail.organization) || { memberCount: 0, loadScore: 0 }
      summary.set(detail.organization, {
        memberCount: current.memberCount + 1,
        loadScore: current.loadScore + detail.loadScore
      })
      return summary
    }, new Map<string, { memberCount: number; loadScore: number }>())
  )

  return (
    <>
      <PeopleInsightsCards summary={insights.summary} />

      <WorkbenchGrid>
        <WorkbenchCard>
          <WorkbenchCardHeader>
            <div>
              <h3>团队负载概览</h3>
              <p>优先查看负载最高的成员，快速定位当前的交付压力。</p>
            </div>
            <WorkbenchActionButton type="button" onClick={onOpenInsights}>
              查看分析洞察
            </WorkbenchActionButton>
          </WorkbenchCardHeader>

          <WorkbenchMetricList>
            {insights.workloadChart.slice(0, 5).map(item => (
              <WorkbenchMetricRow key={item.userId}>
                <WorkbenchNameButton
                  type="button"
                  data-active={item.userId === selectedUserId}
                  onClick={() => onSelectUser(item.userId)}
                >
                  {item.name}
                </WorkbenchNameButton>
                <span>{item.loadScore} 分负载</span>
              </WorkbenchMetricRow>
            ))}
          </WorkbenchMetricList>
        </WorkbenchCard>

        <WorkbenchCard>
          <h3>风险成员</h3>
          <p>用风险分和负载值判断最需要跟进的成员。</p>

          <WorkbenchMetricList>
            {insights.riskRanking.slice(0, 5).map(item => (
              <WorkbenchMetricRow key={item.userId}>
                <WorkbenchNameButton
                  type="button"
                  data-active={item.userId === selectedUserId}
                  onClick={() => onSelectUser(item.userId)}
                >
                  {item.name}
                </WorkbenchNameButton>
                <strong>{item.level}</strong>
              </WorkbenchMetricRow>
            ))}
            {!insights.riskRanking.length ? (
              <WorkbenchMetricRow>
                <span>当前没有需要重点跟进的风险成员。</span>
              </WorkbenchMetricRow>
            ) : null}
          </WorkbenchMetricList>
        </WorkbenchCard>

        <WorkbenchCard>
          <h3>组织覆盖</h3>
          <p>按组织查看成员覆盖和总体负载，判断资源分布是否均衡。</p>

          <WorkbenchMetricList>
            {organizationSummary.map(([organization, summary]) => (
              <WorkbenchMetricRow key={organization}>
                <span>{organization || '未分组组织'}</span>
                <strong>
                  {summary.memberCount} 人 / {summary.loadScore} 分
                </strong>
              </WorkbenchMetricRow>
            ))}
          </WorkbenchMetricList>
        </WorkbenchCard>
      </WorkbenchGrid>
    </>
  )
}
