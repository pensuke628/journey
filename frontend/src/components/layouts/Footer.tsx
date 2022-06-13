import React from "react";

// MUIのimport
import styled  from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";

const CustomBox = styled(Box)({
  display: 'flex',
  justifyContent: "space-between",
});

const Footer: React.FC = () => {
  const year: number = new Date().getFullYear();
  return (
    <Container>
      <CustomBox>
        <Typography>
          {`Copyrignt © ${year} Journey. All rights reserved.`}
        </Typography>
        <Typography>
          <Link to="#">お問い合わせ</Link>
        </Typography>
      </CustomBox>
    </Container>
  )
}

export default Footer