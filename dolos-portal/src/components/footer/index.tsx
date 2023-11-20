import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {Box} from "@mui/material";

const Footer = () => {
  return (
    <AppBar position="static" color="primary" sx={{ justifyItems: 'center', top: 'auto', bottom: 0, alignItmes: 'center' }}>
      <Toolbar>
        <Box display="flex" justifyContent="center" my={2}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="github"
            href="https://github.com/cwmasonRollTide"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="linkedin"
            href="https://www.linkedin.com/in/connor-mason-the-software-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
