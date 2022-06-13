import React, {useState, useEffect, createContext} from 'react';
// import { Routes, Route, } from "react-router-dom";

// routingのimport
import Routing from 'routes/index';

// componentのimport
import Header from 'components/layouts/Header';
import Footer from 'components/layouts/Footer';

// interfacesのimport
import { HouseData, Notification, ReviewData, UserData } from 'interfaces/index';

import { getCurrentUser } from 'lib/api/auth';

// グローバルで扱う変数・関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: UserData | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | undefined>>
});

export const BookmarkContext = createContext({} as {
  bookmarkingHouses: HouseData[]
  setBookmarkingHouses: React.Dispatch<React.SetStateAction<HouseData[]>>
})

export const LikeContext = createContext({} as {
  likingReviews: ReviewData[]
  setLikingReviews: React.Dispatch<React.SetStateAction<ReviewData[]>>
})

export const NotificationContext = createContext({} as {
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
});

export const OwnerContext = createContext({} as {
  owneredHouses: HouseData[]
  setOwneredHouses: React.Dispatch<React.SetStateAction<HouseData[]>>
})

export const RelationshipContext = createContext({} as {
  followingUsers: number[]
  setFollowingUsers: React.Dispatch<React.SetStateAction<number[]>>
})


const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | undefined>();
  const [followingUsers, setFollowingUsers] = useState<number[]>([]);
  const [bookmarkingHouses, setBookmarkingHouses] = useState<HouseData[]>([]);
  const [likingReviews, setLikingReviews] = useState<ReviewData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [owneredHouses, setOwneredHouses] = useState<HouseData[]>([]);

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      // console.log(res);

      if (res?.data.isLogin === true) {
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        setBookmarkingHouses(res?.data.bookmarks);
        setLikingReviews(res?.data.likes);
        setNotifications(res?.data.notifications);
        setOwneredHouses(res?.data.owners);

        console.log(res?.data);
      } else {
        console.log("No current user");
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser()
  }, [setCurrentUser]);

  return (
    <>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
      <RelationshipContext.Provider value={{ followingUsers, setFollowingUsers }}>
      <BookmarkContext.Provider value={{ bookmarkingHouses, setBookmarkingHouses }}>
      <LikeContext.Provider value={{ likingReviews, setLikingReviews }}>
      <NotificationContext.Provider value={{ notifications, setNotifications}}>
      <OwnerContext.Provider value={{ owneredHouses, setOwneredHouses }}>
        <Header/>
        <Routing/>
        <Footer/>
      </OwnerContext.Provider>
      </NotificationContext.Provider>
      </LikeContext.Provider>
      </BookmarkContext.Provider>
      </RelationshipContext.Provider>
      </AuthContext.Provider>
    </>
  )
}

export default App;
