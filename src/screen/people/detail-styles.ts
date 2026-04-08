import styled from '@emotion/styled'
import { Row, ScreenContainer } from 'components/libs'
import { Link } from 'react-router-dom'

export const DetailShell = styled(ScreenContainer)`
  gap: 2rem;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.1), transparent 28rem),
    linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
  border-radius: 2.4rem;
  overflow: auto;
`

export const DetailTopbar = styled(Row)`
  justify-content: space-between;
  align-items: center;
`

export const BackLink = styled(Link)`
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: none;
`

export const DetailHero = styled.section`
  padding: 2.4rem;
  border-radius: 2rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(29, 78, 216, 0.9));
  color: #ffffff;
  box-shadow: 0 2rem 4rem rgba(15, 23, 42, 0.16);

  h1,
  h2,
  p {
    margin: 0;
  }
`

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
  margin-top: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const MetaCard = styled.div`
  padding: 1.4rem 1.6rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);

  span {
    display: block;
    margin-bottom: 0.6rem;
    color: rgba(255, 255, 255, 0.72);
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  strong {
    font-size: 1.8rem;
  }
`

export const DetailSection = styled.section`
  padding: 2rem;
  border-radius: 1.8rem;
  background: #ffffff;
  box-shadow: 0 1.6rem 4rem rgba(15, 23, 42, 0.08);

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #0f172a;
  }

  p {
    margin: 0;
    color: #475569;
    line-height: 1.6;
  }
`
