import React from 'react';

// MUIのimport
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer: React.FC = () => {
  const year: number = new Date().getFullYear();
  return (
    <Box
      component='footer'
      sx={{
        mt: '50px',
        mb: { xs: '100px' }
      }}
    >
      <Typography align='center'>
        {`Copyrignt © ${year} Journey. All rights reserved.`}
      </Typography>
    </Box>
  )
}

export default Footer