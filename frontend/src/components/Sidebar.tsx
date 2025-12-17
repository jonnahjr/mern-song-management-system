import React from 'react';
import styled from '@emotion/styled';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <SidebarContainer>
      <Logo>🎵 Song Manager</Logo>
      <Menu>
        <MenuItem
          active={activeSection === 'songs'}
          onClick={() => setActiveSection('songs')}
        >
          🎶 Songs
        </MenuItem>
        <MenuItem
          active={activeSection === 'stats'}
          onClick={() => setActiveSection('stats')}
        >
          📊 Statistics
        </MenuItem>
        <MenuItem
          active={activeSection === 'profile'}
          onClick={() => setActiveSection('profile')}
        >
          👤 Profile
        </MenuItem>
      </Menu>
      <ProfileSection>
        <Avatar>🧑</Avatar>
        <UserInfo>
          <UserName>Admin User</UserName>
          <UserRole>Manager</UserRole>
        </UserInfo>
      </ProfileSection>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 200px;
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

const ProfileSection = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(25, 118, 210, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 10px;
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  font-weight: bold;
`;

const UserRole = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

export default Sidebar;