import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
} from "@mui/material";

// コンポーネントのimport
import House from "components/layouts/House";

// interfaceのimport
import { HouseData } from "interfaces/index";

import { BookmarkContext } from 'App';
import { createBookmark ,destroyBookmark } from 'lib/api/bookmark';

const Index: React.FC = () => {
  const { bookmarkingHouses, setBookmarkingHouses } = useContext(BookmarkContext);
  const url: string = "http://localhost:3010/api/v1/houses";
  const [houses, setHouses] = useState<HouseData[]>([]);

  const getData = async() => {
    const res = await axios.get(url);
    if (res.status === 200) {
      setHouses(res.data);
    }
  }

  const handleCreateBookmark = async(house: HouseData) => {
    const params = {
      houseId: house.id
    }

    const resCreate = await createBookmark(params);
    console.log(resCreate);
    if (resCreate.status === 200) {
      setBookmarkingHouses([...bookmarkingHouses, house]);
    }
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

  useEffect( () => {
    getData()
  },[])

  return (
    <>
      <h1>ハウス一覧</h1>
      {houses.map((house, index) => {
        return (
          <House
            key={index}
            id={house.id}
            name={house.name}
            prefectures={house.prefectures}
            image={house.image}
            bookmark={() => handleCreateBookmark(house)}
            unbookmark={() => handleDestroyBookmark(house)}
          />
        );
      })}
      <Button
        component={Link}
        to="/houses/new"
        variant="contained"
        sx = {{ m:2 }}
      >新規登録する</Button>
    </>
  );
}

export default Index;