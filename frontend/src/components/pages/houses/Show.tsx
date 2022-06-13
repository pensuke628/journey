import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import HouseDetail from 'components/layouts/HouseDetail';
import { HouseData, ReviewData, Tag } from "interfaces/index";

import { AuthContext, BookmarkContext } from 'App';
import { createBookmark, destroyBookmark } from 'lib/api/bookmark';
import { getHouse } from 'lib/api/house';


const HouseShow: React.FC = () => {
  const DummyHouse: HouseData = {
    id: 0,
    name: "",
    postal_code: "",
    prefectures: "",
    municipalities: "",
    image: "",
    profile: "",
    phone_number: "",
    email: "",
    related_website: "",
    price: "",
    period: "",
    check_in_time: "",
    check_out_time: "",
    capacity: "",
    parking: "",
    bath: "",
    shopping: "",
    note: "",
    tags: [],
  }

  const { isSignedIn, currentUser }= useContext(AuthContext);
  const { setBookmarkingHouses ,bookmarkingHouses } = useContext(BookmarkContext);

  const [house, setHouse] = useState<HouseData>(DummyHouse);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const query = useParams<{ id: string }>();

  const navigate = useNavigate();
  
  const getData = async(id: string | undefined) => {
    const res = await getHouse(id);
    try {
      if (res.status === 200) {
        setHouse(res.data);
        setReviews(res.data.reviews);
        setTags(res.data.tags)
        console.log('データセットしました');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkBookmark = () => {
    if (bookmarkingHouses.some(data => data.id === house.id)) {
      setIsBookmarked(true);
      console.log('お気に入り済みです');
    } else {
      console.log('お気に入りしていません');
    }
  }

  useEffect(() => {
    getData(query.id);
  },[]);

  useEffect(() => {
    checkBookmark();
  },[house]);

  const goHome = () => {
    navigate("/houses");
  }

  const editHouse = () => {
    navigate(`/houses/${house.id}/edit`, { state: {...house} });
  };

  const destroyHouse = async() => {
    await axios.delete(`http://localhost:3010/api/v1/houses/${house.id}`);
    navigate("/houses");
  };

  const handleBookmark = async() => {
    const params = {
      houseId: house.id
    }

    try {
      if (!isBookmarked) {
        const resCreate = await createBookmark(params);
        console.log(resCreate);
        if (resCreate.status === 200) {
          setIsBookmarked(true);
          setBookmarkingHouses([...bookmarkingHouses, house]);
        }
      } else {
        const resDestroy = await destroyBookmark(params);
        console.log(resDestroy);
        if (resDestroy.status === 200) {
          setIsBookmarked(false);
          const newbookmarks = bookmarkingHouses.filter(data => data.id !== house.id)
          setBookmarkingHouses([...newbookmarks]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Container>
        <h1>ハウス詳細</h1>
        <HouseDetail
          id={house.id}
          name={house.name}
          postal_code={house.postal_code}
          prefectures={house.prefectures}
          municipalities={house.municipalities}
          image={house.image}
          profile={house.profile}
          phone_number={house.phone_number}
          email={house.email}
          related_website={house.related_website}
          price={house.price}
          period={house.period}
          check_in_time={house.check_in_time}
          check_out_time={house.check_out_time}
          capacity={house.capacity}
          parking={house.parking}
          bath={house.bath}
          shopping={house.shopping}
          note={house.note}
          isBookmarked={isBookmarked}
          bookmark={handleBookmark}
          editHouse={editHouse}
          reviews={reviews}
          tags={tags}
        />
        <Button
          component={Link}
          to="/houses/new"
          variant="contained"
          sx = {{ m:2 }}
        >新規登録する</Button>
        <Button
          onClick={goHome}
          variant="contained"
          sx = {{ m:2 }}
        >一覧に戻る</Button>
        <Button
          onClick={editHouse}
          variant="contained"
          sx = {{ m:2 }}
        >更新する</Button>
        <Button
          onClick={destroyHouse}
          variant="contained"
          sx = {{ m:2 }}
        >削除する</Button>
      </Container>
    </>
  );
}

export default HouseShow;