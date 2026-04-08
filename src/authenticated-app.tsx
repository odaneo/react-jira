import styled from '@emotion/styled'
import { Dropdown, Menu, Button } from 'antd'
import { ButtonNoPadding, Row } from 'components/libs'
import { ProjectPopover } from 'components/project-popover'
import { useAuth } from 'context/auth-context'
import { Route, Routes, Navigate } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'
import { PeopleScreen } from 'screen/people'
import { ProjectScreen } from 'screen/project/index'
import { ProjectListScreen } from 'screen/project-list/index'
import { ProjectModal } from 'screen/project-list/project-modal'
import { resetRoute } from 'utils'

const AuthenticatedApp = () => {
  return (
    <Container>
      <BrowserRouter>
        <PageHeader />
        <Main>
          <MainContent>
            <Routes>
              <Route path={'/projects'} element={<ProjectListScreen />}></Route>
              <Route path={'/people'} element={<PeopleScreen />}></Route>
              <Route path={'/projects/:projectId/*'} element={<ProjectScreen />}></Route>
              <Navigate to={'/projects'} />
            </Routes>
          </MainContent>
        </Main>
        <ProjectModal />
      </BrowserRouter>
    </Container>
  )
}

export default AuthenticatedApp

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={'link'} onClick={resetRoute}>
          <h2>首页</h2>
        </ButtonNoPadding>
        <ProjectPopover />
        <Link to={'/people'}>人员中心</Link>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  )
}

const User = () => {
  const { logout, user } = useAuth()

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={'logout'}>
            <Button type={'link'} onClick={logout}>
              退出登录
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type={'link'}>你好，{user?.name}</Button>
    </Dropdown>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
`

const Header = styled(Row)`
  position: sticky;
  top: 0;
  min-height: 6rem;
  padding: 0 2.4rem;
  background: #ffffff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
`

const HeaderLeft = styled(Row)`
  a {
    color: #0f172a;
    font-weight: 600;
  }
`

const HeaderRight = styled.div``

const Main = styled.main`
  display: flex;
  overflow: hidden;
  min-height: 0;
  padding: 1.6rem 2.4rem 2.4rem;
`

const MainContent = styled.div`
  width: 100%;
  max-width: 144rem;
  margin: 0 auto;
  display: flex;
  min-height: 0;
`
