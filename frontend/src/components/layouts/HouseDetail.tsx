import React, { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ja from 'date-fns/locale/ja'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';

import UnbookmarkButton from 'components/utils/UnbookmarkButton';
import BookmarkButton from 'components/utils/BookmarkButton';

// ReactHooksFormのimport
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Notification, ReviewParams, ReviewData, Tag } from 'interfaces/index';
import { ReviewSchema } from 'schema/review';
import { followerNotification } from 'lib/api/notification';
import { createReview } from 'lib/api/review';
import { uploadImage } from 'lib/api/image'

import ReviewSimple  from 'components/layouts/ReviewSimple'
import ImageUpload from 'components/layouts/ImageUpload';

type Props = {
  id: number
  name: string
  postal_code: string
  prefectures: string
  municipalities: string
  image: string
  profile: string
  phone_number: string
  email: string
  related_website: string
  price: string
  period: string
  check_in_time: string
  check_out_time: string
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

const UserTab = styled(Tab) ({
  minWidth: '60px'
});

function createData(
  calories: string,
  content: string
) {
  return { calories, content };
}


const HouseDetail: React.FC<Props> = (props) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewParams>({
    // defaultValues: { evaluation: 2.5 },
    resolver: yupResolver(ReviewSchema),
  });

  // const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [tab, setTab] = useState(0);
  // const [date, setDate] = useState<Date | null>(new Date());

  const tabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleReviewOpen = () => {
    setReviewFormOpen(true);
  };

  const handleReviewClose = () => {
    setReviewFormOpen(false);
  };

  const handleUploadImages = async() => {
    const formData = new FormData();
    images.map((image) => {
      formData.append('images[]', image);
    })
    
    const test = await uploadImage(formData);


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
          // console.log(images[0]);
          const try1 = await uploadImage(formData);
          // console.log(try1);
          if (images.length >= 2 ) {
            formData.append('image', images[1]);
            // console.log(images[1]);
            const try2 = await uploadImage(formData);
            // console.log(try2);
            if (images.length >= 3) {
              formData.append('image', images[2]);
              // console.log(images[2]);
              const try3 = await uploadImage(formData);
              // console.log(try3);
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

  useEffect(() => {
    setReviews(props.reviews);
    setTags(props.tags);
  },[props.reviews]);

  const address: string = `${props.prefectures}`.concat(`${props.municipalities}`);

  const datas = [
    createData('場所', `${address}`),
    createData('電話番号', `${props.phone_number}`),
    createData('Eメール', `${props.email}`),
    createData('関連サイト', `${props.related_website}`),
    createData('料金', `${props.price}`),
    createData('期間', `${props.period}`),
    createData('チェックイン時刻', `${props.check_in_time}`),
    createData('チェックアウト時刻', `${props.check_out_time}`),
    createData('収容人数', `${props.capacity}`),
    createData('駐車場', `${props.parking}`),
    createData('風呂', `${props.bath}`),
    createData('買い物', `${props.shopping}`),
    createData('備考', `${props.note}`),
  ]


  return (
    <>
      <Card>
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
              <Typography key={tag.id}>
                { tag.name }
              </Typography>
            )
          })
        }
        </Box>
        <Grid
          container
          spacing={1}
          justifyContent='space-evenly'
        >
          <Grid item xs={12} sm={4}>
            <CardMedia
              component='img'
              image={props.image}
              alt='Image for house'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box>
              <Typography>★★★☆☆</Typography>
              <Typography>口コミ100件</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2}>
            <FlexBox sx={{ flexDirection: 'column' }}>
              <Button
                // component={Link}
                // to="/houses/new"
                variant="contained"
                startIcon={<PostAddIcon/>}
                onClick={handleReviewOpen}
                sx = {{ my:1 }}
                >投稿</Button>
              {
                props.isBookmarked ? (
                  <UnbookmarkButton
                    onClick={props.bookmark}
                  />
                ) : ( 
                  <BookmarkButton
                    onClick={props.bookmark}
                  />
                )
              }
              <Button
              // component={Link}
              // to="/houses/new"
              variant="contained"
              startIcon={<EditIcon/>}
                onClick={props.editHouse}
                sx = {{ my:1 }}
                >編集</Button>
            </FlexBox>
          </Grid>
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
                      placeholder='口コミを入力してください(最大〇〇字)'
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
                    // consoleにwarningが出る。後日修正する。
                    name='evaluation'
                    control={control}
                    render={({ field }) => (
                      <Rating
                        {...field}
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
          <UserTab label='基本情報'></UserTab>
          <UserTab label='写真'></UserTab>
          <UserTab label='口コミ'></UserTab>
          <UserTab label='地図・アクセス'></UserTab>
        </Tabs>
        <TabPanel value={tab} index={0}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {datas.map((data) => (
                  <TableRow
                    key={data.calories}
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
                      {data.calories}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '75%' }}>
                      {data.content}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tab} index={1}>tab2</TabPanel>
        <TabPanel value={tab} index={2}>
          {
            reviews ? (
              reviews.map((review: ReviewData) => (
                <Box key={review.id}>
                  <ReviewSimple
                    id={review.id}
                    content={review.content}
                    date={review.date}
                    userId={review.userId}
                    evaluation={review.evaluation}
                    tags={review.tags}
                  />
                </Box>
              ))
            ) : (
              <p>まだ口コミはありません</p>
            )
          }
        </TabPanel>
        <TabPanel value={tab} index={3}>tab4</TabPanel>
      </Card>
    </>
  )
}

export default HouseDetail