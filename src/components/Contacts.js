import './../App.css';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MapIcon from '@mui/icons-material/Map';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Paper } from '@mui/material';

function Contacts(props) {
    
    return (
      <div className="App" style={{ marginTop: '60px' }}>
        <Container maxWidth="sm">
          <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 2 }} >
              <h1>Контакты обратной связи</h1>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box spacing={3}>
                    <Typography variant="body1" mb={3} align="justify">
                    Есть над чем задуматься: тщательные исследования конкурентов освещают чрезвычайно интересные особенности картины в целом, однако конкретные выводы, разумеется, функционально разнесены на независимые элементы. Банальные, но неопровержимые выводы, а также элементы политического процесса и по сей день остаются уделом либералов, которые жаждут быть подвергнуты целой серии независимых исследований. Современные технологии достигли такого уровня, что понимание сути ресурсосберегающих технологий выявляет срочную потребность системы массового участия.
                    </Typography>
                    <Typography component={'span'} variant="body1" mb={3} align="justify">
                      <Box display="flex" mb={1} alignItems="center">
                        <MapIcon />
                        <span style={{ marginLeft: '0.5em' }}>Адрес: 123557, Москва, Пресненский Вал, 19, стр. 1</span>
                      </Box>
                      <Box display="flex" mb={1} alignItems="center">
                        <PhoneInTalkIcon />
                        <span style={{ marginLeft: '0.5em' }}>Телефон: +7 (499) 123-45-67</span>
                      </Box>
                      <Box display="flex" mb={1} alignItems="center">
                        <AlternateEmailIcon />
                        <span style={{ marginLeft: '0.5em' }}>E-mail: email@email.ru</span>
                      </Box>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} alignItems="center">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <div style={{ position:'relative', overflow:'hidden' }}>
                      <a
                        href="https://yandex.ru/maps/org/fganu_tsitis/1085463969/?utm_medium=mapframe&utm_source=maps"
                        style={{ color:'#eee', fontSize:'12px', position:'absolute', top:'0px' }}>
                        Фгану ЦИТиС</a>
                      <a
                        href="https://yandex.ru/maps/213/moscow/category/information_security/184105372/?utm_medium=mapframe&utm_source=maps"
                        style={{ color:'#eee', fontSize:'12px', position:'absolute', top:'14px' }}>
                        Информационная безопасность в Москве
                      </a>
                      <a
                        href="https://yandex.ru/maps/213/moscow/category/certification_authority/58594191367/?utm_medium=mapframe&utm_source=maps"
                        style={{ color:'#eee', fontSize:'12px', position:'absolute', top:'28px' }}>
                        Удостоверяющий центр в Москве
                      </a>
                      <iframe
                        title="Yandex Map Widget"
                        src="https://yandex.ru/map-widget/v1/?from=mapframe&ll=37.568193%2C55.771195&mode=search&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1085463969&sll=37.568193%2C55.771195&source=mapframe&text=%D0%A4%D0%93%D0%90%D0%9D%D0%A3%20%D0%A6%D0%98%D0%A2%D0%B8%D0%A1&utm_source=mapframe&z=16"
                        width="700"
                        height="500"
                        frameBorder="0"
                        allowFullScreen={true}
                        style={{ position:'relative' }}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </div>
    );
}

export default Contacts;
