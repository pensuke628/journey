import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUIのimport
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// コンポーネントのimport
import FollowButton from 'components/utils/FollowButton';
import UnfollowButton from 'components/utils/UnfollowButton';

// interfaceのimport
import { Follow, Notification, UserData } from 'interfaces/index';

//  Contextのimport
import { AuthContext, RelationshipContext } from 'App';

// apiを叩く関数のimport
import { follow, unfollow } from 'lib/api/relationships';
import { createNotification } from 'lib/api/notification';

// default画像のimport
import defaultBckgroundImage from 'defaultBackgroundImage.png';

const User: React.FC<UserData> = (props) => {
  const { currentUser, isSignedIn } = useContext(AuthContext);
  const { followingUsers, setFollowingUsers } = useContext(RelationshipContext);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // フォローしているかどうか、stateに初期値を設定する
  const checkFollow = () => {
    try {
      if (followingUsers.some(followinguser => followinguser.id === props.id)) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkFollow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // ユーザーをフォローする
  const userFollow = async() => {
    const params: Follow = {
      followerId: currentUser?.id,
      followedId: props.id
    }

    const notificationParams: Notification = {
      senderId: currentUser?.id,
      receiverId: props.id,
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
      if (res.status === 200) {
        setFollowingUsers([props, ...followingUsers]);
        setIsFollowing(true);
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
      followedId: props.id
    }

    try {
      const res = await unfollow(params);
      // console.log(res);
      if (res.status === 200) {
        const newfollowing = followingUsers.filter(followinguser => followinguser.id !== props.id);
        setFollowingUsers([...newfollowing]);
        setIsFollowing(false);
        console.log('ユーザーのフォローを解除しました');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card
      sx={{
        maxWidth: 500,
        border: '1px solid black',
        my: 1
      }}
    >
      <CardMedia
        component="img"
        image={
          props.backgroundImage ? props.backgroundImage : defaultBckgroundImage
        }
        alt='Image for user_background_image'
        height='80'
      />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Avatar></Avatar>
            <Typography
              component={RouterLink}
              to={`/users/${props.id}`}
            >
                {props.name}
            </Typography>
            <Typography>
              { props.profile }
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <CardActions>
              {
                isSignedIn && !(currentUser?.id === props.id) ? (                
                  isFollowing ? (
                    <UnfollowButton onClick={userUnfollow}/>
                  ) : (
                    <FollowButton onClick={userFollow}/>
                  )
                ) : null
              }
            </CardActions>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default User