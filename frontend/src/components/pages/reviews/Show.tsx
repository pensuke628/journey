import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useParams, useNavigate, } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography  from '@mui/material/Typography';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Message';
import ReplyIcon from '@mui/icons-material/Reply';

import CustomTag from 'components/utils/Tag';

// ReactHooksFormのimport
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthContext, LikeContext, OwnerContext } from 'App';
import { ReviewUpdateParams, ReviewData, Comment, CommentUpdateParams, Notification, TagSearch } from 'interfaces/index';

import { getReview, updateReview, destroyReview } from 'lib/api/review';
import { ReviewUpdateSchema } from 'schema/review';
import { deleteRequest } from 'lib/api/owner';
import { createComment, updateComment, destroyComment } from 'lib/api/comment';
import { like, unlike } from 'lib/api/like';
import { createNotification } from 'lib/api/notification';

const styles = {
  replybox: {
    margin: '1rem'
  },
  replyboxicon: {
    fontSize: 48,
    transform: 'rotate(180deg)'
  },
  commentField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#fff',
        // 通常時のボーダー色(アウトライン)
      },
      '&:hover fieldset': {
        borderColor: '#fff',
        // ホバー時のボーダー色(アウトライン)
      },
    }
  } 
}

const ReviewShow: React.FC = () => {

  type Image = {
    id: number,
    image: {
      url: string
    },
    reviewId: number,
    createdAt: Date,
    updatedAt: Date,
  }

  const InitialReview: ReviewData = {
    id: 0,
    content: '',
    date: new Date(),
    evaluation: 0,
    user: {
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
    },
    house: {
      id: 0,
      name: "",
      postalCode: "",
      prefectures: "",
      municipalities: "",
      latitude: undefined,
      longitude: undefined,
      image: {
        url: ""
      },
      profile: "",
      phoneNumber: "",
      email: "",
      relatedWebsite: "",
      price: "",
      period: "",
      checkInTime: "",
      checkOutTime: "",
      capacity: "",
      parking: "",
      bath: "",
      shopping: "",
      note: "",
      tags: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    tags: [],
    images: [],
  }

  const navigate = useNavigate();
  const { isSignedIn, currentUser } = useContext(AuthContext);
  const { likingReviews, setLikingReviews } = useContext(LikeContext);
  const { owneredHouses } = useContext(OwnerContext);
  const query = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewData>(InitialReview);
  const [reviewComments, setReviewComments] = useState<Comment[]>([]);
  const [reviewImages, setReviewImages] = useState<Image[]>([]);
  const [reviewTags, setReviewTags] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [editComment, setEditComment] = useState<boolean>(false);
  const [editViewOpen, setEditViewOpen] = useState<boolean>(false);
  const [commentViewOpen, setCommentViewOpen] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReviewUpdateParams>({
    resolver: yupResolver(ReviewUpdateSchema),
  });
  
  const fetch = async() => {
    try {
      const res = await getReview(query.id);
      if (res.status === 200) {
        console.log(res.data);
        setReview(res.data);
        setReviewComments(res.data.comments);
        setReviewImages(res.data.images);
        returnTags(res.data.tags);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const createFormData = (data: ReviewUpdateParams) => {
    const { content,
            evaluation
          } = data;
    const formData = new FormData();

    formData.append('content', content);
    formData.append('evaluation', String(evaluation));
    if (reviewTags) {
      formData.append('tags', reviewTags);
    }
    return formData
  }

  const handleCreateLike = async() => {
    const params = {
      reviewId: review.id
    };

    const notificationParams: Notification = {
      senderId: currentUser?.id,
      receiverId: review.user.id,
      reviewId: review.id,
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
      reviewId: review.id
    }
    try {
      const res = await unlike(params);
      if (res.status === 200) {
        const newLikingReview = likingReviews.filter((likedReview: ReviewData ) => likedReview.id !== review.id );
        setLikingReviews([...newLikingReview]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = () => {
    setEditViewOpen(!editViewOpen);
  }

  const handleDestroy = async() => {
    console.log('Delete Review!');
    try {
      const res = await destroyReview(query.id);
      console.log(res);
      if (res.status === 200) {
        navigate(`/houses/${review.house.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteRequest = async() => {
    let id:number = Number(query.id);

    const params = {
      userId: currentUser?.id,
      reviewId: id
    }

    try {
      const res = await deleteRequest(params)
      if (res.status === 200) {
        console.log('削除依頼しました')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCommentViewOpen = () => {
    setCommentViewOpen(!commentViewOpen);
  }

  const handleCreateComment = async() => {
    let id:number = Number(query.id);

    if (currentUser !== undefined) {
      const params = {
        content: comment,
        reviewId: id,
        user: currentUser
      };

      try {
        const res = await createComment(params);
        if (res.status === 200) {
          setReviewComments([res.data.comment, ...reviewComments ]);
          setCommentViewOpen(false);

          const notificationParams: Notification = {
            senderId: currentUser?.id,
            receiverId: res.data.other.id,
            reviewId: undefined,
            commentId: res.data.comment.id,
            messageId: undefined,
            act: 'comment',
            checked: undefined,
            createdAt: undefined,
            updatedAt: undefined
          };

          createNotification(notificationParams);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleUpdateComment = async(id: number | undefined) => {
    const params: CommentUpdateParams = {
      content: comment,
      reviewId: review.id
    }
    try {
      const res = await updateComment(id, params);
      if (res.status === 200) {
        const filtercomment = reviewComments.filter(comment => comment.id !== id)
        setReview({...review, comments: filtercomment})
        setReviewComments([res.data.comment, ...filtercomment]);
        setComment(res.data.comment.content);
        setEditComment(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateCancel = () => {
    setComment('');
    setEditComment(false);
  }

  const handleDestroyComment = async(id: number | undefined) => {
    console.log('Comment Destroy');
    try {
      const res = await destroyComment(id);
      if (res.status === 200) {
        const filtercomment = reviewComments.filter(comment => comment.id !== id)
        setReviewComments([...filtercomment]);
        setComment('');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async(data: ReviewUpdateParams) => {
    const formData = createFormData(data);
    console.log(data);
    try {
      const res = await updateReview(query.id, formData);
      console.log(res);
      if (res.status === 200) {
        setReview(review => ({...review, content: data.content }));
        setReview(review => ({...review, evaluation: Number(data.evaluation) }));
        const setTagsData: TagSearch[] = tagToArray(reviewTags)
        setReview(review => ({...review, tags: setTagsData}));
        setEditViewOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleTagSearch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const keyword = event.currentTarget.value;
    navigate('/reviews/search', { state: keyword });
  };

  const isLikedReview = (reviewId: number | undefined): boolean => {
    return likingReviews?.some((likedReview: ReviewData) => likedReview.id === reviewId)
  };

  useEffect(() => {
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const viewDate = (date: Date) => {
    let newdate: Date = new Date(date);
    let year: string = (newdate.getFullYear()).toString();
    let month: string = (1 + newdate.getMonth()).toString();
    return `${year}年${month}月`
  };

  const returnTags = (taglist: TagSearch[] |  undefined) => {
    if (taglist) {
      const tagNames = taglist.map(tag => tag.name);
      // 配列要素をstringで展開し、,を除いたものを返す
      const tags: string = tagNames.toString().replace(/,/g," ");
      setReviewTags(tags);
    }
  };

  // string型配列のタグをオブジェクト型配列に変換する
  const tagToArray = (Tags: string) => {
    const tagsArray = Tags.split(' ');
    const tagsArrayOfObject:TagSearch[] = [];
    tagsArray.forEach((tag: string) => {
      tagsArrayOfObject.push({name: tag})
    })
    return tagsArrayOfObject
  }

  return (
    <>
      {
        editViewOpen ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>口コミを編集する</h3>
            <Controller
              name='content'
              control={control}
              defaultValue={review.content}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={7}
                  error={'content' in errors}
                  helperText={errors.content?.message}
                />
              )}
            />
            <Controller
              name='evaluation'
              control={control}
              defaultValue={review.evaluation}
              render={( props ) => (
                <Rating
                  onChange={props.field.onChange}
                  value={Number(props.field.value)}
                  precision={0.5}
                />
              )}
            />
            <TextField
              label='タグ'
              fullWidth
              helperText='複数タグを紐付けたい場合は、半角スペースで区切ってください'
              value={reviewTags}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => 
                setReviewTags(event.target.value)
              }
            />
            <Box sx={{ display: 'flex' }}>
              <Button
                variant='contained'
                color='success'
                startIcon={<EditIcon/>}
                onClick={handleEdit}
                sx={{ m:1 }}
              >
                編集を終了する
              </Button>
              <Button
                type='submit'
                variant='contained'
                startIcon={<AutorenewIcon/>}
                sx={{ m:1 }}
              >
                更新する
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <Card>
              <CardHeader
                avatar={
                  <Avatar
                    component={RouterLink}
                    to={`/users/${review.user.id}`}
                    src={review.user.avatar.url}
                  />
                }
                title={
                  <Typography
                    component={RouterLink}
                    to={`/users/${review.user.id}`}
                    color='inherit'
                    sx={{ textDecoration: 'none' }}
                  >
                    {review.user.name}さん
                  </Typography>
                }
                subheader={
                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      component={RouterLink}
                      to={`/houses/${review.house.id}`}
                      color='inherit'
                      sx={{
                        textDecoration: 'none',
                        mr:1
                      }}
                    >
                      {review.house.name}
                    </Typography>
                    <Typography>
                      {viewDate(review.date)}訪問
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column'
                  }}
                >
                  <Rating
                    value={review.evaluation}
                    precision={0.5}
                    readOnly                    
                  />
                  <Typography
                  >
                    {review.content}
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                  {
                    review.tags?.map((tag, index) => {
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
                  <ImageList cols={3} rowHeight={164}>
                    {[...Array(3)].map((_: number, index: number) =>
                      index < reviewImages.length ? (
                        <ImageListItem key={index}>
                          <ImageListItemBar
                            sx={{
                              background: 'rgba(0,0,0,0)',
                            }}
                            position='top'
                            actionIcon={
                              <IconButton
                                // onClick={() => handleCancel(index)}
                              >
                                {/* <ClearIcon/>               */}
                              </IconButton>
                            }
                          />
                          <img
                            src={reviewImages[index].image.url}
                            alt={`あなたの画像 ${index + 1}`}
                          />
                        </ImageListItem>
                      ) : ( null )
                    )}
                  </ImageList>
                  <CardActions>
                    {
                      isSignedIn && (
                        isLikedReview(review.id) ? (
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
                      )
                    }
                    {
                      // 施設のオーナーのみ表示する
                      (owneredHouses.some(house => house.id === review.house.id)) &&
                        <IconButton
                          onClick={handleCommentViewOpen}
                        >
                          <MessageIcon/>
                        </IconButton>
                    }
                  </CardActions>
                </Box>
              </CardContent>
            </Card>
            { commentViewOpen ? (
                <Box style={styles.replybox}>
                  <Box sx={{ display: 'flex'}}>                    
                    <ReplyIcon style={styles.replyboxicon}/>
                    <TextField
                      variant='outlined'
                      placeholder='コメントを入力してください'
                      fullWidth
                      multiline
                      rows={3}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setComment(event.target.value)}
                    />
                  </Box>
                  <Box sx= {{ textAlign: 'right'}}>
                    <Button
                      variant='contained'
                      sx = {{
                        m: 2
                      }}
                      onClick={handleCreateComment}
                    >
                      返信する
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  { 
                    reviewComments.length > 0 &&
                    reviewComments.map((comment:Comment, index:number) => {
                      return (
                        <Card key={index} sx={{ m:2 }}>
                          <CardHeader
                            avatar={
                              <Avatar
                                component={RouterLink}
                                to={`/users/${comment.user.id}`}
                                src={comment.user.avatar.url}
                              />
                            }
                            title={
                              <Typography
                                component={RouterLink}
                                to={`/users/${comment.user.id}`}
                                color='inherit'
                                sx={{ textDecoration: 'none' }}
                              >
                                {comment.user.name}さん
                              </Typography>
                            }
                          />
                          <CardContent>
                            <TextField
                              fullWidth
                              defaultValue={comment.content}
                              InputProps={{
                                readOnly: (!editComment || comment.user.id !== currentUser?.id),
                              }}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setComment(event.target.value)}
                              sx={styles.commentField}
                            />
                          </CardContent>
                            { comment.user.id === currentUser?.id ? (
                                editComment ? (
                                  <CardActions>
                                    <Button
                                      variant='contained'
                                      color='success'
                                      startIcon={<AutorenewIcon/>}
                                      onClick={() => handleUpdateComment(comment.id)}
                                    >
                                      更新する
                                    </Button>
                                    <Button
                                      variant='contained'
                                      color='error'
                                      startIcon={<CancelIcon/>}
                                      onClick={handleUpdateCancel}
                                    >
                                      取り消す
                                    </Button>
                                  </CardActions>
                                ) : (
                                  <CardActions>
                                    <IconButton
                                      onClick={() => setEditComment(!editComment)}
                                    >
                                      <EditIcon/>
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleDestroyComment(comment.id)}
                                    >
                                      <DeleteForeverIcon/>
                                    </IconButton>
                                  </CardActions>
                                )
                              ) : (null)
                            }
                        </Card>
                      )
                    })
                  }
                  <Box sx={{ display: 'flex' }}>
                  { 
                    // 口コミ投稿者のみ表示する
                    (review.user.id === currentUser?.id) &&
                      <Box>
                        <Button
                          variant='contained'
                          color='success'
                          startIcon={<EditIcon/>}
                          onClick={handleEdit}
                          sx={{ m:1 }}
                        >
                          編集する
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          startIcon={<DeleteForeverIcon/>}
                          onClick={handleDestroy}
                          sx={{ m:1 }}
                        >
                          削除する
                        </Button>
                      </Box>
                  }
                  { 
                    // 施設のオーナーのみ表示する
                    (owneredHouses.some(house => house.id === review.house.id)) &&
                      <Button
                        variant='contained'
                        color='info'
                        startIcon={<InfoIcon/>}
                        onClick={handleDeleteRequest}
                        sx={{ m:1 }}
                      >
                        削除依頼する
                      </Button>              
                  }
                  </Box>
                </Box>
              )
            }
            
          </>
        )
      }
    </>
  );
}

export default ReviewShow