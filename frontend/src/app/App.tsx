import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleTheme } from '../redux/slices/themeSlice';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import SongForm from '../components/SongForm';
import SongList from '../components/SongList';
import StatsDashboard from '../features/stats/StatsDashboard';

const App: React.FC = () => {
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const [activeSection, setActiveSection] = useState('songs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const background = theme.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';

  const renderContent = () => {
    switch (activeSection) {
      case 'songs':
        return (
          <>
            <TopGrid>
              <Card style={{ background: theme.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
                <CardTitle style={{ color: theme.mode === 'dark' ? '#e5e5e5' : '#1f2937' }}>➕ Manage Songs</CardTitle>
                <SongForm />
              </Card>
              <Card style={{ background: theme.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
                <SongList />
              </Card>
            </TopGrid>
          </>
        );
      case 'stats':
        return (
          <Card style={{ background: theme.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
            <StatsDashboard />
          </Card>
        );
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <AppContainer style={{ background }}>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <MainContent marginLeft={sidebarOpen ? '250px' : '0'}>
        <AppHeader>
          <HamburgerButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </HamburgerButton>
          <HeaderTitle>🎵 MERN Song Management System</HeaderTitle>
          <HeaderSubtitle>Addis Software Test Project</HeaderSubtitle>
          <ToggleButton onClick={() => dispatch(toggleTheme())}>
            {theme.mode === 'light' ? '🌙' : '☀️'}
          </ToggleButton>
        </AppHeader>
        <Main>
          {renderContent()}
        </Main>
      </MainContent>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  position: relative;
`;

const MainContent = styled.div<{ marginLeft: string }>`
  margin-left: ${props => props.marginLeft};

  @media (min-width: 769px) {
    margin-left: 250px;
  }
`;

const AppHeader = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #fff;
  padding: 32px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const HeaderSubtitle = styled.p`
  margin: 8px 0 0 0;
  opacity: 0.9;
  font-size: 18px;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Main = styled.main`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Card = styled.section`
  background: ${props => props.theme.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CardTitle = styled.h2`
  margin-bottom: 20px;
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const HamburgerButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 1001;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export default App;
