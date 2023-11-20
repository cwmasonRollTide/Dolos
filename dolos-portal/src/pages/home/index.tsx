import React from 'react';
import {Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, Typography} from '@mui/material';

const Home = () => {
  return (
    <Grid container marginLeft={'0.5em'} marginRight={'1em'}>
      <Grid item xs={12} md={3.5} margin={'0.5em'}>
        <Card style={{ textAlign: 'center'}}>
          <CardActionArea href="https://en.wikipedia.org/wiki/Dolos_(mythology)" target="_blank">
            <CardHeader title="Welcome to Dolos" />
            <CardMedia>
              <img src="https://pm1.aminoapps.com/6869/3ca410738fd1216466f416543e3076dee5673aabr1-750-980v2_hq.jpg" alt="Dolos" style={{ width: '100%' }} />
            </CardMedia>
            <CardContent>
              <Typography>
                Dolos, the greek god of trickery, has a long history of impersonating others.
                Initially trained with a dataset of Larry King Live interviews hosted at cnn.transcripts.com, this
                project allows us to edit the prompt and completion of a given transcript to create a new, fake interview.
              </Typography>
              <Typography>
                We can then train finely tuned models on these interviews for the purpose of talking to the celebrity in question
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={3.5} margin={'0.5em'}>
        <Card style={{ textAlign: 'center'}}>
          <CardActionArea href="/training">
            <CardHeader title="Train Celebrity Models" />
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