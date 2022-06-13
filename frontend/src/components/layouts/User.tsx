import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FollowButton from 'components/utils/FollowButton';
import UnfollowButton from 'components/utils/UnfollowButton';

import { AuthContext, RelationshipContext } from 'App';
// interfaceのimport
import { Follow, Notification } from 'interfaces/index';

import { follow, unfollow } from 'lib/api/relationships';
import { createNotification } from 'lib/api/notification';


type Props = {
  id: number
  name: string
  profile: string
  avatar: string
}

const User: React.FC<Props> = (props) => {
  const { currentUser, isSignedIn } = useContext(AuthContext);
  const { followingUsers, setFollowingUsers } = useContext(RelationshipContext);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // フォローしているかどうか、stateに初期値を設定する
  const checkFollow = () => {
    try {
      if (followingUsers.includes(props.id)) {
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
      // console.log(res);
      if (res.status === 200) {
        setFollowingUsers([props.id, ...followingUsers]);
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
        const newfollowing = followingUsers.filter(id => id !== props.id);
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
        maxWidth: 420,
        border: '1px solid black',
        my: 1
      }}
    >
      <CardMedia
        component="img"
        alt='Image for user_background_image'
      />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Avatar></Avatar>
            <Typography>
              <Link
                to ={`/users/${props.id}`}
              >
                {props.name}
              </Link>
            </Typography>
            <Typography>
              { props.profile }
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <CardActions>
              {
                isSignedIn && !(currentUser?.id === props.id) ? (                
                  !isFollowing ? (
                    // <FollowButton onClick={handleFollow}/>
                    <FollowButton onClick={userFollow}/>
                  ) : (
                    // <UnfollowButton onClick={handleUnfollow}/>
                    <UnfollowButton onClick={userUnfollow}/>
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