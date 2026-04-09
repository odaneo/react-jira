import styled from '@emotion/styled'
import { Button, Select } from 'antd'
import { PeopleToolbar } from './styles'

export const InsightsToolbar = styled(PeopleToolbar)`
  display: grid;
  gap: 1.6rem;
`

export const InsightsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;
  align-items: flex-start;
`

export const InsightsSwitch = styled.div`
  display: inline-flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`

export const InsightsSwitchButton = styled(Button)`
  min-width: 9.6rem;

  &[data-active='true'] {
    border-color: #1d4ed8;
    color: #1d4ed8;
    background: #dbeafe;
  }
`

export const InsightsFilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const InsightsField = styled.label`
  display: grid;
  gap: 0.8rem;
  color: #334155;
  font-weight: 600;
`

export const InsightsSelect = styled(Select)`
  width: 100%;
`
