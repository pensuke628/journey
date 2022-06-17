import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// MUIのimport
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// MUIIconsのimport
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import CottageIcon from '@mui/icons-material/Cottage';

// ReactHooksFormのimport
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// interfaceのimport
import { HouseData } from 'interfaces/index';

// apiを叩く関数のimport
import { createHouse } from 'lib/api/house';

// バリデーションルールのimport
import { houseSchema } from 'schema/house';

const ImageBox = styled(Box) ({
  width: '90%',
  border: '1px solid #ccc',
  borderRadius: '10px',
  margin: '1rem auto',
  display: 'flex',
  justifyContent: 'center',
});

const Input = styled('input') ({
  display: 'none',
});

const HouseNew: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<HouseData>({
    resolver: yupResolver(houseSchema)
  });

  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<File>();
  const [isFileTypeError, setIsFileTypeError] = useState(false);

  const createFormData = (data: HouseData) => {
    const { name,
            postalCode,
            prefectures,
            municipalities,
            profile,
            phoneNumber,
            email,
            relatedWebsite,
            price,
            period,
            checkInTime,
            checkOutTime,
            capacity,
            parking,
            bath,
            shopping,
            note,
            tags
          } = data;
    const formData = new FormData();

    formData.append('name', name || '');
    formData.append('postalCode', postalCode || '');
    formData.append('prefectures', prefectures || '');
    formData.append('municipalities', municipalities || '');
    formData.append('profile', profile || '');
    formData.append('phoneNumber', phoneNumber || '');
    formData.append('email', email || '');
    formData.append('relatedWebsite', relatedWebsite || '');
    formData.append('price', price || '');
    formData.append('period', period || '');
    formData.append('checkInTime', checkInTime || '');
    formData.append('checkOutTime', checkOutTime || '');
    formData.append('capacity', capacity || '');
    formData.append('parking', parking || '');
    formData.append('bath', bath || '');
    formData.append('shopping', shopping || '');
    formData.append('note', note || '');
    if (previewImage) {
      formData.append('image', previewImage);
    }
    if (tags) {
      const setTag = tags.toString().replace(/,/g," ")
      formData.append('tags', setTag);
    }
    return formData
  }

  const handleCreateHouse = async(data: HouseData) => {
    const formData =  createFormData(data);
    try {
      const res = await createHouse(formData);
      // console.log(res);
      if (res.status === 200) {
        navigate('/houses', { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0]

    // アップロードする画像の拡張子を確認する
    if (![
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/svg+xml',
    ].includes(file.type)) {
      setIsFileTypeError(true);
      return false;
    }

    setPreviewImage(file);
  };

  const handleCancel = () => {
    setPreviewImage(undefined);
  };

  return (
    <form onSubmit={handleSubmit(handleCreateHouse)}>
      <Container>
        <Box
          sx = {{
            '& .MuiTextField-root': { m: 1, width: '90%' },
            display: "flex-column",
            textAlign: "center"
          }}
        >
          <Typography
            variant="h3"
            sx = {{ mt:2 }}
          >
            施設の新規登録
          </Typography>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label='施設名'
                error={'name' in errors}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name='postalCode'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type='number'
                label='郵便番号'
                error={'postalCode' in errors}
                helperText={errors.postalCode?.message}
              />
            )}
          />
          <Controller
            name='prefectures'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label='都道府県名'
                error={'prefectures' in errors}
                helperText={errors.prefectures?.message}
              />
            )}
          />
          <Controller
            name='municipalities'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='都道府県以降の住所'
              />
            )}
          />
          <Controller
            name='profile'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='ひとこと'
              />
            )}
          />
          <Controller
            name='phoneNumber'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='電話番号'
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='連絡先メールアドレス'
              />
            )}
          />
          <Controller
            name='relatedWebsite'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='関連サイト'
              />
            )}
          />
          <Controller
            name='price'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='料金'
              />
            )}
          />
          <Controller
            name='period'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='期間'
              />
            )}
          />
          <Controller
            name='checkInTime'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='チェックイン時刻'
              />
            )}
          />
          <Controller
            name='checkOutTime'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='チェックアウト時刻'
              />
            )}
          />
          <Controller
            name='capacity'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='収容人数'
              />
            )}
          />
          <Controller
            name='parking'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='駐車場'
              />
            )}
          />
          <Controller
            name='bath'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='風呂'
              />
            )}
          />
          <Controller
            name='shopping'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='買い物'
              />
            )}
          />
          <Controller
            name='note'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='備考'
              />
            )}
          />
          <Controller
            name='tags'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='タグ'
              />
            )}
          />
          <ImageBox>
            <ImageList cols={2} rowHeight={220} sx={{ p:1 }}>
            {
            previewImage ? (
              <ImageListItem>
                <ImageListItemBar
                  sx={{
                    background: 'rgba(0,0,0,0)',
                  }}
                  position='top'
                  actionIcon={
                    <IconButton
                      onClick={() => handleCancel()}
                    >
                      <ClearIcon/>              
                    </IconButton>
                  }
                  />
                <img
                  src={URL.createObjectURL(previewImage)}
                  alt={`施設イメージ画像`}
                />
                <ImageListItemBar
                  title='設定する画像'
                  position='below'
                />
              </ImageListItem>
            ) : (
              <p>画像は設定されていません</p>
            )
          }
            </ImageList>
            {
              isFileTypeError && (
                <p>※jpeg, png, bmp, gif, svg以外のファイル形式は表示されません</p>
              )
            }
          </ImageBox>
          <Controller
            name='image'
            control={control}
            render={({ field }) => (
              <Box
                {...field}
              >
                <label htmlFor='file-upload-button'>
                  <Input accept="image/*" id='file-upload-button' multiple type='file' onChange={handleFile}/>
                  <Button variant='contained' component='span'>
                    施設画像を追加する
                  </Button>
                </label>
              </Box>
            )}
          />
        <Button
          component={RouterLink}
          to='/houses'
          variant='contained'
          startIcon={<ArrowBackIcon />}
          sx = {{ m:2 }}
        >
          一覧に戻る
        </Button>
        <Button
          variant='contained'
          startIcon={<CottageIcon />}
          // handleSubmitは、フォームへの入力を検証した上で、onSubmitを呼び出す
          onClick={handleSubmit(handleCreateHouse)}
          sx = {{ m:2 }}
        >
          新規登録
        </Button>
      </Box>
    </Container>
    </form>
  );
}

export default HouseNew;