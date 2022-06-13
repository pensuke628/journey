import React, {useState, useEffect, useContext} from 'react';
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

import UnbookmarkButton from 'components/utils/UnbookmarkButton';
import BookmarkButton from 'components/utils/BookmarkButton';
import { BookmarkContext } from 'App';

import {HouseData} from 'interfaces/index'

type Props = {
  id: number,
  name: string,
  prefectures: string,
  image: string,
  bookmark: () => void,
  unbookmark: () => void,
}

const House: React.FC<Props> = (props) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const {bookmarkingHouses} = useContext(BookmarkContext);
  
  const checkBookmark = () => {
    if (bookmarkingHouses.some((data: HouseData) => data.id === props.id)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }

  useEffect(() => {
    checkBookmark();
  }, [bookmarkingHouses])

  return (
    <Card
      sx={{
        m: 1,
        height: 150,
        display: "flex",
        border: "1px solid #000"
      }}
    >
      <CardMedia
        component="img"
        image={props.image}
        alt="Image for house"
        sx={{ flex: "1 1 25%" }}
      />
      <CardContent
        sx={{ flex: "2 2 50%" }}
      >
        <Typography>
          <Link
            to ={`/houses/${props.id}`}
          >
            {props.name}
          </Link>
        </Typography>
        <Typography>
          エリア: {props.prefectures}
        </Typography>
        <Typography>
          タグ:
        </Typography>
      </CardContent>
      <CardActions
        sx={{ flex: "1 1 25%" }}
      >
        {
          isBookmarked ? (
            <UnbookmarkButton
              onClick={props.unbookmark}
            />
          ) : ( 
            <BookmarkButton
              onClick={props.bookmark}
            />
           )
        }
      </CardActions>
    </Card>
  )
}

export default House