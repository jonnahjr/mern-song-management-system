import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { addSongStart, updateSongStart, setSelectedSong } from '../redux/slices/songsSlice';
import type { SongFormData } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const SongForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedSong, loading } = useAppSelector((state) => state.songs);

  const [formData, setFormData] = useState<SongFormData>({
    title: '',
    artist: '',
    album: '',
    genre: '',
  });

  const isEditing = !!selectedSong;

  useEffect(() => {
    if (selectedSong) {
      setFormData({
        title: selectedSong.title,
        artist: selectedSong.artist,
        album: selectedSong.album,
        genre: selectedSong.genre,
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
      });
    }
  }, [selectedSong]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedSong) {
      dispatch(updateSongStart({ id: selectedSong._id, data: formData }));
    } else {
      dispatch(addSongStart(formData));
    }
    // Clear form after submit
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: '',
    });
    dispatch(setSelectedSong(null));
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: '',
    });
    dispatch(setSelectedSong(null));
  };

  return (
    <FormContainer>
      <FormTitle>{isEditing ? 'Edit Song' : 'Add New Song'}</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="artist">Artist</Label>
          <Input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="album">Album</Label>
          <Input
            type="text"
            id="album"
            name="album"
            value={formData.album}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="genre">Genre</Label>
          <Input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <ButtonGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Song' : 'Add Song'}
          </SubmitButton>
          {isEditing && (
            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>
          )}
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`;

const FormTitle = styled.h3`
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover:not(:disabled) {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: #666;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #555;
  }
`;

export default SongForm;