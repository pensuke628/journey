import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import HouseIcon from '@mui/icons-material/House';
import MailIcon from '@mui/icons-material/Mail';

// import { AuthContext } from 'App';

import { UserData, ReviewData } from 'interfaces/index'

import {getUser} from 'lib/api/user';

import ReviewSimple  from 'components/layouts/ReviewSimple'

type TabPanelProps = {
  children?: React.ReactNode;
  index: number
  value: number
}

const styles = {
  actionbutton: {
    margin: '0.3rem 0'
  },
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  )
}

const UserTab = styled(Tab) ({
  minWidth: '60px'
})

const FlexBox = styled(Box) ({
  display: 'flex'
});

const UserShow: React.FC = () => {
  const DummyUser: UserData = {
    id: 0,
    name: '',
    email: '',
    avatar: '',
    profile: '',
    background_image: '',
    provider: '',
    uid: '',
    allowPasswordChange: true,
    reviews: [],
    likes: []
  }

  // const { isSignedIn, setIsSignedIn, currentUser, setCurrentUser } = useContext(AuthContext);
  const query = useParams<{ id: string }>();

  const [user, setUser] = useState<UserData>(DummyUser);
  const [userIsTrue, setUserIsTrue] = useState<boolean>(false);
  const [tab, setTab] = useState(0);
  
  const getData = async() => {
    try {
      const res = await getUser(query.id);
      if (res.status === 200) {
        setUser(res.data);
        setUserIsTrue(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  },[]);

  const tabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <>
      { userIsTrue && user ? (
        <Box>
          <Container>
            <h1>ユーザーマイページ</h1>
            <Card>
              <CardMedia
                component='img'
                image='public/logo192.png'
                alt='背景画像を表示する予定です'
              />
              <CardContent>
                <Grid
                  container
                  spacing={2}
                  justifyContent='center'
                > 
                  <Grid item xs={3} sm={2}>
                    <Avatar
                      alt='avatar'
                      // src={user.avatar}
                      sx= {{ width: 56, height: 56 }}
                    />
                  </Grid>
                  <Grid item xs={9} sm={7}>
                    <Box>
                      <Typography>{user.name}さん</Typography>
                      {
                        user.profile? (
                          <Typography>{user.profile}</Typography>
                        ) : (
                          <Typography>よろしくお願いします</Typography>
                        )
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={8} sm={3}>
                    <FlexBox sx={{ flexDirection: 'column' }}>
                      <Button
                        component={RouterLink}
                        to={`/users/${user.id}/bookmarks`}
                        key='one'
                        variant="contained"
                        startIcon={<BookmarksIcon />}
                        style={styles.actionbutton}
                      >お気に入り</Button>
                      <Button
                        component={RouterLink}
                        to={`/users/${user.id}/message_rooms`}
                        key='two'
                        variant="contained"
                        startIcon={<MailIcon />}
                        style={styles.actionbutton}
                      >メッセージ一覧</Button>
                      <Button
                        component={RouterLink}
                        to={`/users/${user.id}/owners`}
                        key='three'
                        variant="contained"
                        startIcon={<HouseIcon />}
                        style={styles.actionbutton}
                      >管理施設一覧</Button>
                      <Button
                        key='four'
                        variant="contained"
                        startIcon={<EditIcon />}
                        style={styles.actionbutton}
                      >プロフィール編集</Button>
                    </FlexBox>
                  </Grid>
                </Grid>
                <Tabs
                  value={tab}
                  onChange={tabChange}
                  variant='fullWidth'
                  sx = {{
                    flex: {sm: 'none', md: 'display'}
                  }}
                >
                  <UserTab label='口コミ'></UserTab>
                  <UserTab label='いいね'></UserTab>
                  <UserTab label='フォロー中'></UserTab>
                  <UserTab label='フォロワー'></UserTab>
                </Tabs>
                <TabPanel value={tab} index={0}>
                  {
                    user.reviews ? (
                      user.reviews.map((review: ReviewData) => (
                        <Box key={review.id}>
                          <ReviewSimple
                            id={review.id}
                            content={review.content}
                            date={review.date}
                            evaluation={review.evaluation}
                            userId={review.userId}
                            tags={review.tags}
                          />
                        </Box>
                      ))
                    ) : (
                      <p>まだ口コミはありません</p>
                    )
                  }
                </TabPanel>
                <TabPanel value={tab} index={1}>tab2</TabPanel>
                <TabPanel value={tab} index={2}>
                </TabPanel>
                <TabPanel value={tab} index={3}>tab4</TabPanel>
              </CardContent>
            </Card>
          </Container>
        </Box>
        ) : (
          <h1>読み込み中</h1>
        )
      }
    </>
  );
}

export default UserShow