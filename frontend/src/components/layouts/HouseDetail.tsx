import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ja from 'date-fns/locale/ja'

// MUIのimport
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// MUIIconsのimport
import EditIcon from '@mui/icons-material/Edit';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';

// componentのimport
import UnbookmarkButton from 'components/utils/UnbookmarkButton';
import BookmarkButton from 'components/utils/BookmarkButton';
import ReviewSimple  from 'components/layouts/ReviewSimple'
import ImageUpload from 'components/layouts/ImageUpload';
import GoogleMapComponent from 'components/layouts/GoogleMapComponent';
import CustomTag from 'components/utils/Tag';

// ReactHooksFormのimport
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// interfaceのimport
import { Image, Notification, ReviewParams, ReviewData, Tag } from 'interfaces/index';

// バリデーションルールのimport
import { ReviewSchema } from 'schema/review';

import { AuthContext } from 'App';

// apiを叩く関数のimport
import { followerNotification } from 'lib/api/notification';
import { createReview } from 'lib/api/review';
import { uploadImage } from 'lib/api/image'

type Props = {
  id: number
  name: string
  postalCode: string
  prefectures: string
  municipalities: string
  latitude: number | undefined
  longitude: number | undefined
  image: {
    url: string
  }
  profile: string
  phoneNumber: string
  email: string
  relatedWebsite: string
  price: string
  period: string
  checkInTime: string
  checkOutTime: string
  capacity: string
  parking: string
  bath: string
  shopping: string
  note: string
  isBookmarked: boolean
  bookmark: () => void
  editHouse: () => void
  reviews: React.SetStateAction<ReviewData[]>
  tags: React.SetStateAction<Tag[]>
  houseImages: React.SetStateAction<Image[]>
}

type TabPanelProps = {
  children?: React.ReactNode;
  index: number
  value: number
}

const styles = {
  modalbox: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '800px',
    bgcolor: 'background.paper',
    border: '2px solid #ddd',
    boxShadow: 24,
    p: 4,
  },
  mobiledialogprops: {
    '.PrivatePickersToolbar-dateTitleContainer .MuiTypography-root': {
      fontSize: '1.5rem'
    }
  },
  datebox: {
    alignItems: 'center',
    my: 1
  }
};

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

const FlexBox = styled(Box) ({
  display: 'flex'
});

const HouseTab = styled(Tab) ({
  minWidth: '60px'
});

function createData(
  index: string,
  content: string
) {
  return { index, content };
}


