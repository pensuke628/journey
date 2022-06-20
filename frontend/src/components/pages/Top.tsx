import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUIのimport
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';

//  Contextのimport
import { AuthContext } from 'App';

const Top: React.FC = () => {
  const { isSignedIn, currentUser }= useContext(AuthContext);
 
  return (
    <>
      { isSignedIn && currentUser? (
        <>        
          <h1>ここはテスト用Topページです</h1>
          <h1>ようこそ！ {currentUser?.name} さん</h1>
          <Button
            component={RouterLink}
            to='/owners'
            variant='contained'
          >
            オーナーになる
          </Button>
          {/* <Button
            component={RouterLink}
            to='/actioncable'
            variant='contained'
          >
            ActionCableへ（debag）
          </Button> */}
        </>
        ) : (
          <h1>not signed in</h1>
        )
      }
      <Box>
        <Button component={RouterLink} to='about' variant='contained' sx={{ m:1 }}>About</Button>
        <Button component={RouterLink} to='/users' variant='contained' sx={{ m:1 }}>ユーザー一覧</Button>
        <Button component={RouterLink} to='/houses' variant='contained' sx={{ m:1 }}>施設一覧</Button>
      </Box>
    </>
  );
}

export default Top