import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

// コンポーネントのimport
import House from "components/layouts/House";

// interfaceのimport
import { HouseData } from "interfaces/index";
import { BookmarkContext } from 'App';

// apiを叩く関数のimport
import { destroyBookmark } from 'lib/api/bookmark';

const UserBookmarks: React.FC = () => {
  const { setBookmarkingHouses, bookmarkingHouses } = useContext(BookmarkContext);

  const onClick = () => {
    console.log('クリックしました');
  }

  const handleDestroyBookmark = async(house: HouseData) => {
    const params = {
      houseId: house.id
    }

    try {
      const resDestroy = await destroyBookmark(params);
      console.log(resDestroy);
      if (resDestroy.status === 200) {
        const newbookmarks = bookmarkingHouses.filter(data => data !== house)
        setBookmarkingHouses([...newbookmarks]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1>{`お気に入り済み 1~20件を表示/全${bookmarkingHouses.length}件`}</h1>
      {bookmarkingHouses.map((house, index) => {
        return (
          <House
            key={index}
            id={house.id}
            name={house.name}
            prefectures={house.prefectures}
            image={house.image.url}
            bookmark={onClick}
            unbookmark={() => handleDestroyBookmark(house)}
          />
        );
      })}
      <Button
        component={Link}
        to='/houses/new'
        variant='contained'
        sx = {{ m:2 }}
      >
        新規登録する
      </Button>
    </>
  );
}

export default UserBookmarks;