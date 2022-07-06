import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUIのimport
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// MUIIconsのimport
import SearchIcon from '@mui/icons-material/Search';
// componentのimport
import House from 'components/layouts/House';
import JapanMapComponent from 'components/layouts/JapanMapComponent';
import About from 'components/pages/About'

// interfaceのimport
import { HouseData } from 'interfaces';

//  Contextのimport
import { AuthContext, BookmarkContext } from 'App';

// APIを叩く関数のimport
import { createBookmark ,destroyBookmark } from 'lib/api/bookmark';
import { getHouses } from 'lib/api/house';

// 画像データのimport
import backgroundImage from '../../images/top.jpg';

const Top: React.FC = () => {
  const { isSignedIn, currentUser }= useContext(AuthContext);
  const { bookmarkingHouses, setBookmarkingHouses } = useContext(BookmarkContext);

  const [houses, setHouses] = useState<HouseData[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<HouseData[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false)
  
  const getData = async() => {
    const res = await getHouses();
    if (res.status === 200) {
      setHouses(res.data);
    }
  }
  
  const handleNameSearch = async() => {
    // 検索BOXが空欄の場合、初期化する
    if (keyword === '') {
      setFilteredHouses(houses);
      setIsSearching(false);
      return;
    }

    // keywordの両端の空白を削除して、英字の場合全て小文字に変換する
    const searchKeywords = keyword.trim().toLowerCase().match(/[^\s]+/g);

    // 入力されたキーワードが空白のみの場合は初期化する
    if (searchKeywords === null) {
      setFilteredHouses(houses);
      setIsSearching(false);
      return;
    } else {
      setIsSearching(true);
    }

    console.log(searchKeywords);

    const result = houses.filter((house) => 
      searchKeywords.every((kw) => house.name.toLowerCase().indexOf(kw) !== -1)
    );
    setFilteredHouses(result);
    setIsSearching(true);
  };

  // 都道府県名での検索
  const handlePrefectureSearch = async(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const prefecture = event.currentTarget.value;

    if (prefecture === '') {
      setFilteredHouses(houses);
      setIsSearching(false);
      return;
    }

    // keywordの両端の空白を削除して、英字の場合全て小文字に変換する
    const searchKeywords = prefecture.trim().toLowerCase().match(/[^\s]+/g);

    // 入力されたキーワードが空白のみの場合は初期化する
    if (searchKeywords === null) {
      setFilteredHouses(houses);
      setIsSearching(false);
      return;
    } else {
      setIsSearching(true);
    }

    console.log(searchKeywords);

    const result = houses.filter((house) => 
      searchKeywords.every((kw) => house.prefectures.toLowerCase().indexOf(kw) !== -1)
    );
    setFilteredHouses(result);
    setIsSearching(true);
  };

  const backHome = () => {
    setIsSearching(false);
  }

  const handleCreateBookmark = async(house: HouseData) => {
    const params = {
      houseId: house.id
    }

    const res = await createBookmark(params);
    if (res.status === 200) {
      setBookmarkingHouses([...bookmarkingHouses, house]);
    }
  }

  const handleDestroyBookmark = async(house: HouseData) => {
    const params = {
      houseId: house.id
    }

    try {
        const res = await destroyBookmark(params);
        if (res.status === 200) {
          const newbookmarks = bookmarkingHouses.filter(data => data !== house)
          setBookmarkingHouses([...newbookmarks]);
        }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  },[])

  const TopPage: React.FC = () => {
    return(          
      <Box
        sx={{
          py: '300px',
          backgroundImage: `url(${backgroundImage})`,
          textAlign: 'center'
        }}
      >
        {
          (isSignedIn && currentUser) ? (
            <>
              <Typography variant='h1' sx={{ color: 'white' }}>
                ここはテスト用Topページです
              </Typography>
              <Typography variant='h1' sx={{ color: 'white' }}>
                ようこそ！ {currentUser?.name} さん
              </Typography>
              <Button
                component={RouterLink}
                to='/owners'
                variant='contained'
              >
                オーナーになる
              </Button>
            </>
          ) : (
            <Typography variant='h1' sx={{ color: 'white' }}>
              TOP
            </Typography>
          )
        }
      </Box>
    );
  }

  return (
    <Container>
      {
        isSearching ? (
          <>
            <h1>検索結果</h1>
            { filteredHouses.map((house, index) => {
              return (
                <House
                  key={index}
                  id={house.id}
                  name={house.name}
                  prefectures={house.prefectures}
                  image={house.image.url}
                  bookmark={() => handleCreateBookmark(house)}
                  unbookmark={() => handleDestroyBookmark(house)}
                />
              );
            })
            }
            <Button
              variant='contained'
              onClick={backHome}
            >
              TOPに戻る
            </Button>
          </>
        ) : (
          <>
            <TopPage/>
            <About/>
            <Card
              elevation={0}
              sx={{ pt: 3 }}
            >
              <CardHeader
                title='キーワードから探す'
              />
              <CardContent>
                <TextField
                  color='secondary'
                  variant='outlined'
                  placeholder='施設名を入力してください'
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handleNameSearch}
                      >
                        <SearchIcon/>
                      </IconButton>
                    ),
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>)=> setKeyword(event.target.value)}
                />
              </CardContent>
            </Card>
            <Grid container justifyContent='center'>
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{ pt: 3 }}
                >
                  <CardHeader
                    title='エリアから探す'
                  />
                  <CardContent
                    sx={{
                      maxWidth: '1050px',
                      mx: 'auto'
                    }}
                  >
                    <JapanMapComponent
                      handleClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handlePrefectureSearch(event)}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )    
      }      
    </Container>
  );
}

export default Top