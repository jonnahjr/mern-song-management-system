import React from 'react';
import styled from '@emotion/styled';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen, setIsOpen }) => {
  const handleMenuClick = (section: string) => {
    setActiveSection(section);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
      <Logo>🎵 Song Manager</Logo>
      <Menu>
        <MenuItem
          active={activeSection === 'songs'}
          onClick={() => handleMenuClick('songs')}
        >
          🎶 Songs
        </MenuItem>
        <MenuItem
          active={activeSection === 'stats'}
          onClick={() => handleMenuClick('stats')}
        >
          📊 Statistics
        </MenuItem>
      </Menu>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 250px;
  height: 100vh;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  padding: 20px;
  position: fixed;
  left: ${props => (props.isOpen ? '0' : '-260px')};
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.4);
  transition: left 0.3s ease;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 200px;
    left: ${props => (props.isOpen ? '0' : '-220px')};
  }
`;

const Logo = styled.h1`
  font-size: 20px;
  margin-bottom: 40px;
  text-align: center;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li<{ active: boolean }>`
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  background: ${props => props.active ? 'rgba(25, 118, 210, 0.2)' : 'transparent'};

  &:hover {
    background: rgba(25, 118, 210, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;

  @media (min-width: 769px) {
    display: none;
  }
`;

export default Sidebar;