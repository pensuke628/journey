import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// MUIのimport
import Button from '@mui/material/Button';

// componentのimport
import House from 'components/layouts/House';

// interfaceのimport
import { HouseData } from 'interfaces/index';

//  Contextのimport
import { BookmarkContext } from 'App';

// apiを叩く関数のimport
import { createBookmark ,destroyBookmark } from 'lib/api/bookmark';
import { getHouses } from 'lib/api/house';
import { getTaggedHouses } from 'lib/api/tag';

const Index: React.FC = () => {
  const location = useLocation();
  const { bookmarkingHouses, setBookmarkingHouses } = useContext(BookmarkContext);
  const [houses, setHouses] = useState<HouseData[]>([]);
  const [keyword, setKeyword] = useState<string>(location.state as string);
  const [filteredHouses, setFilteredHouses] = useState<HouseData[]>([]);

  const handleTagSearch = async() => {
    // デバッグ用の関数
    const res = await getHouses();
    if (res.status === 200) {
      setHouses(res.data);
    }
    const targetHouses: HouseData[] = res.data;
    
    try {
      if (keyword === '') {
        setFilteredHouses(targetHouses);
        return;
      }
      
      if (keyword) {
        const sendparams = {
          name: keyword
        };

        const response = await getTaggedHouses(sendparams);
        setFilteredHouses(response.data);
      } else {
        setFilteredHouses(targetHouses);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    handleTagSearch();
  },[])

  return (
    <>
      <h1>ハウス一覧</h1>
      {filteredHouses.map((house, index) => {
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
      })}
      <Button
        component={RouterLink}
        to='/houses/new'
        variant='contained'
        sx = {{ m:2 }}
      >
        新規登録する
      </Button>
    </>
  );
}

export default Index;