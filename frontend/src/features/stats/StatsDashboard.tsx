import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchStatsStart } from '../../redux/slices/statsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const StatsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.stats);

  useEffect(() => {
    dispatch(fetchStatsStart());
  }, [dispatch]);

  if (loading) return <LoadingContainer>Loading statistics...</LoadingContainer>;
  if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;
  if (!stats) return <EmptyContainer>No statistics available</EmptyContainer>;

  return (
    <Container>
      <Title>Statistics Dashboard</Title>
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalSongs}</StatValue>
          <StatLabel>Total Songs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalArtists}</StatValue>
          <StatLabel>Total Artists</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalAlbums}</StatValue>
          <StatLabel>Total Albums</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalGenres}</StatValue>
          <StatLabel>Total Genres</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionTitle>Songs per Genre</SectionTitle>
      <ListContainer>
        {stats.songsPerGenre.map((item) => (
          <ListItem key={item.genre}>
            <span>{item.genre}</span>
            <span>{item.count} songs</span>
          </ListItem>
        ))}
      </ListContainer>

      <SectionTitle>Top Genres (Top 3)</SectionTitle>
      <ListContainer>
        {stats.topGenres.map((item) => (
          <ListItem key={item.genre}>
            <span>{item.genre}</span>
            <span>{item.count} songs</span>
          </ListItem>
        ))}
      </ListContainer>

      <SectionTitle>Songs per Artist</SectionTitle>
      <ListContainer>
        {stats.songsPerArtist.map((item) => (
          <ListItem key={item.artist}>
            <span>{item.artist}</span>
            <span>{item.count} songs</span>
          </ListItem>
        ))}
      </ListContainer>

      <SectionTitle>Albums per Artist</SectionTitle>
      <ListContainer>
        {stats.albumsPerArtist.map((item) => (
          <ListItem key={item.artist}>
            <span>{item.artist}</span>
            <span>{item.albumCount} albums</span>
          </ListItem>
        ))}
      </ListContainer>

      <SectionTitle>Songs per Album</SectionTitle>
      <ListContainer>
        {stats.songsPerAlbum.map((item) => (
          <ListItem key={item.album}>
            <span>{item.album}</span>
            <span>{item.count} songs</span>
          </ListItem>
        ))}
      </ListContainer>

      <SectionTitle>Latest Songs</SectionTitle>
      <ListContainer>
        {stats.latestSongs.map((item) => (
          <ListItem key={`${item.title}-${item.createdAt}`}>
            <span>{item.title}</span>
            <span>
              {item.artist} • {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </ListItem>
        ))}
      </ListContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #d32f2f;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #666;
`;

const SectionTitle = styled.h3`
  margin: 30px 0 15px 0;
  color: #333;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 5px;
`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #fafafa;

  span:first-of-type {
    font-weight: bold;
    color: #333;
  }

  span:last-of-type {
    color: #666;
  }
`;

export default StatsDashboard;