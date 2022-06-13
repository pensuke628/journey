import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// MUIのimport
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

// ReactHooksFormのimport
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";

// interfaceのimport
import { SignUpParams } from 'interfaces/index';

// バリデーションルールのimport
import { UserSchema } from "schema/user";

import { AuthContext } from 'App';
import AlertMessage from 'components/utils/AlertMessage';
import { signUp } from 'lib/api/auth';

const CustomCard = styled(Card)({
  flexGrow: 1,
  margin: '2rem 1rem',
  maxWidth: 400,
});

const CustomCardHeader = styled(CardHeader)({
  textAlign: 'center',
  backgroundColor: 'lightblue',
});

const FlexBox = styled(Box) ({
  display: 'flex',
});

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SignUpParams>({
    resolver: yupResolver(UserSchema),
  });

  const {setIsSignedIn, setCurrentUser} = useContext(AuthContext);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessages, setAlertMessages] = useState<string[]>([]);

  const registrationCreate= async(data: SignUpParams) => {
    console.log(data);
    try {
      const res = await signUp(data);
      if (res.status === 200) {
        // アカウントを作成した場合はメール認証をする予定
        // 暫定的にアカウント作成と同時にログインする
        Cookies.set('_access_token', res.headers['access-token']);
        Cookies.set('_client', res.headers['client']);
        Cookies.set('_uid', res.headers['uid']);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        navigate('/');
      } else {
        setAlertMessageOpen(true);
      }
    } catch (error: any) {
      const errors = error.response.data.errors.fullMessages;

      setAlertMessageOpen(true);
      setAlertMessages(errors);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(registrationCreate)}>
        <Container>
          <Box
            sx = {{
              '& .MuiTextField-root': { m: 1, width: '90%' },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              sx = {{ mt:3 }}
            >
              新規登録画面
            </Typography>
            <FlexBox
              sx= {{
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <CustomCard>
                <CustomCardHeader title='新規登録'/>
                <CardContent>
                  <FlexBox>
                    <PersonIcon sx={{ color: 'action.active', my: 'auto' }}/>
                    <Controller
                      name='name'
                      control={control}
                      defaultValue={''}
                      render={({field}) => (
                        <TextField
                        {...field}
                        label='ユーザー名'
                        error={'name' in errors}
                        helperText={errors.name?.message}
                        />
                      )}
                    />
                  </FlexBox>
                  <FlexBox>
                    <EmailIcon sx={{ color: 'action.active', my: 'auto' }}/>
                    <Controller
                      name='email'
                      control={control}
                      defaultValue={''}
                      render={({field}) => (
                        <TextField
                        {...field}
                        label='Email'
                        error={'email' in errors}
                        helperText={errors.email?.message}
                        />
                      )}
                    />
                  </FlexBox>
                  <FlexBox>
                    <LockIcon sx={{ color: 'action.active', my: 'auto' }}/>
                    <Controller
                      name='password'
                      control={control}
                      defaultValue={''}
                      render={({field}) => (
                        <TextField
                        {...field}
                        label='パスワード'
                        type='password'
                        error={'password' in errors}
                        helperText={errors.password?.message}
                        />
                      )}
                    />
                  </FlexBox>
                  <FlexBox>
                    {/* 暫定的な処置 */}
                    <LockIcon sx={{ color: 'white' }}/>
                    <Controller
                      name='passwordConfirmation'
                      control={control}
                      defaultValue={''}
                      render={({field}) => (
                        <TextField
                        {...field}
                        label='パスワード(確認)'
                        type='password'
                        error={'passwordConfirmation' in errors}
                        helperText={errors.passwordConfirmation?.message}
                        sx={{
                          marginLeft: 'auto'
                        }}
                        />
                      )}
                    />
                  </FlexBox>
                  <Button
                    type='submit'
                    variant='contained'
                    sx = {{ mt: 3 }}
                  >
                    新規登録
                  </Button>
                </CardContent>
              </CustomCard>
              { alertMessages.map((alertMessage, index) => {
                  return (
                    <AlertMessage
                    // エラーが発生した場合はアラートを表示
                      key={index}  
                      open={alertMessageOpen}
                      setOpen={setAlertMessageOpen}
                      severity='error'
                      message={alertMessage}
                    />
                  );
                }) }
            </FlexBox>
          </Box>
        </Container>
      </form>
    </>
  );
}

export default SignIn