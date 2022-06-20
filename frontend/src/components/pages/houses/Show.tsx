import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';

// MUIのimport
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

// componentのimport
import HouseDetail from 'components/layouts/HouseDetail';

// interfaceのimport
import { HouseData, Image, ReviewData, Tag } from 'interfaces/index';

//  Contextのimport
import { AuthContext, BookmarkContext } from 'App';

// apiを叩く関数のimport
import { createBookmark, destroyBookmark } from 'lib/api/bookmark';
import { getHouse, destroyHouse } from 'lib/api/house';


const HouseShow: React.FC = () => {
  const DummyHouse: HouseData = {
    id: 0,
    name: "",
    postalCode: "",
    prefectures: "",
    municipalities: "",
    image: {
      url: ""
    },
    profile: "",
    phoneNumber: "",
    email: "",
    relatedWebsite: "",
    price: "",
    period: "",
    checkInTime: "",
    checkOutTime: "",
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
  const [houseImages, setHouseImages] = useState<Image[]>([]);
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
        setTags(res.data.tags);
        console.log('データセットしました');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const setImages = async() => {
    // 口コミのうち、画像付きの口コミを抽出する
    const reviewsAttachedImages: ReviewData[] = reviews.filter((review: ReviewData) => {
      return review.images.length > 0
    })

    // 画像付き口コミから画像データのみを抽出する
    const Images = reviewsAttachedImages.map((review: ReviewData) => {
      return review.images
    })

    // 画像データを1次元配列に変換する
    const setData = Images.flat();
    setHouseImages(setData);
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

  useEffect(() => {
    setImages();
  },[reviews])

  const editHouse = () => {
    navigate(`/houses/${house.id}/edit`, { state: {...house} });
  };

  const handleDestroyHouse = async() => {
    const id = house.id.toString();
    const res = await destroyHouse(id);
    if (res.status === 200) {
      navigate('/houses');
    }
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
        <HouseDetail
          id={house.id}
          name={house.name}
          postalCode={house.postalCode}
          prefectures={house.prefectures}
          municipalities={house.municipalities}
          image={house.image}
          profile={house.profile}
          phoneNumber={house.phoneNumber}
          email={house.email}
          relatedWebsite={house.relatedWebsite}
          price={house.price}
          period={house.period}
          checkInTime={house.checkInTime}
          checkOutTime={house.checkOutTime}
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
          houseImages={houseImages}
        />
        <Button
          component={RouterLink}
          to='/houses'
          variant='contained'
          sx = {{ m:2 }}
        >
          一覧に戻る
        </Button>
        <Button
          onClick={handleDestroyHouse}
          variant='contained'
          sx = {{ m:2 }}
        >
          削除する
        </Button>
      </Container>
    </>
  );
}

export default HouseShow;