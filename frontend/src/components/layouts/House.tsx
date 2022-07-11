import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// MUIのimport
import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

import CustomTag from 'components/utils/Tag'

// componentのimport
import UnbookmarkButton from 'components/utils/UnbookmarkButton';
import BookmarkButton from 'components/utils/BookmarkButton';

import { AuthContext, BookmarkContext } from 'App';

import {HouseData, Tag} from 'interfaces/index'

type Props = {
  id: number,
  name: string,
  prefectures: string,
  image: string,
  bookmark: () => void,
  unbookmark: () => void,
  tags: Tag[] | undefined,
  setState?: Function
}

const House: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const { currentUser } = useContext(AuthContext);
  const {bookmarkingHouses} = useContext(BookmarkContext);
  
  const checkBookmark = () => {
    if (bookmarkingHouses.some((data: HouseData) => data.id === props.id)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }

  const handleTagSearch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const keyword = event.currentTarget.value;
    if (location.pathname === '/houses' && props.setState) {
      // 検索結果画面から再度検索するため、stateを更新する関数を実行する
      props.setState(keyword);
    } else {
      navigate('/houses', { state: keyword });
    }
  };

  useEffect(() => {
    checkBookmark();
  }, [bookmarkingHouses])

  return (
    <Card
      sx={{
        m: 1,
        // height: 180,
        border: "1px solid #000"
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={4} md={3}>
          <CardMedia
            component="img"
            image={props.image}
            alt="Image for house"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={6}>
          <CardContent>
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <LocalOfferOutlinedIcon/>
                {
                  props.tags?.map(tag => {
                    return (
                      <CustomTag
                        key={tag.id}
                        text={tag.name}
                        onClick={(event)=> {
                          handleTagSearch(event);
                        }}
                      />
                    )
                  })
                }
              </Box>
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={4} md={3} sx={{ margin: 'auto' }}>
          <CardActions
            sx={{
              justifyContent: 'center',
            }}
          >
            { currentUser ? (
                isBookmarked ? (
                  <UnbookmarkButton
                  onClick={props.unbookmark}
                  />
                  ) : ( 
                    <BookmarkButton
                    onClick={props.bookmark}
                    />
                  )
              ) : (null)
            }  
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  )
}

export default House