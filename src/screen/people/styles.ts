import styled from '@emotion/styled'
import { ScreenContainer } from 'components/libs'

export const PeopleShell = styled(ScreenContainer)`
  --people-primary: #1d4ed8;
  --people-bg: #f8fafc;
  --people-card: #ffffff;
  --people-text: #0f172a;
  --people-subtext: #475569;
  gap: 2rem;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 28rem),
    linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
  border-radius: 2.4rem;
  overflow: auto;
`

export const PeopleHero = styled.section`
  padding: 2.4rem;
  border-radius: 2rem;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.96), rgba(15, 23, 42, 0.94)), #0f172a;
  color: #ffffff;
  box-shadow: 0 2rem 4rem rgba(15, 23, 42, 0.16);

  h1 {
    margin: 0.8rem 0;
    font-size: 3.2rem;
    line-height: 1.1;
  }

  p {
    max-width: 64rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.6;
  }
`

export const Eyebrow = styled.span`
  display: inline-flex;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
  margin-top: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const SummaryCard = styled.div`
  padding: 1.6rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.08);

  strong {
    display: block;
    margin-top: 0.6rem;
    font-size: 2rem;
    line-height: 1.2;
  }

  span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`

export const PeopleToolbar = styled.section`
  padding: 1.8rem 2rem;
  border-radius: 1.8rem;
  background: var(--people-card);
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);

  h2 {
    margin: 0;
    color: var(--people-text);
  }

  p {
    margin: 0.6rem 0 1.6rem;
    color: var(--people-subtext);
  }
`

export const PeopleListCard = styled.section`
  padding: 1.2rem;
  border-radius: 1.8rem;
  background: var(--people-card);
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);
`
