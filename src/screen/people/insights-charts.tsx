import styled from '@emotion/styled'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface PeopleInsightsChartsProps {
  workloadChart: Array<{
    userId: number
    name: string
    organization: string
    loadScore: number
    ownedTaskCount: number
    reportedTaskCount: number
    projectCount: number
  }>
  trendChart: Array<{
    label: string
    任务数: number
    完整任务数: number
  }>
  riskRanking: Array<{
    userId: number
    name: string
    organization: string
    loadScore: number
    riskScore: number
    level: '正常' | '关注' | '高风险'
  }>
  details: Array<{
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
  }>
  selectedDetail?: {
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
  selectedUserId?: number
  onSelectUser: (userId: number) => void
}

interface ClickableBarPayload {
  userId: number
  name: string
}

interface ClickableBarProps {
  active: boolean
  ariaLabel: string
  onSelect: (userId: number) => void
  payload: ClickableBarPayload
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
}

export const PeopleInsightsCharts = ({
  workloadChart,
  trendChart,
  riskRanking,
  details,
  selectedDetail,
  selectedUserId,
  onSelectUser
}: PeopleInsightsChartsProps) => {
  return (
    <ChartsGrid>
      <ChartCard>
        <h3>负载分布</h3>
        <ChartViewport>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadChart} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="loadScore"
                fill="#1d4ed8"
                radius={[10, 10, 0, 0]}
                shape={(barProps: unknown) => {
                  const props = barProps as Omit<ClickableBarProps, 'active' | 'ariaLabel' | 'onSelect'>

                  return (
                    <ClickableBarShape
                      {...props}
                      active={selectedUserId === props.payload.userId}
                      ariaLabel={`查看${props.payload.name}的负载明细`}
                      onSelect={onSelectUser}
                    />
                  )
                }}
              >
                <LabelList dataKey="loadScore" position="top" fill="#0f172a" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartViewport>
      </ChartCard>

      <ChartCard>
        <h3>推进趋势</h3>
        <ChartViewport>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendChart} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="任务数" stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="完整任务数" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartViewport>
      </ChartCard>

      <ChartCard>
        <h3>风险排行</h3>
        <ChartViewport>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskRanking} layout="vertical" margin={{ top: 16, right: 12, left: 12, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={90} />
              <Tooltip />
              <Bar
                dataKey="riskScore"
                radius={[0, 10, 10, 0]}
                shape={(barProps: unknown) => {
                  const props = barProps as Omit<ClickableBarProps, 'active' | 'ariaLabel' | 'onSelect'>

                  return (
                    <ClickableBarShape
                      {...props}
                      active={selectedUserId === props.payload.userId}
                      ariaLabel={`查看${props.payload.name}的风险明细`}
                      onSelect={onSelectUser}
                    />
                  )
                }}
              >
                {riskRanking.map(item => (
                  <Cell
                    key={item.userId}
                    fill={item.level === '高风险' ? '#dc2626' : item.level === '关注' ? '#d97706' : '#16a34a'}
                  />
                ))}
                <LabelList dataKey="level" position="right" fill="#0f172a" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartViewport>
      </ChartCard>

      <DetailCard>
        <h3>联动明细</h3>
        {selectedDetail ? (
          <DetailList>
            <li>
              <span>成员</span>
              <strong>{selectedDetail.name}</strong>
            </li>
            <li>
              <span>负载分</span>
              <strong>{selectedDetail.loadScore}</strong>
            </li>
            <li>
              <span>风险级别</span>
              <strong>{selectedDetail.level}</strong>
            </li>
            <li>
              <span>关联项目</span>
              <strong>{selectedDetail.projectNames.join('、') || '暂无项目'}</strong>
            </li>
            <li>
              <span>负责任务</span>
              <strong>{selectedDetail.ownedTaskCount} 项</strong>
            </li>
            <li>
              <span>汇报任务</span>
              <strong>{selectedDetail.reportedTaskCount} 项</strong>
            </li>
          </DetailList>
        ) : (
          <p>暂无可展示的联动明细。</p>
        )}
        <DetailShortcutList>
          {details.map(detail => (
            <li key={detail.userId}>
              <button
                type="button"
                data-active={detail.userId === selectedUserId}
                onClick={() => onSelectUser(detail.userId)}
              >
                {detail.name}
              </button>
            </li>
          ))}
        </DetailShortcutList>
      </DetailCard>
    </ChartsGrid>
  )
}

const ClickableBarShape = ({
  active,
  ariaLabel,
  onSelect,
  payload,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = '#1d4ed8'
}: ClickableBarProps) => {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10}
        ry={10}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        fill={active ? '#7c3aed' : fill}
        opacity={active ? 0.95 : 0.88}
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
        onClick={() => onSelect(payload.userId)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(payload.userId)
          }
        }}
      />
    </g>
  )
}

const ChartsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.6rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`

const ChartCard = styled.article`
  padding: 2rem;
  border-radius: 1.8rem;
  background: #ffffff;
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);

  h3 {
    margin: 0 0 1.2rem;
    color: #0f172a;
  }
`

const DetailCard = styled(ChartCard)``

const ChartViewport = styled.div`
  width: 100%;
  height: 28rem;
`

const ChartList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    gap: 1.2rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid #e2e8f0;
  }
`

const DetailList = styled(ChartList)`
  li {
    align-items: flex-start;
  }
`

const DetailShortcutList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 1.6rem 0 0;
  padding: 0;
  list-style: none;

  button {
    border: 1px solid #cbd5e1;
    border-radius: 999px;
    background: #f8fafc;
    color: #334155;
    padding: 0.6rem 1rem;
    cursor: pointer;
  }

  button[data-active='true'] {
    border-color: #1d4ed8;
    background: #dbeafe;
    color: #1d4ed8;
  }
`
