import { AuthContext } from 'App';
import { useState, useEffect, useContext, useRef } from 'react';
import { Typography } from '@mui/material';
import ActionCable from 'actioncable';

import { Notification } from 'interfaces/index'

// 追加したActionCableをrequireする
// let ActionCable = null as any
// if (typeof window !== 'undefined') {
//   ActionCable = require('actioncable');
// }

const ActionCableConnection = () => {
  const channelRef = useRef<any>(null);
  const cableRef = useRef<any>(null);
  const [message, setMessage] = useState<Notification[]>([]);
  const [test, setTest] = useState<string>('');
  const {currentUser} = useContext(AuthContext);

  useEffect(()=> {
    const initWebSockt = async() => {
      const webSocketEndpoint = 'ws://localhost:3010/cable';
      cableRef.current = ActionCable.createConsumer(webSocketEndpoint);

      channelRef.current = cableRef.current.subscriptions.create(
        { channel: 'NotificationChannel', user_id: '1' },
        { connected: () => {
            console.log('Connection Success');
          },
          received: (data: any) => {
            console.log('received');
            console.log(data.message);
            setMessage(data.message);
            // setTest(data.message);
          },
          // broadcastMessage: (userId: string) => {
          //   return channelRef.current?.perform('broadcast_messages', {user_id: userId});
          // },
        }
      );
      // channelRef.current?.perform('broadcast_messages', {user_id: 1});
    }

    initWebSockt();
    // channelRef.current.broadcastMessage(currentUser?.id);
    console.log(channelRef.current);
    console.log(cableRef.current);

    return () => {
      channelRef.current.unsubscribe();
      cableRef.current.disconnect();
    }
  }, []);

  return (
    <>
      {
      message.map((message, index) => {
        return(
          <Typography key={index}>
            { message.act }
          </Typography>
        );
      })
      }
      {/* {test} */}
    </>
  );
}

export default ActionCableConnection