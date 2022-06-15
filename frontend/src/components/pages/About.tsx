import { Link as RouterLink } from "react-router-dom";

import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const CustomButtonGroup = styled(Box) ({
  display: 'flex',
  justifyContent: 'center',
})

const CustomedPaper = styled(Paper) ({
  padding: '2rem',
  margin: '1rem',
});


const About: React.FC = () => {
  return (
    <Container>
      <Typography
        component='div'
        variant='h4'
        gutterBottom
        textAlign='center'
        sx={{
          pt: 3
        }}
      >
        Journeyについて
      </Typography>
      <CustomedPaper elevation={2}>
        <Typography
          variant='h6'
        >
          Journeyとは
        </Typography>
        <Typography component="p">
          Journeyのアプリの説明です。
        </Typography>
      </CustomedPaper>
      <CustomedPaper>
        <Typography
          variant='h6'
        >
          特長1
        </Typography>
        <Typography component="p">
          特長1
        </Typography>
      </CustomedPaper>
      <CustomedPaper>
        <Typography
          variant='h6'
        >
          特長2
        </Typography>
        <Typography component="p">
          特長2
        </Typography>
      </CustomedPaper>
      <CustomedPaper>
        <Typography
          variant='h6'
        >
          特長3
        </Typography>
        <Typography component="p">
          特長3
        </Typography>
      </CustomedPaper>
      <CustomButtonGroup>
        <Button
          component={RouterLink}
          to='/signin'
          variant='contained'
          sx={{
            margin: 2
          }}
        >
          ログイン
        </Button>
        <Button
          component={RouterLink}
          to='/signup'
          variant='contained'
          sx={{
            margin: 2
          }}
        >
          新規登録
        </Button>
      </CustomButtonGroup>
    </Container>
  )
}

export default About;