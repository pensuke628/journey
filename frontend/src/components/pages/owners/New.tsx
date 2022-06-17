import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUIのimport
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

// MUIIconsのimport
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HouseIcon from '@mui/icons-material/House';

// interfaceのimport
import { HouseData } from 'interfaces/index';

// Contextのimport
import { AuthContext } from 'App';

// apiを叩く関数のimport
import { getHouses } from 'lib/api/house';
import { createOwner } from 'lib/api/owner';

const styles = {
  searcharea: {
    margin: '1rem 0',
  },
  searchbox: {
    display: 'flex',
  },
  cardRoot: {
    margin: '1rem',
    display: 'flex',
    border: '1px solid #000'
  }
}

const OwnerNew: React.FC  = () => {
  const {currentUser} = useContext(AuthContext);
  const [keyword, setKeyword] = useState<string>('');
  const [showLists, setShowLists] = useState<boolean>(false);
  const [houses, setHouses] = useState<HouseData[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<HouseData[]>([]);

  const getData = async() => {
    const res = await getHouses();
    if (res.status === 200) {
      setHouses(res.data);
    }
  }

  useEffect(() => {
    getData();
  },[]);

  const keywordSearch = () => {
    // 検索BOXが空欄の場合、初期化する
    if (keyword === '') {
      setFilteredHouses(houses);
      setShowLists(false);
      return;
    }
    // keywordの両端の空白を削除して、英字の場合全て小文字に変換する
    const searchKeywords = keyword.trim().toLowerCase().match(/[^\s]+/g);

    // 入力されたキーワードが空白のみの場合は初期化する
    if (searchKeywords === null) {
      setFilteredHouses(houses);
      setShowLists(false);
      return;
    } else {
      setShowLists(true);
    }

    const result = houses.filter((house) => 
      searchKeywords.every((kw) => house.name.toLowerCase().indexOf(kw) !== -1)
    );

    setFilteredHouses(result);
  }

  useEffect(() => {
    keywordSearch();
  }, [keyword]);

  const handleClick = async(houseId: number) => {
    const params = {
      userId: currentUser?.id,
      houseId: houseId
    }

    const res = await createOwner(params);
    try {
      if (res.status === 200){
        console.log('オーナーになりました');
      }

    } catch (error) {
      console.log(error);
    }

  }

  return(
    <>
      <Container>
        <Card style={styles.searcharea}>
          <CardHeader
            title='オーナーになる施設を検索する'
          />
          <Box style={styles.searchbox}>
            <HouseIcon sx={{ fontSize: 48 }}/>
            <TextField
              color='secondary'
              variant='outlined'
              placeholder='施設名を入力してください'
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>)=> setKeyword(event.target.value)}
            />
          </Box>
        </Card>
        {
          showLists &&filteredHouses.map((house: HouseData, index: number) => 
          <Card key={index} style={styles.cardRoot}>
            <Grid
              container
            >
              <Grid item xs={6} sm={3}>
                <CardMedia
                  component='img'
                  image={house.image.url}
                  alt='Image for house'
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <CardContent>
                  <Typography>
                    <RouterLink to ={`/houses/${house.id}`}>
                      {house.name}
                    </RouterLink>
                  </Typography>
                  <Typography>
                    エリア: {house.prefectures}
                  </Typography>
                  <Typography>
                    タグ:
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={6} sm={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <CardActions>
                  <Button
                    variant='contained'
                    onClick={() => handleClick(house.id)}
                  >
                    オーナーになる
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
          )
        }
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', mx: 4,  my: 1 }}>
            <Typography>
              施設は見つかりましたか？見つからなければ...
            </Typography>
            <ArrowForwardIcon/>
          </Box>
          <Button
            component={RouterLink}
            to='/houses/new'
            variant='contained'
          >
            施設新規登録
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default OwnerNew;