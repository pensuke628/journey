import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import ReviewSimple from 'components/layouts/ReviewSimple';

import { ReviewData } from 'interfaces';
import { getTaggedReviews } from 'lib/api/tag';

const ReviewSearch: React.FC = () => {
  const location = useLocation();
  const [keyword, setKeyword] = useState<string>(location.state as string);
  const [searchedReviews, setSearchedReviews] = useState<ReviewData[]>([]);
  
  const handleTagSearch = async() => {    
    try {
      if (keyword) {
        const sendparams = {
          name: keyword
        };
        const res= await getTaggedReviews(sendparams);
        setSearchedReviews(res.data);
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetKeyword = (data: string) => {
    setKeyword(data);
  }

  useEffect(() => {
    handleTagSearch();
  },[keyword])

  return (
    <>
      <h1>タグ"{keyword}"の口コミ検索結果</h1>
      { 
        React.Children.toArray(searchedReviews.map((review) => {
          return (
            <>
              <ReviewSimple
                key={review.id}
                id={review.id}
                content={review.content}
                date={review.date}
                evaluation={review.evaluation}
                user={review.user}
                house={review.house}
                tags={review.tags}
                setState={handleSetKeyword}
              />
            </>
          );
        }))
      }
    </>
  );
}

export default ReviewSearch