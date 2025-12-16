import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { fetchSongsStart, setSelectedSong, deleteSongStart } from '../redux/slices/songsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const SongList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { songs, loading, error } = useAppSelector((state) => state.songs);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  useEffect(() => {
    dispatch(fetchSongsStart());
  }, [dispatch]);

  const genres = useMemo(() => [...new Set(songs.map((song) => song.genre))], [songs]);
  const filteredSongs = useMemo(
    () => (selectedGenre ? songs.filter((song) => song.genre === selectedGenre) : songs),
    [selectedGenre, songs]
  );

  if (loading) return <LoadingContainer>Loading songs...</LoadingContainer>;
  if (error) return <ErrorContainer>Error: {error}</ErrorContainer>;

  return (
    <Container>
      <Title>Songs</Title>
      <FilterContainer>
        <Label htmlFor="genre-filter">Filter by Genre:</Label>
        <Select
          id="genre-filter"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>
      </FilterContainer>
      {filteredSongs.length === 0 ? (
        <EmptyMessage>No songs found. {selectedGenre ? `No songs in genre "${selectedGenre}".` : 'Add some!'}</EmptyMessage>
      ) : (
        <SongGrid>
          {filteredSongs.map((song) => (
            <SongCard key={song._id}>
              <SongTitle>{song.title}</SongTitle>
              <SongDetail>Artist: {song.artist}</SongDetail>
              <SongDetail>Album: {song.album}</SongDetail>
              <SongDetail>Genre: {song.genre}</SongDetail>
              <ButtonGroup>
                <EditButton onClick={() => dispatch(setSelectedSong(song))}>Edit</EditButton>
                <DeleteButton onClick={() => dispatch(deleteSongStart(song._id))}>Delete</DeleteButton>
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
  color: #333;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
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
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #d32f2f;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const SongGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const SongCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SongTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
`;

const SongDetail = styled.p`
  margin: 4px 0;
  color: #666;
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

  &:hover {
    background-color: #1565c0;
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

  &:hover {
    background-color: #b71c1c;
  }
`;

export default SongList;