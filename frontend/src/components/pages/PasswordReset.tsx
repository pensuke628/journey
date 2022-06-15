import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// MUIのimport
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

// MUIIconsのimport
import LockIcon from '@mui/icons-material/Lock';

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
import { Typography } from '@mui/material';

const CustomCard = styled(Card)({
  flexGrow: 1,
  margin: '4rem 1rem',
  maxWidth: 650,
});

const CustomCardHeader = styled(CardHeader)({
  textAlign: 'center',
  backgroundColor: 'lightblue',
});

const FlexBox = styled(Box) ({
  display: 'flex',
  margin: '1rem'
});

const PasswordReset: React.FC = () => {
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
            <FlexBox
              sx= {{
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <CustomCard>
                <CustomCardHeader title='パスワードの再設定'/>
                <CardContent>
                  <Box
                    sx={{
                      textAlign: 'left'
                    }}
                  >
                    <Typography>
                      ログインパスワードの再設定を行います。
                    </Typography>
                    <Typography>
                      以下の項目を入力し、「確認メールを送信する」ボタンをクリックしてください。
                    </Typography>
                  </Box>
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
                  <Button
                    type='submit'
                    variant='contained'
                    sx = {{ mt: 3 }}
                  >
                    確認メールを送信する
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

export default PasswordReset