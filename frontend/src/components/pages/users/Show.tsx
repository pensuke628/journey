import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';

// MUIのimport
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

// MUIIconsのimport
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import HouseIcon from '@mui/icons-material/House';
import MailIcon from '@mui/icons-material/Mail';

// componentのimport
import ReviewSimple  from 'components/layouts/ReviewSimple'
import User from 'components/layouts/User';
import FollowButton from 'components/utils/FollowButton';
import UnfollowButton from 'components/utils/UnfollowButton';

// interfaceのimport
import { Follow, Notification, UserData, ReviewData } from 'interfaces/index';

//  Contextのimport
import { AuthContext, RelationshipContext } from 'App';

// apiを叩く関数のimport
import { getUser } from 'lib/api/user';
import { createNotification } from 'lib/api/notification';
import { follow, unfollow } from 'lib/api/relationships';
import { resetNotifications } from 'lib/api/notification';

// default画像のimport
import defaultBckgroundImage from 'defaultBackgroundImage.png';

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
    avatar: {
      url: ''
    },
    profile: '',
    backgroundImage: {
      url: ''
    },
    provider: '',
    uid: '',
    allowPasswordChange: true,
    reviews: [],
    likes: [],
    following: [],
    followers: [],
  }

  const { isSignedIn ,currentUser } = useContext(AuthContext);
  const { followingUsers, setFollowingUsers } = useContext(RelationshipContext);
  const query = useParams<{ id: string }>();

  const [user, setUser] = useState<UserData>(DummyUser);
  const [userIsTrue, setUserIsTrue] = useState<boolean>(false);
  const [tab, setTab] = useState(0);

  const navigate = useNavigate();
  
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
  },[query]);

  // ユーザーをフォローする
  const userFollow = async() => {
    const params: Follow = {
      followerId: currentUser?.id,
      followedId: user.id
    }

    const notificationParams: Notification = {
      senderId: currentUser?.id,
      receiverId: user.id,
      reviewId: undefined,
      commentId: undefined,
      messageId: undefined,
      act: 'follow',
      checked: undefined,
      createdAt: undefined,
      updatedAt: undefined
    }

    try {
      const res = await follow(params);
      // console.log(res);
      if (res.status === 200) {
        setFollowingUsers([user, ...followingUsers]);
        console.log('ユーザーをフォローしました');
        const notification = await createNotification(notificationParams);
        if (notification.status === 200) {
          console.log('フォロー通知を作成しました');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  // ユーザーのフォローを解除する
  const userUnfollow = async() => {
    const params: Follow = {
      followerId: currentUser?.id,
      followedId: user.id
    }

    try {
      const res = await unfollow(params);
      // console.log(res);
      if (res.status === 200) {
        const newfollowing = followingUsers.filter(followinguser => followinguser.id !== user.id);
        setFollowingUsers([...newfollowing]);
        console.log('ユーザーのフォローを解除しました');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const IsMutualFollow = () => {
    if (currentUser?.following.some(member => member === user) && user.following.some(member => member === currentUser)) {
      return true
    } else {
      return false
    }
  }

  const editUser = () => {
    navigate(`/users/${user.id}/edit`, { state: {...user}})
  }

  const tabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const DummyFuction = () => {
    console.log('');
  }

  const handleResetNotification = () => {
    resetNotifications({ id: currentUser?.id })
  }

  return (
    <>
      { userIsTrue && user ? (
        <Box>
          <Container>
            <Card>
              <CardMedia
                component='img'
                image={
                  user.backgroundImage.url ? user.backgroundImage.url : defaultBckgroundImage
                }
                alt='背景画像'
                height='300px'
              />
              <CardContent>
                <Grid
                  container
                  spacing={2}
                  justifyContent='center'
                > 
                  <Grid item xs={12} md={7}>
                    <Avatar
                      alt='avatar'
                      src={user.avatar.url}
                      sx= {{
                        width: 56,
                        height: 56,
                        mt: -6
                      }}
                    />
                    <Box>
                      <Typography
                        variant='h5'
                      >
                        {user.name}さん
                      </Typography>
                      {
                        user.profile? (
                          <Typography>{user.profile}</Typography>
                        ) : (
                          <Typography>よろしくお願いします</Typography>
                        )
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={5} md={3}>
                      {
                        user.id === currentUser?.id ? (
                          <FlexBox sx={{ flexDirection: 'column' }}>
                            <Button
                              component={RouterLink}
                              to={`/users/${user.id}/bookmarks`}
                              key='one'
                              variant="contained"
                              startIcon={<BookmarksIcon />}
                              style={styles.actionbutton}
                            >
                              お気に入り
                            </Button>
                            <Button
                              component={RouterLink}
                              to={`/users/${user.id}/message_rooms`}
                              key='two'
                              variant="contained"
                              startIcon={<MailIcon />}
                              style={styles.actionbutton}
                            >
                              メッセージ一覧
                            </Button>
                            <Button
                              component={RouterLink}
                              to={`/users/${user.id}/owners`}
                              key='three'
                              variant="contained"
                              startIcon={<HouseIcon />}
                              style={styles.actionbutton}
                            >
                              管理施設一覧
                            </Button>
                            <Button
                              key='four'
                              variant="contained"
                              startIcon={<EditIcon />}
                              style={styles.actionbutton}
                              onClick={editUser}
                            >
                              プロフィール編集
                            </Button>
                            <Button
                              key='five'
                              variant="contained"
                              style={styles.actionbutton}
                              onClick={handleResetNotification}
                            >
                              通知リセット（debag）
                            </Button>
                          </FlexBox>
                          ) : (
                            <FlexBox sx={{ flexDirection: 'column' }}>
                              {
                                followingUsers.some(followinguser => followinguser.id === user.id) ? (
                                  <UnfollowButton onClick={userUnfollow}/>
                                ) : (
                                  <FollowButton onClick={userFollow}/>
                                )
                              }
                              {
                                // 相互にフォローしている場合のみ、メッセージを送るボタンを表示する
                                (followingUsers.some(member => member.id === user.id)) && 
                                (user.following.some(member => member.id === currentUser?.id)) &&
                                  <Button
                                    component={RouterLink}
                                    to={`/users/${currentUser?.id}/message_rooms`}
                                    variant="contained"
                                    startIcon={<MailIcon />}
                                    style={styles.actionbutton}
                                    >
                                    メッセージを送る
                                  </Button>
                              }
                            </FlexBox>
                          )
                        }
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
                  <UserTab label='フォロー中'></UserTab>
                  <UserTab label='フォロワー'></UserTab>
                </Tabs>
                <TabPanel value={tab} index={0}>
                  {
                    user.reviews.length > 0 ? (
                      user.reviews.map((review: ReviewData) => (
                        <Box key={review.id}>
                          <ReviewSimple
                            id={review.id}
                            content={review.content}
                            date={review.date}
                            evaluation={review.evaluation}
                            user={user}
                            house={review.house}
                            tags={review.tags}
                            setState={DummyFuction}
                          />
                        </Box>
                      ))
                    ) : (
                      <p>まだ口コミはありません</p>
                    )
                  }
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  {
                    user.following.length > 0 ? (
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          mt: 1
                        }}
                      >
                        {
                          user.following.map((user: UserData) => (
                            <Grid item xs={12} md={6} lg={4} key={user.id}>
                              <User
                                id={user.id}
                                name={user.name}
                                email={user.email}
                                backgroundImage={user.backgroundImage}
                                profile={user.profile}
                                avatar={user.avatar}
                                provider={user.provider}
                                uid={user.uid}
                                allowPasswordChange={user.allowPasswordChange}
                                reviews={user.reviews}
                                likes={user.likes}
                                following={user.following}
                                followers={user.followers}
                              />
                            </Grid>
                          ))
                        }
                      </Grid> 
                    ) : (
                      <p>フォローしているユーザーはいません</p>
                    )
                  }
                </TabPanel>
                <TabPanel value={tab} index={2}>
                {
                    user.followers.length > 0 ? (
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          mt: 1
                        }}
                      >
                        {
                          user.followers.map((user: UserData) => (
                            <Grid item xs={12} md={6} lg={4} key={user.id}>
                              <User
                                id={user.id}
                                name={user.name}
                                email={user.email}
                                backgroundImage={user.backgroundImage}
                                profile={user.profile}
                                avatar={user.avatar}
                                provider={user.provider}
                                uid={user.uid}
                                allowPasswordChange={user.allowPasswordChange}
                                reviews={user.reviews}
                                likes={user.likes}
                                following={user.following}
                                followers={user.followers}
                              />
                            </Grid>
                          ))
                        }
                      </Grid> 
                    ) : (
                      <p>フォロワーはいません</p>
                    )
                  }
                </TabPanel>
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