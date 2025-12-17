import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { fetchSongsStart, setSelectedSong, deleteSongStart, setSearch, setSelectedGenre, setSelectedArtist, setSelectedSort } from '../redux/slices/songsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const SongList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { songs, loading, error, search, selectedGenre, selectedArtist, selectedSort } = useAppSelector((state) => state.songs);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    dispatch(fetchSongsStart());
  }, [dispatch, search, selectedGenre, selectedArtist, selectedSort]);

  const handleSearch = () => {
    dispatch(setSearch(searchInput));
  };

  const handleClear = () => {
    setSearchInput('');
    dispatch(setSearch(''));
  };

  const genres = useMemo(() => [...new Set(songs.map((song) => song.genre))], [songs]);
  const artists = useMemo(() => [...new Set(songs.map((song) => song.artist))], [songs]);

  const exportToCSV = (songs: any[]) => {
    const headers = ['Title', 'Artist', 'Album', 'Genre'];
    const csv = [headers.join(',')];
    songs.forEach(song => {
      csv.push([song.title, song.artist, song.album, song.genre].join(','));
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'songs.csv';
    a.click();
  };

  if (loading) return (
    <SongGrid>
      {Array.from({ length: 6 }).map((_, i) => (
        <SongCard key={i} style={{ background: '#f0f0f0' }}>
          <div style={{ height: '20px', background: '#ddd', marginBottom: '8px', borderRadius: '4px' }}></div>
          <div style={{ height: '16px', background: '#ddd', marginBottom: '4px', borderRadius: '4px' }}></div>
          <div style={{ height: '16px', background: '#ddd', marginBottom: '4px', borderRadius: '4px' }}></div>
          <div style={{ height: '16px', background: '#ddd', borderRadius: '4px' }}></div>
        </SongCard>
      ))}
    </SongGrid>
  );
  if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;

  return (
    <Container>
      <Title>Songs</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search songs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>🔍</SearchButton>
        <ClearButton onClick={handleClear}>❌</ClearButton>
      </SearchContainer>
      <FilterContainer>
        <div>
          <Label htmlFor="genre-filter">Filter by Genre:</Label>
          <Select
            id="genre-filter"
            value={selectedGenre}
            onChange={(e) => dispatch(setSelectedGenre(e.target.value))}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="artist-filter">Filter by Artist:</Label>
          <Select
            id="artist-filter"
            value={selectedArtist}
            onChange={(e) => dispatch(setSelectedArtist(e.target.value))}
          >
            <option value="">All Artists</option>
            {artists.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="sort-filter">Sort by:</Label>
          <Select
            id="sort-filter"
            value={selectedSort}
            onChange={(e) => dispatch(setSelectedSort(e.target.value))}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="title:asc">Title A-Z</option>
            <option value="title:desc">Title Z-A</option>
            <option value="artist:asc">Artist A-Z</option>
            <option value="artist:desc">Artist Z-A</option>
            <option value="album:asc">Album A-Z</option>
            <option value="album:desc">Album Z-A</option>
          </Select>
        </div>
        <ExportButton onClick={() => exportToCSV(songs)}>Export CSV</ExportButton>
      </FilterContainer>
      {songs.length === 0 ? (
        <EmptyMessage>No songs found. Add some!</EmptyMessage>
      ) : (
        <SongGrid>
          {songs.map((song) => (
            <SongCard key={song._id}>
              <SongTitle>{song.title}</SongTitle>
              <SongDetail>Artist: {song.artist}</SongDetail>
              <SongDetail>Album: {song.album}</SongDetail>
              <SongDetail>Genre: {song.genre}</SongDetail>
              <ButtonGroup>
                <EditButton onClick={() => dispatch(setSelectedSong(song))}>Edit</EditButton>
                <DeleteButton onClick={() => {
                  if (window.confirm('Are you sure you want to delete this song?')) {
                    dispatch(deleteSongStart(song._id));
                  }
                }}>Delete</DeleteButton>
              </ButtonGroup>
            </SongCard>
          ))}
        </SongGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#333')};
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#4b5563' : '#ccc')};
  border-radius: 8px 0 0 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const SearchButton = styled.button`
  padding: 12px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #1565c0;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

const ClearButton = styled.button`
  padding: 12px 16px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 8px;

  &:hover {
    background-color: #555;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const ExportButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }
`;

const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#333')};
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#4b5563' : '#ccc')};
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#9ca3af' : '#666')};
`;

const SongGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow-x: visible;
  }
`;

const SongCard = styled.div`
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? '#374151' : '#ddd')};
  border-radius: 8px;
  padding: 16px;
  background-color: ${({ theme }) => (theme.mode === 'dark' ? '#111827' : '#fff')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const SongTitle = styled.h3`
  margin: 0 0 8px 0;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#e5e7eb' : '#333')};
`;

const SongDetail = styled.p`
  margin: 4px 0;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#9ca3af' : '#666')};
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const EditButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #1565c0;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const DeleteButton = styled.button`
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #b71c1c;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

export default SongList;