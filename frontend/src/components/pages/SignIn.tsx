import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// MUIのimport
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// ReactHooksFormのimport
import { useForm, Controller } from 'react-hook-form';

// interfaceのimport
import { SignInParams } from 'interfaces/index';

import { AuthContext, BookmarkContext, LikeContext, NotificationContext, OwnerContext } from 'App';
import AlertMessage from 'components/utils/AlertMessage';
import {signIn} from 'lib/api/auth';
import { getBookmark } from 'lib/api/bookmark';
import { getLike } from 'lib/api/like';
import { getNotifications } from 'lib/api/notification';
import { getOwners } from 'lib/api/owner';

const CustomCard = styled(Card)({
  flexGrow: 1,
  margin: '2rem 1rem',
  maxWidth: 400,
});

const CustomCardHeader = styled(CardHeader)({
  textAlign: 'center',
  backgroundColor: 'lightblue',
});

const FlexBox = styled(Box) ({
  display: 'flex'
});

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
  } = useForm<SignInParams>();

  const {setIsSignedIn, setCurrentUser} = useContext(AuthContext);
  const { setBookmarkingHouses } = useContext(BookmarkContext);
  const { setLikingReviews } = useContext(LikeContext);
  const { setNotifications } = useContext(NotificationContext);
  const { setOwneredHouses } = useContext(OwnerContext);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const sessionCreate= async(data: SignInParams) => {
    // console.log(data);
    try {
      const res = await signIn(data);
      if (res.status === 200) {
        // ログインに成功した場合はCookieに各値を格納する
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        const like = await getLike();
        console.log(like);
        setLikingReviews([...like.data.likeReviews]);

        // お気に入りしている施設を保存する
        const bookmark = await getBookmark();
        console.log(bookmark);
        setBookmarkingHouses([...bookmark.data.bookmarkHouses]);

        const notification = await getNotifications();
        console.log(notification);
        setNotifications([...notification.data.notifications]);

        // 管理者である施設を保存する
        const owner = await getOwners();
        console.log(owner);
        setOwneredHouses([...owner.data.ownerHouses]);

        navigate('/');
      } else {
        setAlertMessageOpen(true);
      }
    } catch (error) {
      console.log(error);
      setAlertMessageOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(sessionCreate)}>
        <Container>
          <Box
            sx = {{
              '& .MuiTextField-root': { m: 1, width: '90%' },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              sx = {{ mt:3 }}
            >
              ログイン画面
            </Typography>
            <FlexBox
              sx= {{
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <CustomCard>
                <CustomCardHeader title='ログイン'/>
                <CardContent>
                  <FlexBox>
                    <EmailIcon sx={{ color: 'action.active', my: 'auto' }}/>
                    <Controller
                      name='email'
                      control={control}
                      defaultValue={''}
                      render={({field}) => (
                        <TextField
                        {...field}
                        label='Email'
                        />
                      )}
                    />
                  </FlexBox>
                  <FlexBox>
                    <LockIcon sx={{ color: 'action.active', my: 'auto' }}/>
                    <Controller
                      name='password'
                      control={control}
                      defaultValue={''}
                      render={({field}) => (
                        <TextField
                        {...field}
                        type='password'
                        label='パスワード'
                        />
                      )}
                    />
                  </FlexBox>
                  <Box
                    sx={{
                      display: 'flex-column',
                      textAlign: 'left',
                    }}
                  >
                    <FormControlLabel control={<Checkbox/>} label='ログイン状態を保持する' sx={{ mr: 'auto' }}/>
                    <Typography/>パスワードを忘れた場合はこちら
                  </Box>
                  <Button
                    type='submit'
                    variant='contained'
                    sx = {{ mt: 3 }}
                  >
                    ログイン
                  </Button>
                </CardContent>
              </CustomCard>
              <CustomCard>
                <CustomCardHeader title='他サービスIDでログイン'/>
              </CustomCard>
              <AlertMessage
                // エラーが発生した場合はアラートを表示
                open={alertMessageOpen}
                setOpen={setAlertMessageOpen}
                severity='error'
                message='Emailもしくはパスワードに誤りがあります'
              />
            </FlexBox>
          </Box>
        </Container>
      </form>
    </>
  );
}

export default SignIn