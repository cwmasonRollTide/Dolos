import React, {useEffect, useState} from 'react'
import { CelebrityTrainingData } from '../../interfaces/CelebrityTrainingData';
import {Box, Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import { IconButton, TextField, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


// To Come from API calls
const trainingData: CelebrityTrainingData =
{
  guest: "Tom Cruise",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Tom_Cruise_avp_2014_4.jpg/220px-Tom_Cruise_avp_2014_4.jpg",
  prompts: [{
    prompt: "What is your favorite movie?",
    completion: "My favorite movie is Top Gun."
  },{
    prompt: "What is your favorite movie?",
    completion: "My favorite movie is Top Gun."
  }]
}

// This api call first to populate dropdown
const guests: string[] = ["Tom Cruise", "Tom Hanks", "Tom Brady", "Tom Holland", "Tom Felton", "Tom Hardy", "Tom Holl"];

const Training: React.FC = () => {
  const [guest, setGuest] = useState<string>(guests[0]);
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [newCompletion, setNewCompletion] = useState<string>('');
  const [needsToSave, setNeedsToSave] = useState<boolean>(false);
  const [promptCompletionPairs, setPromptCompletionPairs] = useState<CelebrityTrainingData>(trainingData);
  
  useEffect(() => {
    // Fetch the training data for the selected guest
  }, [guest]);
  
  const handleGuestDropdownChange = (event: any) => {
    setGuest(event.target.value as string);
  }
  
  const handlePromptChange = (index: number, newPrompt: string) => {
    const updatedPairs = promptCompletionPairs.prompts.map((pair, pairIndex) => {
      if (index === pairIndex) {
        return { ...pair, prompt: newPrompt };
      }
      return pair;
    });
    setNeedsToSave(true);
    setPromptCompletionPairs({ ...promptCompletionPairs, prompts: updatedPairs });
  };
  
  const handleCompletionChange = (index: number, newCompletion: string) => {
    const updatedPairs = promptCompletionPairs.prompts.map((pair, pairIndex) => {
      if (index === pairIndex) {
        return { ...pair, completion: newCompletion };
      }
      return pair;
    });
    setNeedsToSave(true);
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
      <Box display="flex" justifyContent="center" my={2}>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <InputLabel id="demo-simple-select-standard-label">Celebrity</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={guest}
            onChange={handleGuestDropdownChange}
            label="Guest"
          >
            {guests.map((guest: string) => (
              <MenuItem key={guest} value={guest}>{guest}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="center" my={2}>
        <Typography variant="h2">{guest}</Typography>
      </Box>
      <Box display="flex" justifyContent="left" my={2}>
        <Button variant="contained" onClick={handleSave} disabled={!needsToSave}>
          Save
        </Button>
      </Box>
      <Grid container>
        {promptCompletionPairs.prompts.map((promptCompletionPair, index) => (
          <Grid xs={12} key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '1em' }}>
            <Grid xs={6}>
              <TextField
                label="Prompt"
                variant="outlined"
                style={{ width: '100%' }}
                value={promptCompletionPair.prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
              />
            </Grid>
            <Grid xs={6}>
              <TextField
                label="Completion"
                variant="outlined"
                style={{ width: '100%' }}
                value={promptCompletionPair.completion}
                onChange={(e) => handleCompletionChange(index, e.target.value)}
              />
            </Grid>
            <IconButton onClick={() => handleDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        ))}
        <Grid xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '1em' }}>
          <Grid item xs={6}>
            <TextField
              label="New Prompt"
              variant="outlined"
              fullWidth
              value={newPrompt}
              onChange={(e) => {
                setNewPrompt(e.target.value)
                setNeedsToSave(true);
              }}
            />
          </Grid>
          <Grid xs={6}>
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
          <IconButton onClick={() => handleAddPair()} disabled={!needsToSave}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Training;
