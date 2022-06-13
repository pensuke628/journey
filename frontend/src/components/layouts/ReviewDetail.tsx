import React from 'react';

import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Typography  from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';

type Props = {
  id: number
  content: string
  date: Date
  evaluation: number | null
  userId: number
}

const FlexBox = styled(Box) ({
  display: 'flex'
});

const ReviewDetail: React.FC<Props> = (props) => {
  const viewDate = (date: Date) => {
    let newdate: Date = new Date(date);
    let year: string = (newdate.getFullYear()).toString();
    let month: string = (1 + newdate.getMonth()).toString();
    return `${year}年${month}月`
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            R
          </Avatar>
        }
        title='ユーザー名を表示させる予定'
        subheader={`${viewDate(props.date)}訪問`}
      />
      <CardContent>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
          }}
        >
          <Rating
            value={props.evaluation}
            readOnly
          />
          <Typography
          >
            {props.content}
          </Typography>
          <CardActions>
            <IconButton><FavoriteIcon/></IconButton>
            <IconButton><MessageIcon/></IconButton>
          </CardActions>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ReviewDetail