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
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import UpdateIcon from '@mui/icons-material/Update';

// ReactHooksFormのimport
import { useForm, Controller } from 'react-hook-form';

// interfaceのimport
import { UserData, UserUpdateParams } from 'interfaces';

// apiを叩く関数のimport
import { updateUser } from 'lib/api/user';
import { Avatar } from '@mui/material';

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

const UserEdit: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<UserUpdateParams>({});

  const navigate = useNavigate();
  const location = useLocation();
  const [ user ] = useState<UserUpdateParams>(location.state as UserUpdateParams);
  const [previewAvatar, setPreviewAvatar] = useState<File>();
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState<File>();

  const createFormData = (data: UserUpdateParams) => {
    const { name,
            email,
            profile,
          } = data;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('profile', profile);
    if (previewAvatar) {
      formData.append('avatar', previewAvatar);
    }
    if (previewBackgroundImage) {
      formData.append('backgroundImage', previewBackgroundImage);
    }
    return formData
  }

  const handleUpdateUser = async(data: UserUpdateParams) => {
    const id = user.id.toString();
    const formData = createFormData(data);
    try {
      const res = await updateUser(id, formData);
      if (res.status === 200) {
        navigate(`/users/${id}`, { replace: true })
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      return false;
    }

    setPreviewAvatar(file);
  };

  const handleBackgroundImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      return false;
    }

    setPreviewBackgroundImage(file);
  };

  const handleAvatarCancel = () => {
    setPreviewAvatar(undefined);
  };

  const handleBackgroundImageCancel = () => {
    setPreviewBackgroundImage(undefined);
  };

  return (
    <form onSubmit={handleSubmit(handleUpdateUser)}>
      <Container>
        <Box
          sx = {{
            '& .MuiTextField-root': { m: 1, width: '90%' },
            display: "flex-column",
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx = {{ mt:2 }}
          >
            ユーザー情報を更新する
          </Typography>
          {
            previewAvatar ? (
              <ImageListItem>
                <ImageListItemBar
                  sx={{
                    background: 'rgba(0,0,0,0)',
                  }}
                  position='top'
                  actionIcon={
                    <IconButton
                      onClick={() => handleAvatarCancel()}
                    >
                      <ClearIcon/>              
                    </IconButton>
                  }
                />
                <Avatar
                  src={URL.createObjectURL(previewAvatar)}
                  alt={`あなたのアバター`}
                  sx={{
                    border: '1px solid #ccc',
                    width: 56,
                    height: 56
                  }}
                />
                {/* <img
                  src={URL.createObjectURL(previewAvatar)}
                  alt={`あなたのアバター`}
                /> */}
              </ImageListItem>
            ) : (
              <Avatar
                src={user.avatar.url}
                alt='アバター'
                sx={{
                  margin: '0 auto',
                  border: '1px solid #ccc',
                  width: 56,
                  height: 56,
                }}
              />
            )
          }
              <Box>
                <Controller
                  name='backgroundImage'
                  control={control}
                  render={({ field }) => (
                    <Box
                      {...field}
                    >
                      <label htmlFor='avatar-upload-button'>
                        <Input accept='image/*' id='avatar-upload-button' multiple type='file' onChange={handleAvatarFile}/>
                        <Button
                          component='span'
                          color='inherit'
                        >
                          変更
                        </Button>
                      </label>
                    </Box>
                  )}
                />
          </Box>
          <Controller
            name='name'
            control={control}
            defaultValue={ user.name }
            render={({ field }) => (
              <TextField
                {...field}
                required
                label='ユーザー名'
                error={'name' in errors}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            defaultValue={ user.email }
            render={({ field }) => (
              <TextField
                {...field}
                required
                label='Eメール'
                error={'email' in errors}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name='profile'
            control={control}
            defaultValue={ user.profile || '' }
            render={({ field }) => (
              <TextField
                {...field}
                label='プロフィール'
                error={'profile' in errors}
                helperText={errors.profile?.message}
              />
            )}
          />
          <ImageBox>
            <ImageList cols={1}>
              {
                (() => {
                  // 更新する場合は画像選択後にプレビュー表示
                  if(previewBackgroundImage) {
                    return(
                      <ImageListItem>
                        <ImageListItemBar
                          sx={{
                            background: 'rgba(0,0,0,0)',
                          }}
                          position='top'
                          actionIcon={
                            <IconButton
                              onClick={() => handleBackgroundImageCancel()}
                            >
                              <ClearIcon/>              
                            </IconButton>
                          }
                        />
                        <img
                          src={URL.createObjectURL(previewBackgroundImage)}
                          alt={`あなたの背景`}
                        />
                        <ImageListItemBar
                          title='更新後'
                          position='below'
                        />
                      </ImageListItem>
                    );
                  } else if (user.backgroundImage) {
                    // 背景設定済みかつ背景を更新しない場合
                    return (
                      <ImageListItem>
                        <img
                          src={user.backgroundImage.url}
                          alt='背景画像'
                        />
                        <ImageListItemBar
                          title='更新前'
                          position='below'
                        />
                      </ImageListItem>
                    );
                  } else {
                    // 背景設定していないかつ更新しない場合
                    return (
                      <p>背景画像は設定されていません</p>
                    );
                  }
                })()
              }
              <Box>
                <Controller
                  name='backgroundImage'
                  control={control}
                  render={({ field }) => (
                    <Box
                      {...field}
                    >
                      <label htmlFor='bgimage-upload-button'>
                        <Input accept="image/*" id='bgimage-upload-button' multiple type='file' onChange={handleBackgroundImageFile}/>
                        <Button
                          variant='contained'
                          component='span'
                        >
                          背景を更新する
                        </Button>
                      </label>
                    </Box>
                  )}
                />
              </Box>
            </ImageList>
          </ImageBox>
          <Button
            type='submit'
            variant='contained'
            color='success'
            startIcon={<UpdateIcon />}
            // handleSubmitは、フォームへの入力を検証した上で、onSubmitを呼び出す
            sx = {{ m:2 }}
          >
            更新
          </Button>
        </Box>
      </Container>
    </form>
  );
}

export default UserEdit;