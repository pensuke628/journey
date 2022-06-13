import React, {useState, useEffect, useContext} from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SendIcon from '@mui/icons-material/Send';

import { Message, Notification, UserData } from 'interfaces/index'
import { getMessageRoom } from 'lib/api/message_rooms';
import { createMessage } from 'lib/api/messages';
import { createNotification } from 'lib/api/notification';

import { AuthContext } from 'App';

const styles = {
  box: {
    padding: '1rem'
  },
  myMessage: {
    backgroundColor: '#30e852',
    borderRadius: '20px 0px 20px 20px'
  },
  otherMessage: {
    backgroundColor: '#d3d3d3',
    borderRadius: '0px 20px 20px 20px'
  },
};

const UserMessageRoom: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [otherUser, setOtherUser] = useState<UserData>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>('');

  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  // console.log(params.id);

  const handleGetMessageRoom = async() => {
    try {
      const res = await getMessageRoom(id);
      console.log(res);
      if (res.status === 200) {
        setOtherUser(res?.data.otherUser);
        setMessages(res?.data.messages);
      } else {
        console.log('相手が存在しません')
      }
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetMessageRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, []);

  const handleSubmit = async() => {
    const data: Message= {
      messageRoomId: id,
      userId: currentUser?.id,
      content: content,
      toUserOpentime: null
    }

    try {
      const res = await createMessage(data);
      console.log(res);

      if (res.status === 200) {
        setMessages([...messages, res.data.message]);
        setContent('');
        const notificationParams: Notification = {
          senderId: currentUser?.id,
          receiverId: res.data.other.userId,
          reviewId: undefined,
          commentId: undefined,
          messageId: res.data.message.id,
          act: 'message',
          checked: undefined,
          createdAt: undefined,
          updatedAt: undefined
        };
        const notification = await createNotification(notificationParams);
        if (notification.status === 200) {
          console.log('メッセージ通知を作成しました');
        } else {
          console.log('通知作成に失敗しました');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const ChangeToDateTime = (data: string) => {
    const date = new Date(Date.parse(data));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return year + "年" + month + "月" + day + "日" + hour + "時" + minute + "分";
  }

  return (
    <Container>
      <h1>検索BOX</h1>
      {/* <div style={{ maxWidth: 360 }}> */}
      <div>
        <Grid container justifyContent='center'>
          <Grid item>
            <Avatar
              alt='avatar'
              // src={otherUser?.avatar || ''}
            />
            <Typography
              variant='body2'
              component='p'
              gutterBottom
              sx={{
                marginTop: '0.5rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}
            >
              {otherUser?.name}
            </Typography>
          </Grid>
        </Grid>
        {
          messages?.map((message: Message, index: number) => {
            return (
              <Grid key={index} container justifyContent={message.userId === otherUser?.id ? "flex-start" : "flex-end"}>
                <Grid item>
                  <Box
                    borderRadius={message.userId === otherUser?.id ? styles.otherMessage.borderRadius : styles.myMessage.borderRadius}
                    bgcolor={message.userId === otherUser?.id ? styles.otherMessage.backgroundColor : styles.myMessage.backgroundColor}
                    color={'#000000'}
                    m={1}
                    border={0}
                    style={styles.box}
                  >
                    <Typography variant="body1" component="p">
                      {message.content}
                    </Typography>
                    { message.reviewId ? ( 
                      <Typography
                        component={RouterLink}
                        to={`/reviews/${message.reviewId}`}
                      >
                        該当の口コミ
                      </Typography>
                      ) : (null)
                    }
                  </Box>
                    <Typography
                      variant="body2"
                      component="p"
                      color="textSecondary"
                      style={{ textAlign: message.userId === otherUser?.id ? 'left' : 'right' }}
                    >
                      {ChangeToDateTime(message.createdAt?.toString() || '100000000')}
                    </Typography>
                  </Grid>
                </Grid>
              )
              })
            }
            <Grid container justifyContent="center" style={{ marginTop: "2rem" }}>
              <form noValidate autoComplete="off">
                <TextField
                  required
                  multiline
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                  // className={classes.textInputWrapper}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!content ? true : false}
                  onClick={handleSubmit}
                  // className={classes.button}
                >
                  <SendIcon />
                </Button>
              </form>
            </Grid>
      </div>
    </Container>
  );
}

export default UserMessageRoom;