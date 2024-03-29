import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import { Paper } from '@mui/material';
import Alert from "@mui/material/Alert";

const ariaLabel = { 'aria-label': 'description' };

export default function Inputs(props) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = event.target.file.files[0];
    
    if (file && file.type !== 'application/pdf') {
      setErrorMessage('Был выбран не PDF-файл');
      return;
    }

    if (file && file.size > 15 * 1024 * 1024) {
      setErrorMessage('Размер файла слишком большой (>15 МБ)');
      return;
    }

    setErrorMessage('');

    props.onNewNote(
      event.target.name.value, 
      event.target.group.value,
      event.target.number.value,
      event.target.status.value,
      event.target.tags.value,
      event.target.links.value,
      event.target.note.value,
      file ? file : null
    );
  }

  function InputButton() {

    const fileInput = React.useRef();
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setFileName(file.name);
      } else {
        setFileName('');
      }
    };
  
    return (
      <div>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={()=>fileInput.current.click()}
        >
          Прикрепить файл
        </Button>
  
        <input
          id='file' 
          ref={fileInput} 
          type="file" 
          style={{ display: 'none' }}
          onChange={handleFileChange}
          required 
        />

        <div>
          {fileName && 
          <Typography>
            Выбранный файл: {fileName}
          </Typography>
          }
          <Typography>
            Поддерживаются только PDF-файлы (максимальный размер 15 МБ)
          </Typography>
        </div>
        
      </div>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 2 }}>
        <Paper style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }} sx={{ m: 1 }}>
          <h1>Форма добавления новой записи</h1>
          <form onSubmit={handleSubmit} style={{ flexDirection: 'column' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input id='name' placeholder="Полное наименование документа" inputProps={ariaLabel} required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Input id='group' placeholder="Серия" inputProps={ariaLabel} required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Input id='number' placeholder="Номер полностью" inputProps={ariaLabel} required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Input id='status' placeholder="Статус (Действущий или др.)" inputProps={ariaLabel} required fullWidth />
              </Grid>
              <Grid item xs={12}>
                <InputButton/>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Необязательные поля:
                </Typography>
                <Input id='tags' placeholder="Ключевые слова (разделенные запятыми)" inputProps={ariaLabel} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Input id='links' placeholder="Ссылочные документы (разделенные запятыми)" inputProps={ariaLabel} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="note" label="Заметка" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" type="submit">Создать запись</Button>
              </Grid>
            </Grid>
          </form>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
}