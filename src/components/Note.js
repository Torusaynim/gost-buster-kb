import './../App.css';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import { Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

function Note(props) {
    const { id } = useParams();
    const backUri = 'http://127.0.0.1:5000';
    const [note, setNote] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
          try {
            const response = await fetch(`${backUri}/api/get-Note/${String(id)}`);
            if (response.ok) {
              const noteData = await response.json();
              setNote(noteData);
            } else {
              // Handle error case
              console.error('Failed to fetch note:', response.status);
            }
          } catch (error) {
            // Handle error case
            console.error('Failed to fetch note:', error);
          }
        };
    
        fetchNote();
    }, [backUri, id]);
    
    return (
      <div className="App" style={{ marginTop: '60px' }}>
        <Container maxWidth="sm">
          <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 2 }} >
              <h1>Запись {id}</h1>
              {note ? (
                <Typography variant="body1" mb={3} align="justify">
                    текст - {note.note}
                </Typography>
              ) : (
                <Typography variant="body1" mb={3} align="justify">
                    Загрузка... либо такой записи не существует
                </Typography>
              )}
            </Paper>
          </Box>
        </Container>
      </div>
    );
}

export default Note;
