import React from 'react';
import styled from '@emotion/styled';

const Profile: React.FC = () => {
  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>🧑</Avatar>
        <UserDetails>
          <UserName>Admin User</UserName>
          <UserEmail>admin@songmanager.com</UserEmail>
        </UserDetails>
      </ProfileHeader>
      <ProfileStats>
        <StatItem>
          <StatLabel>Total Songs Managed</StatLabel>
          <StatValue>150</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Account Created</StatLabel>
          <StatValue>Jan 2024</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Last Login</StatLabel>
          <StatValue>Today</StatValue>
        </StatItem>
      </ProfileStats>
      <ProfileActions>
        <ActionButton>Edit Profile</ActionButton>
        <ActionButton>Change Password</ActionButton>
        <ActionButton>Logout</ActionButton>
      </ProfileActions>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-right: 20px;
`;

const UserDetails = styled.div``;

const UserName = styled.h2`
  margin: 0;
  color: #333;
`;

const UserEmail = styled.p`
  margin: 5px 0 0 0;
  color: #666;
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: #1565c0;
  }
`;

export default Profile;