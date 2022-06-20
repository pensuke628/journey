import React, {useState, useContext} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { string } from 'yup';


const CustomButtonGroup = styled(Box) ({
  display: 'flex',
  justifyContent: 'center',
})

const CustomCard = styled(Card) ({
  flexGrow: 1,
  margin: '4rem 1rem',
  maxWidth: 650,
});

const CustomCardHeader = styled(CardHeader) ({
  textAlign: 'center',
  backgroundColor: 'lightblue',
});

const CustomTextField = styled(TextField) ({
  margin: '1rem 0'
})

const FlexBox = styled(Box) ({
  display: 'flex',
  flexDirection: 'column',
  margin: '1rem'
});

interface Params {
  name: string,
  email: string,
  message: string
}

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<Params>({
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
      {/* <form onSubmit={handleSubmit(registrationCreate)}> */}
      <form>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CustomCard>
              <CustomCardHeader title='お問い合わせ'/>
              <CardContent>
                <FlexBox>
                  <Controller
                    name='name'
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <CustomTextField
                        {...field}
                        required
                        label='お名前'
                        error={'name' in errors}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                  <Controller
                    name='email'
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <CustomTextField
                        {...field}
                        required
                        label='メールアドレス'
                        error={'email' in errors}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                  <Controller
                    name='message'
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <CustomTextField
                        {...field}
                        required
                        multiline
                        maxRows={4}
                        label='メッセージ'
                        error={'message' in errors}
                        helperText={errors.message?.message}
                      />
                    )}
                  />
                </FlexBox>
                <CustomButtonGroup>
                  <Button
                    component={RouterLink}
                    to='/'
                    variant='contained'
                    sx = {{ m: 2 }}
                  >
                    戻る
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    sx = {{ m: 2 }}
                  >
                    確認
                  </Button>
                </CustomButtonGroup>
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
            </Box>
        </Container>
      </form>
    </>
  );
}

export default Contact