import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const ariaLabel = { 'aria-label': 'description' };

export default function Inputs(props) {
    const createNote = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            const userValue = event.target.value;
            console.log(userValue);
            // props.onNewNote(userValue,);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onNewNote(event.target.name.value, event.target.sum.value);
    }
    return (
        <Box
            sx={{
                '& > :not(style)': { m: 1 },
            }}
        >
            <form onSubmit={handleSubmit} flex-direction="column">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Input id='name' placeholder="Номер" inputProps={ariaLabel} required />
                    <Input id='sum' type="number" style={{ marginLeft: "1em" }} placeholder="Наименование" required />
                </Grid>
                <Grid item xs={12}>
                    <TextField id="outlined-basic" label="Текст" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" type="submit">Создать запись</Button>
                </Grid>
            </Grid>
            </form>

        </Box>
    );
}