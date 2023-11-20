import React, {useEffect, useState} from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

interface GuestDropDownProps {
  guest?: string;
  onGuestChange: (event: SelectChangeEvent) => void;
}

const GuestDropDown: React.FC<GuestDropDownProps> = ({guest, onGuestChange}: GuestDropDownProps) => {
  const [guests, setGuests] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchNames() {
      try {
        const response: Response = await fetch(process.env.REACT_APP_RETRIEVE_CELEB_NAMES_URL as string, {method: "GET"});
        if (!response.ok) {
          alert('Failed to fetch guest names.');
        }
        const guests = await response.json();
        setGuests(guests);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNames();
  }, []);
  
  return (
    <Box display="flex" justifyContent="center" my={2}>
      <FormControl variant="standard" sx={{ minWidth: 250 }}>
        <InputLabel id="demo-simple-select-standard-label">Celebrity</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={guest}
          onChange={onGuestChange}
          label="Guest"
        >
          {guests.map((guest: string) => (
            <MenuItem key={guest} value={guest}>{guest}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default GuestDropDown;