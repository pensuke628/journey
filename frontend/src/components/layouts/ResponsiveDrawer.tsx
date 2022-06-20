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
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import PersonIcon from '@mui/icons-material/Person';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SettingsIcon from '@mui/icons-material/Settings';

// interfaceのimport
import { Notification } from 'interfaces/index';

//  Contextのimport
import { AuthContext, NotificationContext } from 'App';

// apiを叩く関数のimport
import { signOut } from 'lib/api/auth';

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

const ResponsiveDrawer: React.FC<Props> = ( {children} ) => {
  // const { window } = props;
  const navigate = useNavigate();
  const { loading, isSignedIn, setIsSignedIn, currentUser } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [bottomMenuValue, setBottomMenuValue] = useState<number>(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // 未読の通知の数をカウントする
  const noCheckNotificationCount: number = notifications.filter((notification) => !notification.checked).length

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to='/about'
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <QuestionMarkIcon />
            </ListItemIcon>
            <ListItemText primary={'Journeyとは'}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to='/'
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

  // const container = window !== undefined ? () => window().document.body : undefined;
  // const year: number = new Date().getFullYear();

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

    const handleCloseNotifications= () => {

      const checkedNotifications = notifications.map(value => {return value;
      });
      checkedNotifications.forEach(notification => {
        notification['checked'] = true;
      })
      // DBのデータを書き換える処理を追加する必要がある

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

    const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        const res = await signOut();
  
        if (res.data.success === true) {
          // サインアウト時には各Cookieを削除
          Cookies.remove("_access_token");
          Cookies.remove("_client");
          Cookies.remove("_uid");
  
          setIsSignedIn(false);
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
              <IconButton onClick={handleOpenNotifications} sx={{ p: 2 }}>
                <Badge badgeContent={noCheckNotificationCount} color='error'>
                  <NotificationsIcon sx={{ color: '#fff' }}/>
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
                      <Typography>{notification.senderId}さんが
                        <Typography
                          component={RouterLink}
                          to={`reviews/${notification.reviewId}`}
                        >
                         あなたの投稿{notification.reviewId}
                        </Typography>
                      にコメントしました</Typography>
                    }
                     { (notification.act === 'follow') &&
                      <Typography>{notification.senderId}さんがあなたをフォローしました</Typography> 
                     }
                     { (notification.act === 'like') &&
                      <Typography>{notification.senderId}さんが
                        <Typography
                          component={RouterLink}
                          to={`reviews/${notification.reviewId}`}
                        >
                          あなたの投稿
                        </Typography>
                      をいいねしました</Typography> }
                     { (notification.act === 'message') &&
                      <Typography>{notification.senderId}さんがメッセージを送信しました</Typography>
                     }
                     { (notification.act === 'review') &&
                      <Typography>{notification.senderId}さんが
                        <Typography
                          component={RouterLink}
                          to={`reviews/${notification.reviewId}`}
                        >
                          口コミ
                        </Typography>
                      を作成しました</Typography>
                     }
                    {/* {
                      if (notification.action === 'like') {    
                        return (
                          <Typography>{notification.senderId}さんが</Typography>
                        );
                      } else {
                        return (
                          <Typography>開発中</Typography>
                        );
                      }
                    } */}
                  </MenuItem>
                  )
                })
              }
            </Menu>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component={RouterLink}
                  to={`/users/${currentUser?.id}/message_rooms`}
                >
                  <Badge badgeContent={1} color='error'>
                    <MailIcon/>
                  </Badge>
                  <Typography>メッセージ</Typography>
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  component={RouterLink}
                  to={`/users/${currentUser?.id}`}
                  color="inherit"
                >
                  <PersonIcon/>
                  <Typography>マイページ</Typography>
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <IconButton
                  color="inherit"
                  onClick={handleSignOut}
                >
                  <LogoutIcon/>
                  <Typography>ログアウト</Typography>
                </IconButton>
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
                display:  { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
               <Button
                  component={RouterLink}
                  to='signup'
                  color="inherit"
               >
                新規登録
               </Button>
               <Button
                  component={RouterLink}
                  to='signin'
                  color="inherit"
               >
                 ログイン
               </Button>
            </Box>
            <Box
              sx = {{
                display: { xs: 'flex', sm: 'none' }
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
                <MenuItem onClick={handleCloseSignupMenu}>
                  <Link
                    component={RouterLink}
                    to='/signup'
                    color="inherit"
                    underline='none'
                    >
                      新規登録
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseSignupMenu}>
                  <Link
                    component={RouterLink}
                    to='/signin'
                    color="inherit"
                    underline='none'
                  >
                      ログイン
                  </Link>
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link
            component={RouterLink}
            to='/'
            color='inherit'
            underline='none'
            sx={{
              flexGrow: 1
            }}
          >
            Journey
          </Link>
          <AuthMenu/>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='mailbox folders'
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '70px',
          mx: 'auto'
        }}
        
      >
        {children}
      </Box>
      <Paper
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
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
            to='about'
            label='Journeyとは'
            icon={<QuestionMarkIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default ResponsiveDrawer
