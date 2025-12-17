import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { fetchStatsStart } from '../../redux/slices/statsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const StatsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.stats);

  const [mode, setMode] = useState<'genre' | 'artist'>('genre');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const maxGenreCount = useMemo(
    () => {
      const list = stats?.songsPerGenre ?? [];
      return list.length ? Math.max(...list.map((g) => g.count)) : 0;
    },
    [stats]
  );

  const maxArtistCount = useMemo(
    () => {
      const list = stats?.songsPerArtist ?? [];
      return list.length ? Math.max(...list.map((a) => a.count)) : 0;
    },
    [stats]
  );

  useEffect(() => {
    dispatch(fetchStatsStart());
    setLastUpdated(new Date());
  }, [dispatch]);

  if (loading) return <LoadingContainer>Loading statistics...</LoadingContainer>;
  if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;
  if (!stats) return <EmptyContainer>No statistics available</EmptyContainer>;

  const handleRefresh = () => {
    dispatch(fetchStatsStart());
    setLastUpdated(new Date());
  };

  return (
    <Container>
      <HeaderSection>
        <Title>📊 Real-Time Statistics Dashboard</Title>
        <RefreshSection>
          <RefreshButton onClick={handleRefresh} disabled={loading}>
            🔄 {loading ? 'Updating...' : 'Refresh'}
          </RefreshButton>
          <LastUpdated>Last updated: {lastUpdated.toLocaleTimeString()}</LastUpdated>
        </RefreshSection>
      </HeaderSection>
      <StatsGrid>
        <StatCard>
          <StatValue><AnimatedCounter value={stats.totalSongs} /></StatValue>
          <StatLabel>Total Songs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue><AnimatedCounter value={stats.totalArtists} /></StatValue>
          <StatLabel>Total Artists</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue><AnimatedCounter value={stats.totalAlbums} /></StatValue>
          <StatLabel>Total Albums</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue><AnimatedCounter value={stats.totalGenres} /></StatValue>
          <StatLabel>Total Genres</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.averageSongsPerAlbum.toFixed(1)}</StatValue>
          <StatLabel>Avg Songs / Album</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionHeader>
        <SectionTitle>Distribution Overview</SectionTitle>
        <ToggleGroup>
          <ToggleButton
            type="button"
            $active={mode === 'genre'}
            onClick={() => setMode('genre')}
          >
            By Genre
          </ToggleButton>
          <ToggleButton
            type="button"
            $active={mode === 'artist'}
            onClick={() => setMode('artist')}
          >
            By Artist
          </ToggleButton>
        </ToggleGroup>
      </SectionHeader>

      {mode === 'genre' ? (
        <>
          <SubSectionTitle>Top 5 Genres</SubSectionTitle>
          <ChartList>
            {stats.top5Genres.map((item) => (
              <ChartRow key={item.genre}>
                <span>{item.genre}</span>
                <BarBackground>
                  <BarFill
                    style={{
                      width: maxGenreCount ? `${(item.count / maxGenreCount) * 100}%` : '0%',
                    }}
                  />
                </BarBackground>
                <CountLabel>{item.count}</CountLabel>
              </ChartRow>
            ))}
          </ChartList>
        </>
      ) : (
        <>
          <SubSectionTitle>Top Artists</SubSectionTitle>
          <ChartList>
            {stats.songsPerArtist.slice(0, 5).map((item) => (
              <ChartRow key={item.artist}>
                <span>{item.artist}</span>
                <BarBackground>
                  <BarFill
                    style={{
                      width: maxArtistCount ? `${(item.count / maxArtistCount) * 100}%` : '0%',
                    }}
                  />
                </BarBackground>
                <CountLabel>{item.count}</CountLabel>
              </ChartRow>
            ))}
          </ChartList>
        </>
      )}

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

      <SectionTitle>Artist → Albums → Songs</SectionTitle>
      <HierarchyList>
        {stats.artistAlbumSongTree.map((artistNode) => (
          <HierarchyArtist key={artistNode.artist}>
            <strong>{artistNode.artist}</strong>
            <HierarchyAlbumList>
              {artistNode.albums.map((albumNode) => (
                <li key={albumNode.album}>
                  <AlbumTitle>{albumNode.album}</AlbumTitle>
                  <SongBadges>
                    {albumNode.songs.map((song) => (
                      <SongBadge key={`${song.title}-${song.createdAt}`}>
                        {song.title} <em>({song.genre})</em>
                      </SongBadge>
                    ))}
                  </SongBadges>
                </li>
              ))}
            </HierarchyAlbumList>
          </HierarchyArtist>
        ))}
      </HierarchyList>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
`;

const RefreshSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover:not(:disabled) {
    background: #1565c0;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#9ca3af' : '#666')};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#333')};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#9ca3af' : '#666')};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #f97373;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#9ca3af' : '#666')};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => (theme.mode === 'dark' ? '#111827' : '#fff')};
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#374151' : '#ddd')};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #38bdf8;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#9ca3af' : '#666')};
`;

const SectionTitle = styled.h3`
  margin: 30px 0 15px 0;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#333')};
  border-bottom: 2px solid #1976d2;
  padding-bottom: 5px;
`;

const SubSectionTitle = styled.h4`
  margin: 10px 0 12px 0;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#444')};
`;

const ListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 10px;
  gap: 16px;
  flex-wrap: wrap;
`;

const ToggleGroup = styled.div`
  display: inline-flex;
  border-radius: 999px;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#111827' : '#eef2ff')};
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#1976d2' : 'transparent')};
  color: ${({ $active, theme }) =>
    $active ? '#fff' : theme.mode === 'dark' ? '#e5e7eb' : '#1f2937'};
  transition: background 0.2s ease, color 0.2s ease;
`;

const ChartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 120px) 1fr auto;
  align-items: center;
  gap: 10px;
  font-size: 14px;
`;

const BarBackground = styled.div`
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#374151' : '#e5e7eb')};
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  transition: width 1s ease-out;
`;

const CountLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#374151')};
`;

const HierarchyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HierarchyArtist = styled.li`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#374151' : '#e5e7eb')};
  background: ${({ theme }) => (theme.mode === 'dark' ? '#111827' : '#fafafa')};
`;

const HierarchyAlbumList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AlbumTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#111827')};
`;

const SongBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SongBadge = styled.span`
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#1d4ed8' : '#e0f2fe')};
  color: #f9fafb;
  font-size: 12px;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#374151' : '#eee')};
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => (theme.mode === 'dark' ? '#020617' : '#fafafa')};

  span:first-of-type {
    font-weight: bold;
    color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#333')};
  }

  span:last-of-type {
    color: ${({ theme }) => (theme.mode === 'dark' ? '#9ca3af' : '#666')};
  }
`;

export default StatsDashboard;