import styled from '@emotion/styled'

interface PeopleInsightsCardsProps {
  summary: {
    totalLoad: number
    progressRate: number
    riskCount: number
    coveredProjectCount: number
  }
}

export const PeopleInsightsCards = ({ summary }: PeopleInsightsCardsProps) => {
  return (
    <CardGrid>
      <InsightCard data-tone="normal">
        <span>任务负载</span>
        <strong>{summary.totalLoad} 项任务</strong>
      </InsightCard>
      <InsightCard data-tone="normal">
        <span>协作进度</span>
        <strong>{summary.progressRate}%</strong>
      </InsightCard>
      <InsightCard data-tone={summary.riskCount > 0 ? 'risk' : 'watch'}>
        <span>风险成员</span>
        <strong>{summary.riskCount} 位</strong>
      </InsightCard>
      <InsightCard data-tone="watch">
        <span>覆盖项目</span>
        <strong>{summary.coveredProjectCount} 个</strong>
      </InsightCard>
    </CardGrid>
  )
}

const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const InsightCard = styled.article`
  padding: 1.8rem;
  border-radius: 1.8rem;
  background: #ffffff;
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;

  span {
    display: block;
    color: #475569;
  }

  strong {
    display: block;
    margin-top: 0.8rem;
    font-size: 2.4rem;
    color: #0f172a;
  }

  &[data-tone='risk'] {
    border-color: rgba(220, 38, 38, 0.24);
    background: linear-gradient(180deg, rgba(254, 242, 242, 0.9), #ffffff);
  }

  &[data-tone='watch'] {
    border-color: rgba(217, 119, 6, 0.24);
    background: linear-gradient(180deg, rgba(255, 247, 237, 0.9), #ffffff);
  }
`
