import React, {useEffect, useState} from 'react'
import { CelebrityTrainingData } from '../../interfaces/CelebrityTrainingData';
import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import { IconButton, TextField, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GuestDropDown from "../../components/guest-drop-down";
import {Train} from "@mui/icons-material";


// To Come from API calls
const trainingData: CelebrityTrainingData = {
  guest: "Tom Cruise",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Tom_Cruise_avp_2014_4.jpg/220px-Tom_Cruise_avp_2014_4.jpg",
  prompts: [{
    prompt: "What is your favorite movie?",
    completion: "My favorite movie is Top Gun."
  }, {
    prompt: "What is your favorite movie?",
    completion: "My favorite movie is Top Gun."
  }]
}

const Training: React.FC = () => {
  const [guest, setGuest] = useState<string>();
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [newCompletion, setNewCompletion] = useState<string>('');
  const [needsToSave, setNeedsToSave] = useState<boolean>(false);
  const [promptCompletionPairs, setPromptCompletionPairs] = useState<CelebrityTrainingData>(trainingData);
  
  useEffect(() => {
    async function retrieveTrainingData()
    {
      try {
        var response = await fetch(`${process.env.REACT_APP_RETRIEVE_CELEB_TRAINING_DATA as string}?guest=${guest}`);
        if (!response.ok) {
          alert('Failed to fetch guest training data.');
        }
        const trainingData = await response.json();
        console.log('Training', trainingData);
        setPromptCompletionPairs(trainingData);
      } catch(err) {
        console.log(err);
      }
    }
    if (guest)
      retrieveTrainingData();
  }, [guest]);
  
  const handlePromptChange = (index: number, newPrompt: string) => {
    setNeedsToSave(true);
    const updatedPairs = promptCompletionPairs.prompts.map((pair, pairIndex) => {
      if (index === pairIndex) {
        return { ...pair, prompt: newPrompt };
      }
      return pair;
    });
    setPromptCompletionPairs({ ...promptCompletionPairs, prompts: updatedPairs });
  };
  
  const handleCompletionChange = (index: number, newCompletion: string) => {
    setNeedsToSave(true);
    const updatedPairs = promptCompletionPairs.prompts.map((pair, pairIndex) => {
      if (index === pairIndex) {
        return { ...pair, completion: newCompletion };
      }
      return pair;
    });
    setPromptCompletionPairs({ ...promptCompletionPairs, prompts: updatedPairs });
  };
  
  const handleDelete = (index: number) => {
    const updatedPairs = promptCompletionPairs.prompts.filter((_, pairIndex) => index !== pairIndex);
    setPromptCompletionPairs({ ...promptCompletionPairs, prompts: updatedPairs });
  };
  
  const handleAddPair = () => {
    setPromptCompletionPairs({
      ...promptCompletionPairs,
      prompts: [...promptCompletionPairs.prompts, { prompt: newPrompt, completion: newCompletion }]
    });
    setNewPrompt('');
    setNewCompletion('');
    setNeedsToSave(false);
  };
  
  const handleSave = () => {
    // API call to save data or any other logic
    setNeedsToSave(false);
  };

  return (
    <Container>
      <GuestDropDown onGuestChange={(e: SelectChangeEvent) => setGuest(e.target.value)} guest={guest}/>
      <Box display="flex" justifyContent="center" my={2}>
        <Typography variant="h4">{guest}</Typography>
      </Box>
      <Box display="flex" justifyContent="left" my={2}>
        <Button variant="contained" onClick={handleSave} disabled={!needsToSave}>
          Save
        </Button>
      </Box>
      <Grid container spacing={2}>
        {promptCompletionPairs.prompts.map((promptCompletionPair, index) => (
          <Grid item xs={12} key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '1em' }}>
            <Grid container spacing={1}>
              <Grid item xs={11} md={5}>
                <TextField
                  label="Prompt"
                  variant="outlined"
                  fullWidth
                  value={promptCompletionPair.prompt}
                  onChange={(e) => handlePromptChange(index, e.target.value)}
                />
              </Grid>
              <Grid item xs={11} md={5}>
                <TextField
                  label="Completion"
                  variant="outlined"
                  fullWidth
                  value={promptCompletionPair.completion}
                  onChange={(e) => handleCompletionChange(index, e.target.value)}
                />
              </Grid>
              <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            
          </Grid>
        ))}
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '1em' }}>
          <Grid container spacing={1}>
            <Grid item xs={11} md={5}>
              <TextField
                label="New Prompt"
                variant="outlined"
                fullWidth
                value={newPrompt}
                onChange={(e) => {
                  setNewPrompt(e.target.value);
                  setNeedsToSave(true);
                }}
              />
            </Grid>
            <Grid item xs={11} md={5}>
              <TextField
                label="New Completion"
                variant="outlined"
                fullWidth
                value={newCompletion}
                onChange={(e) => {
                  setNewCompletion(e.target.value)
                  setNeedsToSave(true);
                }}
              />
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleAddPair} disabled={!needsToSave}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Training;
