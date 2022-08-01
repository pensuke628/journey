import React, { useContext, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

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

// componentのimport
import CustomTag from 'components/utils/Tag';

// MUIIconsのimport
import FavoriteIcon from '@mui/icons-material/Favorite';


// interfaceのimport
import { HouseData, Notification, ReviewData, TagSearch, UserData } from 'interfaces/index';

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
  user: UserData
  house: HouseData
  tags: TagSearch[] | undefined
  setState: Function
}

const ReviewSimple: React.FC<Props> = (props) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, currentUser } = useContext(AuthContext);
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
      receiverId: props.user.id,
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
        setLikingReviews([...likingReviews, res.data.data]);
        createNotification(notificationParams);
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
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleTagSearch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const keyword = event.currentTarget.value;
    if (location.pathname === '/reviews/search') {
      // 検索結果画面から再度検索するため、stateを更新する関数を実行する
      props.setState(keyword);
    } else {
      navigate('/reviews/search', { state: keyword });
    }
  };

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
          <Avatar
            component={RouterLink}
            to={`/users/${props.user.id}`}
            src={props.user.avatar.url}
          />
        }
        title={
          <Typography
            component={RouterLink}
            to={`/users/${props.user.id}`}
            color='inherit'
            sx={{ textDecoration: 'none' }}
          >
            {props.user.name}さん
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex' }}>
            <Typography
              component={RouterLink}
              to={`/houses/${props.house.id}`}
              color='inherit'
              sx={{
                textDecoration: 'none',
                mr:1
              }}
            >
              {props.house.name}
            </Typography>
            <Typography>
              {viewDate(props.date)}訪問
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <Box
          sx={{
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
            sx={{
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {props.content}
          </Typography>
          <Box sx={{ display: 'flex' }}>
          {
            props.tags?.map((tag, index) => {
              return (
                <CustomTag
                  key={index}
                  text={tag.name}
                  onClick={(event)=> {
                    handleTagSearch(event);
                  }}
                />
              )
            })
          }
          </Box>
          {
            isSignedIn &&
              <CardActions>
                {
                  isLikedReview(props.id) ? (
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
              </CardActions>
          }
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReviewSimple