import styled from '@emotion/styled'
import { Button, Select } from 'antd'
import { motion } from 'framer-motion'
import { PeopleHero, PeopleShell, PeopleToolbar } from './styles'

export const WorkbenchShell = styled(PeopleShell)`
  --role-primary: #0f766e;
  --role-soft: rgba(15, 118, 110, 0.12);
  --role-soft-strong: rgba(15, 118, 110, 0.18);
  --role-deep: #134e4a;
  background: radial-gradient(circle at top left, var(--role-soft), transparent 30rem),
    linear-gradient(180deg, #f8fafc 0%, #eef8f6 100%);

  &[data-role='member'] {
    --role-primary: #1d4ed8;
    --role-soft: rgba(29, 78, 216, 0.12);
    --role-soft-strong: rgba(29, 78, 216, 0.18);
    --role-deep: #1e3a8a;
    background: radial-gradient(circle at top left, var(--role-soft), transparent 30rem),
      linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
  }
`

export const WorkbenchHero = styled(PeopleHero)`
  background: linear-gradient(135deg, var(--role-primary), var(--role-deep));
`

export const WorkbenchToolbar = styled(PeopleToolbar)`
  display: grid;
  gap: 1.6rem;
`

export const WorkbenchTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;
  align-items: flex-start;
`

export const WorkbenchSwitch = styled.div`
  display: inline-flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`

export const WorkbenchSwitchButton = styled(Button)`
  min-width: 9.6rem;

  &[data-active='true'] {
    border-color: var(--role-primary);
    color: var(--role-primary);
    background: var(--role-soft);
  }
`

export const RoleSwitch = styled(WorkbenchSwitch)`
  padding: 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #dbe4f0;
`

export const RoleSwitchButton = styled.button`
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #475569;
  padding: 0.8rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.24s ease, color 0.24s ease, transform 0.24s ease;

  &[data-active='true'] {
    background: var(--role-soft-strong);
    color: var(--role-primary);
  }
`

export const WorkbenchFilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const WorkbenchField = styled.label`
  display: grid;
  gap: 0.8rem;
  color: #334155;
  font-weight: 600;
`

export const WorkbenchSelect = styled(Select)`
  width: 100%;
`

export const WorkbenchMotionBody = styled(motion.div)`
  display: grid;
  gap: 1.6rem;
`

export const WorkbenchGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.6rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`

export const WorkbenchCard = styled.article`
  padding: 2rem;
  border-radius: 1.8rem;
  background: #ffffff;
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.9);

  h3 {
    margin: 0;
    color: #0f172a;
  }

  p {
    margin: 0.8rem 0 0;
    color: #475569;
    line-height: 1.6;
  }
`

export const WorkbenchCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  align-items: flex-start;

  p {
    margin-bottom: 0;
  }
`

export const WorkbenchActionButton = styled.button`
  border: 1px solid var(--role-primary);
  border-radius: 999px;
  background: var(--role-soft);
  color: var(--role-primary);
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: pointer;
`

export const WorkbenchMetricList = styled.ul`
  list-style: none;
  margin: 1.6rem 0 0;
  padding: 0;
`

export const WorkbenchMetricRow = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #e2e8f0;

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  strong {
    color: #0f172a;
  }

  span {
    color: #475569;
  }
`

export const WorkbenchNameButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  text-align: left;

  &[data-active='true'] {
    color: var(--role-primary);
  }
`

export const WorkbenchStatGrid = styled.div`
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

export const WorkbenchStatCard = styled.div`
  padding: 1.4rem 1.6rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(226, 232, 240, 0.92);

  span {
    display: block;
    color: #475569;
  }

  strong {
    display: block;
    margin-top: 0.8rem;
    color: #0f172a;
    font-size: 2rem;
    line-height: 1.2;
  }
`

export const WorkbenchTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: var(--role-soft);
  color: var(--role-primary);
  font-size: 1.2rem;
  font-weight: 700;
`

export const WorkbenchPillList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 1.6rem 0 0;
  padding: 0;
  list-style: none;
`

export const WorkbenchPillButton = styled.button`
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #f8fafc;
  color: #334155;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-weight: 600;

  &[data-active='true'] {
    border-color: var(--role-primary);
    background: var(--role-soft);
    color: var(--role-primary);
  }
`

export const WorkbenchEmptyState = styled.div`
  padding: 2rem;
  border-radius: 1.8rem;
  background: #ffffff;
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);
  color: #475569;
`