const HouseDetail: React.FC<Props> = (props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewParams>({
    defaultValues: { tags: [''] },
    resolver: yupResolver(ReviewSchema),
  });
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [houseImages, setHouseImages] = useState<Image[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [reviewAverageScore, setReviewAverageScore] = useState<number>(0);

  const tabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleReviewOpen = () => {
    setReviewFormOpen(true);
  };

  const handleReviewClose = () => {
    setReviewFormOpen(false);
  };

  const onSubmit = async(data: ReviewParams) => {
    console.log(images[0]);
    try {
      const res = await createReview(data);
      console.log(res);
      if (res.status === 200) {
        console.log('口コミ作成に成功しました');

        const formData = new FormData();
        formData.append('review_id', res.data.review.id)

        // 繰り返し処理の箇所は後日修正する
        if (images.length >= 1 ) {
          formData.append('image', images[0]);
          await uploadImage(formData);
          if (images.length >= 2 ) {
            formData.append('image', images[1]);
            await uploadImage(formData);
            if (images.length >= 3) {
              formData.append('image', images[2]);
              await uploadImage(formData);
            }
          }
        } 

        setReviews([res.data.review, ...reviews]);
        setReviewFormOpen(false);
        const notificationParams: Notification = {
          senderId: res.data.review.userId,
          receiverId: 1,
          reviewId: res.data.review.id,
          commentId: undefined,
          messageId: undefined,
          act: 'create',
          checked: undefined,
          createdAt: undefined,
          updatedAt: undefined
        };
        const notification = await followerNotification(notificationParams);
        if (notification.status === 200) {
          console.log('フォローワーに通知を作成しました');
        } else {
          console.log('通知作成に失敗しました');
        }
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTagSearch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const keyword = event.currentTarget.value;
    navigate('/houses', { state: keyword });
  };

  const reviewEvaluationAverage = () => {
    const reviewEvaluationSum: number = reviews.reduce((sum, review) => sum + review.evaluation,0);
    const reviewCountExpectNull: number = reviews.filter((review) => review.evaluation !== null).length
    const reviewAverage: number = reviewEvaluationSum / reviewCountExpectNull;
    setReviewAverageScore(reviewAverage);
  }

  const DummyFuction = () => {
    console.log('');
  }

  useEffect(() => {
    setReviews(props.reviews);
    setTags(props.tags);
    setHouseImages(props.houseImages);
    reviewEvaluationAverage();
  },[props.reviews]);

  const address: string = `${props.prefectures}`.concat(`${props.municipalities}`);

  const houseDatas = [
    createData('場所', `${address}`),
    createData('電話番号', `${props.phoneNumber}`),
    createData('Eメール', `${props.email}`),
    createData('関連サイト', `${props.relatedWebsite}`),
    createData('料金', `${props.price}`),
    createData('期間', `${props.period}`),
    createData('チェックイン時刻', `${props.checkInTime}`),
    createData('チェックアウト時刻', `${props.checkOutTime}`),
    createData('収容人数', `${props.capacity}`),
    createData('駐車場', `${props.parking}`),
    createData('風呂', `${props.bath}`),
    createData('買い物', `${props.shopping}`),
    createData('備考', `${props.note}`),
  ]

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <Typography
          variant='h4'
        >
          {props.name}
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <LocalOfferOutlinedIcon/>
          {
            tags?.map(tag => {
              return (
                <CustomTag
                  key={tag.id}
                  text={tag.name}
                  onClick={(event)=> {
                    handleTagSearch(event);
                  }}
                />
              )
            })
          }
        </Box>
        <Grid
          container
          spacing={1}
          justifyContent='space-evenly'
        >
          <Grid item xs={12} sm={10} md={4}>
            <CardMedia
              component='img'
              image={props.image.url}
              alt='Image for house'
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box>
              <Rating
                value={reviewAverageScore}
                precision={0.1}
                readOnly
              />
              <Typography>口コミ {props.reviews.length}件</Typography>
            </Box>
          </Grid>
          { currentUser ? (
            <Grid item xs={6} sm={4} md={3}>
              <FlexBox sx={{ flexDirection: 'column' }}>
                <Button
                  variant="contained"
                  startIcon={<PostAddIcon/>}
                  onClick={handleReviewOpen}
                  sx = {{ my:1 }}
                >
                  投稿
                </Button>
                {
                  props.isBookmarked ? (
                    <UnbookmarkButton onClick={props.bookmark}/>
                  ) : ( 
                    <BookmarkButton onClick={props.bookmark}/>
                  )
                }
                <Button
                  variant="contained"
                  startIcon={<EditIcon/>}
                  onClick={props.editHouse}
                  sx = {{ my:1 }}
                >
                  編集
                </Button>
              </FlexBox>
            </Grid>
            ) : (null)
          }
        </Grid>
        <LocalizationProvider
           dateAdapter={AdapterDateFns}
           locale={ja}
           dateFormats={{ monthAndYear: 'yyyy年MM月' }}
          >
          <Modal
            open={reviewFormOpen}
            onClose={handleReviewClose}
          >
            <Box sx={styles.modalbox}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {props.name}
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name='content'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      multiline
                      rows={7}
                      placeholder='口コミを入力してください(最大10000字)'
                      error={"content" in errors}
                      helperText={errors.content?.message}
                    />
                  )}
                />
                <Controller
                  name='tags'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder='タグ'
                      error={"tags" in errors}
                      helperText='複数タグを紐付けたい場合は、半角スペースで区切ってください'
                      sx={{ my:1 }}
                    />
                  )}
                />
                <ImageUpload
                  name='photos'
                  images={images}
                  setImages={setImages}
                />
                <FlexBox>
                  <Typography>評価</Typography>
                  <Controller
                    name='evaluation'
                    control={control}
                    render={(props) => (
                      <Rating
                        onChange={props.field.onChange}
                        value={Number(props.field.value)}
                        name='rating'
                        precision={0.5}
                      />
                    )}
                  />
                </FlexBox>
                <FlexBox sx={styles.datebox}>
                  <Typography>訪問日</Typography>
                  <Controller
                    name='date'
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        disableFuture
                        inputFormat='yyyy年MM月dd日'
                        mask='____年__月__日'
                        toolbarTitle="日付を選択"
                        toolbarFormat="yyyy年MM月dd日"
                        cancelText="キャンセル"
                        okText="選択"
                        renderInput={(params) => <TextField {...params} />}
                        DialogProps={{ sx: styles.mobiledialogprops }}
                      />
                    )}
                  />
                </FlexBox>
                <Controller
                  name='houseId'
                  control={control}
                  defaultValue={props.id}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx= {{ display: 'none' } }
                    >
                    </TextField>
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  // startIcon={<UpdateIcon />}
                  sx = {{ m:2 }}
                  >
                  投稿
                </Button>
              </form>
            </Box>
          </Modal>
        </LocalizationProvider>
        <Tabs
          value={tab}
          onChange={tabChange}
          variant='fullWidth'
        >
          <HouseTab label='基本情報'></HouseTab>
          <HouseTab label='写真'></HouseTab>
          <HouseTab label='口コミ'></HouseTab>
          <HouseTab label='地図・アクセス'></HouseTab>
        </Tabs>
        <TabPanel value={tab} index={0}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {
                  houseDatas.map((data) => (
                    <TableRow
                      key={data.index}
                      sx={{
                        '&:last-child td, &:last-child th': {
                          border: '1'
                        }
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: '25%',
                          borderRight: '1px solid #eee'
                        }}
                      >
                        {data.index}
                      </TableCell>
                      <TableCell align="left" sx={{ width: '75%' }}>
                        {data.content}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {
            houseImages.length > 0 ? (
              <ImageList cols={3} rowHeight={164}>
                {
                  houseImages.map((image) => (
                    <ImageListItem key={image.id}>
                      <img
                        src={image.image.url}
                        alt={`あなたの画像`}
                      />
                    </ImageListItem>
                  ))
                }
              </ImageList>
            ) : (
              <p>写真はまだありません</p>
            )
          }
        </TabPanel>
        <TabPanel value={tab} index={2}>
          {
            reviews.length > 0 ? (
              reviews.map((review: ReviewData) => (
                <Box key={review.id}>
                  <ReviewSimple
                    id={review.id}
                    content={review.content}
                    date={review.date}
                    user={review.user}
                    house={review.house}
                    evaluation={review.evaluation}
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
        <TabPanel value={tab} index={3}>
          <GoogleMapComponent
            latitude={props.latitude}
            longitude={props.longitude}
          />
        </TabPanel>
      </Card>
    </>
  )
}

export default HouseDetail