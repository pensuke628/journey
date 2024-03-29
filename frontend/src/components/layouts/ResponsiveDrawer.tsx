import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// MUIのimport
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// MUIIconsのimport
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

// interfaceのimport
import { Notification } from 'interfaces/index';

//  Contextのimport
import { AuthContext, BookmarkContext, LikeContext ,NotificationContext, OwnerContext ,RelationshipContext } from 'App';

// apiを叩く関数のimport
import { signIn, signOut } from 'lib/api/auth';
import { updateNotifications } from 'lib/api/notification';

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

const ResponsiveDrawer: React.FC<Props> = ( {children} ) => {
  
  const navigate = useNavigate();
  const { loading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser } = useContext(AuthContext);
  const { setBookmarkingHouses } = useContext(BookmarkContext);
  const { setFollowingUsers } = useContext(RelationshipContext);
  const { notifications, setNotifications } = useContext(NotificationContext);
  const { setLikingReviews } = useContext(LikeContext);
  const { setOwneredHouses } = useContext(OwnerContext);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [bottomMenuValue, setBottomMenuValue] = useState<number>(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // 未読の通知の数をカウントする
  const noCheckNotificationCount: number = notifications.filter((notification) => !notification.checked).length

  const drawer = (
    <div>
      <Toolbar>
        <Link
          component={RouterLink}
          to='/'
          color='inherit'
          underline='none'
          sx={{
            textAlign: 'center'
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt=''
            height='100'
          />
        </Link>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to='/'
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'トップページ'}/>
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const AuthMenu:React.FC = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElSignup, setAnchorElSignup] = useState<null | HTMLElement>(null);
    const [anchorElNotification, setAnchorElNotification] = useState<null | HTMLElement>(null);

   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleOpenSignupMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElSignup(event.currentTarget);
    };

    const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNotification(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
  
    const handleCloseSignupMenu = () => {
      setAnchorElSignup(null);
    };

    const handleCloseNotifications = () => {

      const checkedNotifications = notifications.map((value :Notification) => {
        return value;
      });
      // 通知を全て既読にする
      updateNotifications( { id: currentUser?.id } )

      // 既読にした通知をstateにセットする
      checkedNotifications.forEach((notification: Notification) => {
        notification['checked'] = true
      })
      setNotifications([...checkedNotifications]);

      setAnchorElNotification(null);
    };

    const notificationColor = (notification: Notification) => {
      if(notification.checked) {
        return 'white'
      } else {
        return 'yellow'
      }
    }
    const handleGuestLogin = async() => {
      if (setAnchorElSignup !== null) {
        setAnchorElSignup(null);
      }
      // ゲストユーザー用のアカウントとして、ログインする
      try {
        const guestLoginData = {
          email: 'guest_user@example.com',
          password:  process.env.REACT_APP_GUESTPASSWORD
        }
        const res = await signIn(guestLoginData);
        if (res.status === 200) {
          // ログインに成功した場合はCookieに各値を格納する
          Cookies.set('_access_token', res.headers['access-token']);
          Cookies.set('_client', res.headers['client']);
          Cookies.set('_uid', res.headers['uid']);
          
          setIsSignedIn(true);
          setCurrentUser(res.data.data);
          navigate('/');
        }
      } catch(error){
        console.log(error);
      }
    }

    const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        const res = await signOut();
  
        if (res.data.success === true) {
          // サインアウト時には各Cookieを削除
          Cookies.remove("_access_token");
          Cookies.remove("_client");
          Cookies.remove("_uid");
  
          setIsSignedIn(false);
          setCurrentUser(undefined);
          setFollowingUsers([]);
          setLikingReviews([]);
          setBookmarkingHouses([]);
          setNotifications([]);
          setOwneredHouses([]);
          navigate('/signin');
  
          console.log('ログアウトに成功しました');
        } else {
          console.log('ログアウトに失敗しました');
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (!loading) {
      if (isSignedIn) {
        // 認証完了後のメニュー
        return (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='notifications'>
              <IconButton onClick={handleOpenNotifications} sx={{ p: 2, m:2  }}>
                <Badge badgeContent={noCheckNotificationCount} color='error'>
                  <NotificationsIcon/>
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElNotification}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotification)}
              onClose={handleCloseNotifications}
            >
              {
                notifications?.map((notification: Notification, index: number) => {
                  return (
                  <MenuItem
                    key={index}
                    onClick={handleCloseNotifications}
                    sx={{
                      backgroundColor: notificationColor(notification)
                    }}
                  >
                     { (notification.act === 'comment') && 
                        <Box sx={{ display: 'flex'}}>
                          <Avatar
                            component={RouterLink}
                            to={`/users/${notification.sender.id}`}
                            src={notification.sender.avatar.url}
                            sx={{ mx:1 }}
                          />
                          <Typography>
                            <Typography
                              component={RouterLink}
                              to={`users/${notification.sender.id}`}
                            >
                              {notification.sender.name}
                            </Typography>
                            さんが
                            <Typography
                              component={RouterLink}
                              to={`reviews/${notification.reviewId}`}
                            >
                            あなたの投稿{notification.reviewId}
                            </Typography>
                            にコメントしました
                          </Typography>
                        </Box>
                    }
                     { (notification.act === 'follow') &&
                      <Box sx={{ display: 'flex' }}>
                        <Avatar
                          component={RouterLink}
                          to={`/users/${notification.sender.id}`}
                          src={notification.sender.avatar.url}
                          sx={{ mx:1 }}
                        />
                        <Typography>
                          <Typography
                            component={RouterLink}
                            to={`users/${notification.sender.id}`}
                          >
                            {notification.sender.name}
                          </Typography>
                          さんがあなたをフォローしました
                        </Typography>
                      </Box>
                     }
                     { (notification.act === 'like') &&
                      <Box sx={{ display: 'flex' }}>
                        <Avatar
                          component={RouterLink}
                          to={`/users/${notification.sender.id}`}
                          src={notification.sender.avatar.url}
                          sx={{ mx:1 }}
                        />
                        <Typography>
                          <Typography
                            component={RouterLink}
                            to={`users/${notification.sender.id}`}
                          >
                            {notification.sender.name}
                          </Typography>
                          さんが
                          <Typography
                            component={RouterLink}
                            to={`reviews/${notification.reviewId}`}
                          >
                            あなたの投稿
                          </Typography>
                          をいいねしました
                        </Typography>
                      </Box>
                     }
                     { (notification.act === 'message') &&
                      <Box sx={{ display: 'flex' }}>
                        <Avatar
                          component={RouterLink}
                          to={`/users/${notification.sender.id}`}
                          src={notification.sender.avatar.url}
                          sx={{ mx:1 }}
                        />
                        <Typography>
                          <Typography
                            component={RouterLink}
                            to={`users/${notification.sender.id}`}
                          >
                            {notification.sender.name}
                          </Typography>
                          さんが
                          <Typography
                            component={RouterLink}
                            to={`/users/${currentUser?.id}/message_rooms`}
                          >
                            メッセージ
                          </Typography>
                          を送信しました
                        </Typography>
                      </Box>
                     }
                     { (notification.act === 'review') &&
                      <Box sx={{ display: 'flex' }}>
                        <Avatar
                          component={RouterLink}
                          to={`/users/${notification.sender.id}`}
                          src={notification.sender.avatar.url}
                          sx={{ mx:1 }}
                        />
                        <Typography>
                          <Typography
                            component={RouterLink}
                            to={`users/${notification.sender.id}`}
                            >
                            {notification.sender.name}
                          </Typography>
                          さんが
                          <Typography
                            component={RouterLink}
                            to={`reviews/${notification.reviewId}`}
                            >
                            口コミ
                          </Typography>
                          を作成しました
                        </Typography>
                      </Box>
                     }
                  </MenuItem>
                  )
                })
              }
            </Menu>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src={`${currentUser?.avatar.url}`}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                component={RouterLink}
                to={`/users/${currentUser?.id}/message_rooms`}
                onClick={handleCloseUserMenu}
              >
                <ListItemIcon>
                  <MailIcon/>
                </ListItemIcon>
                <ListItemText>メッセージ</ListItemText>
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to={`/users/${currentUser?.id}`}
                onClick={handleCloseUserMenu}
              >
                <ListItemIcon>
                  <PersonIcon/>
                </ListItemIcon>
                <ListItemText>マイページ</ListItemText>
              </MenuItem>
              <MenuItem
                component={Button}
                onClick={handleSignOut}
              >
                <ListItemIcon>
                  <LogoutIcon/>
                </ListItemIcon>
                <ListItemText>ログアウト</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        );
      } else {
        // 認証前のメニュー
        return (
          <Box sx={{ flexGrow: 0 }}>
            <Box
              sx = {{
                display:  { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
               <Button
                  component={RouterLink}
                  to='signup'
                  variant='contained'
                  color='inherit'
                  sx={{
                    mx:1,
                    color: '#111',
                    backgroundColor: '#ccc',
                    borderRadius: '28px',
                  }}
               >
                <Typography>
                  新規登録
                </Typography>
               </Button>
               <Button
                  component={RouterLink}
                  to='signin'
                  variant='contained'
                  color='success'
                  sx={{
                    mx: 1,
                    // backgroundColor: '#000',
                    borderRadius: '28px'
                  }}
               >
                <Typography>
                   ログイン
                </Typography>
               </Button>
               <Button
                  variant='contained'
                  color='info'
                  onClick={handleGuestLogin}
                  sx={{
                    mx: 1,
                    borderRadius: '28px'
                  }}
               >
                <Typography>
                   ゲストログイン(閲覧用)
                </Typography>
               </Button>
            </Box>
            <Box
              sx = {{
                display: { sm: 'flex', md: 'none' }
              }}
            >
              <Tooltip title="ログインメニュー">
                <IconButton onClick={handleOpenSignupMenu} sx={{ p: 0 }}>
                  <Avatar><SettingsIcon/></Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElSignup}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElSignup)}
                onClose={handleCloseSignupMenu}
              >
                <MenuItem
                  component={RouterLink}
                  to='/signup'
                  onClick={handleCloseSignupMenu}
                >
                  <ListItemText>新規登録</ListItemText>
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to='/signin'
                  onClick={handleCloseSignupMenu}
                >
                  <ListItemText sx={{marginX: 'auto'}}>ログイン</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleGuestLogin}
                >
                  <ListItemText>ゲストログイン（閲覧用）</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        );
      }
    } else {
      return <></>
    };
  };

  return (
    <Box
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CssBaseline />
        <AppBar
          position='relative'
          elevation={0}
          sx={{
            // width: { md: `calc(100% - ${drawerWidth}px)` },
            // ml: { md: `${drawerWidth}px` },
            backgroundColor: '#fff',
            height: '100px'
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { md: 'none' },
                color: '#000'
              }}
            >
              <MenuIcon />
            </IconButton>
            <Link
              component={RouterLink}
              to='/'
              color='inherit'
              underline='none'
              sx={{
                textAlign: { sm: 'center', md: 'left'},
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt=''
                height='100'
              />
            </Link>
            <AuthMenu/>
          </Toolbar>
        </AppBar>
        <Box
          component='nav'
          sx={{
            flexShrink: { md: 0 }
          }}
          aria-label='mailbox folders'
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: 'none',
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box>
          {children}
        </Box>
      <Paper
        sx={{
          display: { sm: 'block', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
        { currentUser? (
            <BottomNavigation
              showLabels
              value={bottomMenuValue}
              onChange={(event, newValue) => {
                setBottomMenuValue(newValue);
              }}
            >
              <BottomNavigationAction
                component={RouterLink}
                to='/'
                label='TOP'
                icon={<HomeIcon />}
              />
              <BottomNavigationAction
                component={RouterLink}
                to={`/users/${currentUser?.id}`}
                label='マイページ'
                icon={<PersonIcon/>}
              />
            </BottomNavigation>
          ) : (
            <BottomNavigation
              showLabels
              value={bottomMenuValue}
              onChange={(event, newValue) => {
                setBottomMenuValue(newValue);
              }}
            >
              <BottomNavigationAction
                component={RouterLink}
                to='/'
                label='TOP'
                icon={<HomeIcon />}
              />
              <BottomNavigationAction
                component={RouterLink}
                to='/signin'
                label='ログイン'
                icon={<LoginIcon />}
              />
              <BottomNavigationAction
                component={RouterLink}
                to='/signup'
                label='新規登録'
                icon={<AddIcon />}
              />
            </BottomNavigation>
          )
        }
      </Paper>
    </Box>
  );
}

export default ResponsiveDrawer
