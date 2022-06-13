import React, {useState, useEffect} from 'react';
import { NavLink as RouterLink} from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { MessageRoom } from 'interfaces/index'
import { getMessageRooms } from 'lib/api/message_rooms';

const styles = {
  link : {
    textDecoration: 'none',
    color: '#333333',
  },
};


const UserMessageRooms: React.FC = () => {
  const [messageRooms, setMessageRooms] = useState<MessageRoom[]>([])

  const handleGetMessageRooms = async() => {
    try {
      const res = await getMessageRooms();
      if (res.status === 200) {
        setMessageRooms(res.data.messageRooms);
        // console.log(res.data.messageRooms);
      } else {
        console.log('メッセージルームがありません')
      }

    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetMessageRooms();
  }, []);

  const getOfBeforeDays = (data: string) => {
    const date = new Date(Date.parse(data));
    const today = new Date();
    const diff = Math.floor((today.getTime() - date.getTime())/86400000);
    let string: string = '' 
    if (isNaN(diff)) {
      return
    } else if (diff === 0) {
      string = '今日'
    } else if (diff === 1) {
      string = '昨日'
    } else if (diff === 2) {
      string = '一昨日'
    } else {
      string = `${diff}日前`
    }
    return string;
  }

  return (
    <Container>
      <h1>メッセージ一覧</h1>
      <h1>検索BOX</h1>
      { messageRooms.length > 0 ? (
          messageRooms.map((messageRoom: MessageRoom, index: number) => {
            return (
              <List key={index} sx={{ width: '100%' }}>
                <RouterLink
                  to={`/messageroom/${messageRoom.messageRoom.id}`}
                  style={styles.link}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt='avatar'/>
                      {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
                    </ListItemAvatar>
                    <ListItemText
                      primary={messageRoom.otherUser.name}
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component='span'
                          variant='body2'
                          color="textSecondary"
                        >
                          {messageRoom.lastMessage === null ? 'まだメッセージはありません' : messageRoom.lastMessage.content.length > 30 ? messageRoom.lastMessage.content.substr(0, 30) + "..." : messageRoom.lastMessage.content}
                        </Typography>
                      }
                    />
                    <Typography>
                      {getOfBeforeDays(messageRoom.lastMessage?.updatedAt?.toString() || '')}
                    </Typography>
                  </ListItem>
                <Divider variant="inset" component="li" />
                </RouterLink>
              </List>
            )})
         ) : (
          <h1>メッセージはまだありません</h1>
        )
      }
    </Container>
  );
}

export default UserMessageRooms;