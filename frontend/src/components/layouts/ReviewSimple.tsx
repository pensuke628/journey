import React, { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUIのimport
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Typography  from '@mui/material/Typography';

// MUIIconsのimport
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';

// interfaceのimport
import { Notification, ReviewData, Tag } from 'interfaces/index';

//  Contextのimport
import { AuthContext, LikeContext } from 'App';

// apiを叩く関数のimport
import { like, unlike } from 'lib/api/like';
import { createNotification } from 'lib/api/notification';

type Props = {
  id: number
  content: string
  date: Date
  evaluation: number | null
  userId: number
  tags: Tag[] | undefined
}

const ReviewSimple: React.FC<Props> = (props) => {
  const { currentUser } = useContext(AuthContext);
  const {likingReviews, setLikingReviews} = useContext(LikeContext);

  const viewDate = (date: Date) => {
    let newdate: Date = new Date(date);
    let year: string = (newdate.getFullYear()).toString();
    let month: string = (1 + newdate.getMonth()).toString();
    return `${year}年${month}月`
  }

  // いいねされているか判定する
  const isLikedReview = (reviewId: number | undefined): boolean => {
    return likingReviews?.some((likedReview: ReviewData) => likedReview.id === reviewId)
  };

  useEffect(() => {
    isLikedReview(props.id);
  },[likingReviews]);

  const handleCreateLike = async() => {
    const params = {
      reviewId: props.id
    };

    const notificationParams: Notification = {
      senderId: currentUser?.id,
      receiverId: props.userId,
      reviewId: props.id,
      commentId: undefined,
      messageId: undefined,
      act: 'like',
      checked: undefined,
      createdAt: undefined,
      updatedAt: undefined
    };

    try {
      const res = await like(params);
      if (res.status === 200) {
        console.log('いいねに成功');
        // console.log(res.data.data);
        setLikingReviews([...likingReviews, res.data.data]);
        const notification = await createNotification(notificationParams);
        if (notification.status === 200) {
          console.log('いいね通知を作成しました');
        } else {
          console.log('通知作成に失敗しました');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDestroyLike = async() => {
    const params = {
      reviewId: props.id
    }
    try {
      const res = await unlike(params);
      if (res.status === 200) {
        const newLikingReview = likingReviews.filter((likedReview: ReviewData ) => likedReview.id !== props.id );
        setLikingReviews([...newLikingReview]);
        console.log('いいね解除に成功');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card
      sx={{
        maxWidth: '600px',
        border: '1px solid #ccc',
        mx: 'auto',
        my: 2,
      }}
    >
      <CardHeader
        avatar={
          <Avatar>
            R
          </Avatar>
        }
        title='ユーザー名を表示させる予定'
        subheader={`${viewDate(props.date)}訪問`}
      />
      <CardContent>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
          }}
        >
          <Rating
            value={props.evaluation}
            readOnly
          />
          <Typography
            component={RouterLink}
            to={`/reviews/${props.id}`}
          >
            {props.content}
          </Typography>
          <Box sx={{ display: 'flex' }}>
          {
            props.tags?.map((tag) => {
              return (
                <Typography key={tag.id}>
                  #{ tag.name }
                </Typography>
              )
            })
          }
          </Box>
          <CardActions>
            { isLikedReview(props.id) ? (
                <IconButton
                  onClick={handleDestroyLike}
                >
                  <FavoriteIcon sx={{ color: 'red' }}/>
                </IconButton> 
              ) : (
                <IconButton
                  onClick={handleCreateLike}
                >
                  <FavoriteIcon/>
                </IconButton> 
              )
            }
            <IconButton><MessageIcon/></IconButton>
            <IconButton><DeleteForeverIcon/></IconButton>
          </CardActions>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReviewSimple