import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', maxHeight: '100vh', overflowY: 'auto' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, maxHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
