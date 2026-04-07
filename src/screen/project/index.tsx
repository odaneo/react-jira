import { Link } from 'react-router-dom'
import { Route, Routes, Navigate, useLocation } from 'react-router'
import { KanbanScreen } from 'screen/kanban/index'
import { EpicScreen } from 'screen/epic/index'
import styled from '@emotion/styled'
import { Menu } from 'antd'

const useRouteType = () => {
  const units = useLocation().pathname.split('/')
  return units[units.length - 1]
}

export const ProjectScreen = () => {
  const routeType = useRouteType()
  return (
    <Container>
      <Aside className={'project-aside'}>
        <NavMenu className={'project-nav'} mode={'inline'} selectedKeys={[routeType]}>
          <Menu.Item key={'kanban'}>
            <Link to={'kanban'}>看板</Link>
          </Menu.Item>
          <Menu.Item key={'epic'}>
            <Link to={'epic'}>任务组</Link>
          </Menu.Item>
        </NavMenu>
      </Aside>
      <Main>
        <Routes>
          <Route path={'/kanban'} element={<KanbanScreen />}></Route>
          <Route path={'/epic'} element={<EpicScreen />}></Route>
          <Navigate to={window.location.pathname + '/kanban'} replace={true} />
        </Routes>
      </Main>
    </Container>
  )
}

const Aside = styled.aside`
  background-color: #f8fafc;
  display: flex;
  width: 20rem;
  min-width: 20rem;
  overflow-y: auto;
  border-right: 1px solid #e2e8f0;
`

const NavMenu = styled(Menu)`
  width: 100%;
`

const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  min-width: 0;
  flex: 1;
`

const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .project-aside {
      width: 100%;
      min-width: 100%;
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .project-nav {
      min-width: max-content;
      border-right: none !important;
      white-space: nowrap;
    }

    .ant-menu-inline {
      display: flex;
    }

    .ant-menu-item {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
  }
`
