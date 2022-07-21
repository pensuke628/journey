import React, {useState, useContext} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// MUIのimport
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

// MUIIconsのimport
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// componentのimport
import AlertMessage from 'components/utils/AlertMessage';

// ReactHooksFormのimport
import { useForm, Controller } from 'react-hook-form';

// interfaceのimport
import { SignInParams } from 'interfaces/index';

// Contextのimport
import { AuthContext, BookmarkContext, LikeContext, NotificationContext, RelationshipContext ,OwnerContext } from 'App';

// APIを叩く関数のimport
import {signIn} from 'lib/api/auth';
import { getBookmark } from 'lib/api/bookmark';
import { getFollowing } from 'lib/api/relationships';
import { getLike } from 'lib/api/like';
import { getNotifications } from 'lib/api/notification';
import { getOwners } from 'lib/api/owner';

const CustomCard = styled(Card)({
  flexGrow: 1,
  margin: '4rem 1rem',
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

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const { setBookmarkingHouses } = useContext(BookmarkContext);
  const { setFollowingUsers } = useContext(RelationshipContext);
  const { setLikingReviews } = useContext(LikeContext);
  const { setNotifications } = useContext(NotificationContext);
  const { setOwneredHouses } = useContext(OwnerContext);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const sessionCreate= async(data: SignInParams) => {
    try {
      const res = await signIn(data);
      if (res.status === 200) {
        // ログインに成功した場合はCookieに各値を格納する
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        // フォローしているユーザーを保存する
        const following = await getFollowing();
        setFollowingUsers([...following.data.activeRelationships]);

        // いいねした投稿を保存する
        const like = await getLike();
        setLikingReviews([...like.data.likeReviews]);

        // お気に入りしている施設を保存する
        const bookmark = await getBookmark();
        setBookmarkingHouses([...bookmark.data.bookmarkHouses]);

        // 自分宛の通知を保存する
        const notification = await getNotifications();
        setNotifications([...notification.data.notifications]);

        // 管理者である施設を保存する
        const owner = await getOwners();
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
                  <Button
                    type='submit'
                    variant='contained'
                    sx = {{ mt: 3 }}
                  >
                    ログイン
                  </Button>
                </CardContent>
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