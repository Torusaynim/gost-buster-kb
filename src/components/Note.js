import './../App.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import NetworkGraph from './NetworkGraph';
import Pdf from './../assets/Test.pdf';

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

    const handleOpenFile = () => {
      window.open(Pdf, '_blank');
    };
    
    return (
      <div className="App" style={{ marginTop: '60px' }}>
        <Container maxWidth="sm">
          <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 2 }} >
              {note ? (
                <Container>
                    <Typography component="div" variant="body1" mb={3} align="justify">
                        <h1 align="center">{note.name}</h1>
                        <p>Серия: {note.group}</p>
                        <p>Статус: {note.status}</p>
                        <p>Номер: {note.number}</p>
                        <p>Теги: {note.tags.join(', ')}</p>
                        <p>
                          Ссылки: {note.links.map((link, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && ", "}
                              <a component={Link} href={link}>{link}</a>
                            </React.Fragment>
                          ))}
                        </p>
                        <p>Информация: {note.note}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', marginLeft: '20%', marginRight: '20%' }}>
                          <Button variant="contained" size="large" fullWidth="true" onClick={handleOpenFile}>Открыть файл</Button>
                        </div>
                    </Typography>
                    <NetworkGraph noteId={id} />
                </Container>
              ) : (
                <h1>Загрузка... либо такой записи не существует</h1>
              )}
            </Paper>
          </Box>
        </Container>
      </div>
    );
}

export default Note;
