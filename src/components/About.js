import './../App.css';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import { Paper } from '@mui/material';

function About(props) {
    
    return (
      <div className="App" style={{ marginTop: '60px' }}>
        <Container maxWidth="sm">
          <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 2 }} >
              <h1>Инструкция по использованию сервиса</h1>
              <Typography variant="body1" mb={3} align="justify">
                Есть над чем задуматься: тщательные исследования конкурентов освещают чрезвычайно интересные особенности картины в целом, однако конкретные выводы, разумеется, функционально разнесены на независимые элементы. Банальные, но неопровержимые выводы, а также элементы политического процесса и по сей день остаются уделом либералов, которые жаждут быть подвергнуты целой серии независимых исследований. Современные технологии достигли такого уровня, что понимание сути ресурсосберегающих технологий выявляет срочную потребность системы массового участия.
              </Typography>
            </Paper>
          </Box>
        </Container>
      </div>
    );
}

export default About;
