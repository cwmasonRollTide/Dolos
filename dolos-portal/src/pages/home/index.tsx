import React from 'react';
import {Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, Typography} from '@mui/material';

const Home = () => {
  return (
    <Grid container style={{display: 'flex', justifyContent: 'center'}}>
      <Grid item xs={12} md={3.5} margin={'0.5em'}>
        <Card style={{ textAlign: 'center'}}>
          <CardActionArea href="/training">
            <CardHeader title="Train Celebrity AI Models" />
            <CardMedia>
              <img src="https://hips.hearstapps.com/hmg-prod/images/how-to-start-weight-lifting-strength-training-for-women-1647617733.jpg?crop=0.668xw:1.00xh;0.138xw,0&resize=1200:*" alt="Dolos" style={{ width: '100%' }} />
            </CardMedia>
            <CardContent>
              <Typography>
                With the interview transcripts as a starting point, we can now go through and edit the prompts and completions to
                include more information about the celebrity in question.
              </Typography>
              <Typography>
                We can also add additional questions and answers for the celebrity to help round out their personalities and response types
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={3.5} margin={'0.5em'}>
        <Card style={{ textAlign: 'center'}}>
          <CardActionArea href="/conversation">
            <CardHeader title="Talk with Parodied Celebrities" />
            <CardMedia>
              <img src="https://qph.cf2.quoracdn.net/main-qimg-2b45c2add2f76e48b6c7805ba116f23a-lq" alt="Dolos" style={{ width: '100%' }} />
            </CardMedia>
            <CardContent>
              <Typography>
                Once you edit the prompts and questions and hit save, it should create a finely tuned AI model that attempts to mimic the celebrity in question.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  )
};

export default Home;