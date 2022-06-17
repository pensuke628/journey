import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
import UpdateIcon from '@mui/icons-material/Update';

// ReactHooksFormのimport
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// interfaceのimport
import { HouseData, Tag } from 'interfaces/index';

// apiを叩く関数のimport
import { updateHouse } from 'lib/api/house';

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

const HouseEdit: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<HouseData>({
    resolver: yupResolver(houseSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [house] = useState<HouseData>(location.state as HouseData);
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

    formData.append('name', name);
    formData.append('postalCode', postalCode);
    formData.append('prefectures', prefectures);
    formData.append('municipalities', municipalities);
    formData.append('profile', profile);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    formData.append('relatedWebsite', relatedWebsite);
    formData.append('price', price);
    formData.append('period', period);
    formData.append('checkInTime', checkInTime);
    formData.append('checkOutTime', checkOutTime);
    formData.append('capacity', capacity);
    formData.append('parking', parking);
    formData.append('bath', bath);
    formData.append('shopping', shopping);
    formData.append('note', note);
    if (previewImage) {
      formData.append('image', previewImage);
    }
    if (tags) {
      const setTag = tags.toString().replace(/,/g," ")
      formData.append('tags', setTag);
    }
    // tags: Tag[] | undefined
    // console.log(...formData.entries());
    return formData
  }

  const handleUpdateHouse = async(data: HouseData) => {
    const id = house.id.toString();
    const formData =  createFormData(data);
    try {
      // console.log(...formData.entries());
      const res = await updateHouse(id, formData);
      if (res.status === 200) {
        navigate(`/houses/${id}`, { replace: true })
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

  const returnTags = (taglist: Tag[] |  undefined) => {
    if (taglist) {
      const tagNames = taglist.map(tag => tag.name);
      // 配列要素をstringで展開し、,を除いたものを返す
      const tags: string = tagNames.toString().replace(/,/g," ");
      return tags
    }
  };

  return (
    <form onSubmit={handleSubmit(handleUpdateHouse)}>
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
            施設情報を更新する
          </Typography>
          <Controller
            name='name'
            control={control}
            defaultValue={ house.name }
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
            defaultValue={ house.postalCode || ''}
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
            defaultValue={ house.prefectures }
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
            defaultValue={ house.municipalities || "" }
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
            defaultValue={ house.profile || '' }
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
            defaultValue={ house.phoneNumber || '' }
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
            defaultValue={ house.email || '' }
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
            defaultValue={ house.relatedWebsite || '' }
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
            defaultValue={ house.price || ''}
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
            defaultValue={ house.period || '' }
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
            defaultValue={ house.checkInTime || '' }
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
            defaultValue={ house.checkOutTime || '' }
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
            defaultValue={ house.capacity || '' }
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
            defaultValue={ house.parking || '' }
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
            defaultValue={ house.bath || '' }
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
            defaultValue={ house.shopping || '' }
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
            defaultValue={ house.note || '' }
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
            // defaultValue={ house.tags }
            render={({ field }) => (
              <TextField
                {...field}
                label='タグ'
                defaultValue={returnTags(house.tags)}
              />
            )}
          />
          <ImageBox>
            <ImageList cols={2} rowHeight={220} sx={{ p:1 }}>
              { house.image.url ? (                
                  <ImageListItem>
                    <img
                      src={house.image.url}
                      alt='施設のイメージ画像'
                    />
                    <ImageListItemBar
                      title='更新前'
                      position='below'
                    />
                  </ImageListItem>
                ) : ( <p>画像は設定されていません</p> )
              }
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
                  alt={`あなたの写真`}
                />
                <ImageListItemBar
                  title='更新後'
                  position='below'
                />
              </ImageListItem>
            ) : (
              <p>写真は変更しません</p>
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
                    写真追加
                  </Button>
                </label>
              </Box>
            )}
          />
          <Button
            component={Link}
            to='/houses'
            variant='contained'
            startIcon={<ArrowBackIcon />}
            sx = {{ m:2 }}
          >
            一覧に戻る
          </Button>
          <Button
            type='submit'
            variant='contained'
            startIcon={<UpdateIcon />}
            // handleSubmitは、フォームへの入力を検証した上で、onSubmitを呼び出す
            sx = {{ m:2 }}
          >
            情報を更新する
          </Button>
        </Box>
      </Container>
    </form>
  );
}

export default HouseEdit;