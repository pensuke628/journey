import React, {useState, useContext} from 'react';
import { 
  Link as RouterLink,
  useNavigate,
} from 'react-router-dom';
import Cookies from 'js-cookie';

// MUIのimport
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
 } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import PersonIcon from '@mui/icons-material/Person';

import { Notification } from 'interfaces/index'

import { signOut } from 'lib/api/auth';

import { AuthContext, NotificationContext } from 'App';

const pages = ['Products', 'Pricing', 'Blog'];

const Header: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const { loading, isSignedIn, setIsSignedIn, currentUser } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const noCheckNotificationCount: number = notifications.filter((notification) => !notification.checked).length

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
                display:  { xs: 'none', md: 'flex' },
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
                display: { xs: 'flex', md: 'none' }
              }}
            >
              <Tooltip title="Signup menu">
                <IconButton onClick={handleOpenSignupMenu} sx={{ p: 0 }}>
                  <Avatar><ArrowUpwardIcon/></Avatar>
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

  return(
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
          variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <AuthMenu/>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;