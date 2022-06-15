import React, { useEffect, useState, useContext } from 'react';

// コンポーネントのimport
import User from 'components/layouts/User';

// interfaceのimport
import { UserData } from 'interfaces/index';

//  Contextのimport
import { RelationshipContext } from 'App';

// apiを叩く関数のimport
import { getUsers } from 'lib/api/user';
import { getFollowing } from 'lib/api/relationships';


const Index: React.FC = () => {
  const { setFollowingUsers } = useContext(RelationshipContext);
  const [users, setUsers] = useState<UserData[]>([]);

  // フォロー一覧を取得する
  const handleGetFollowing = async() => {
    try {
      const res = await getFollowing();
      if (res?.status === 200) {
        setFollowingUsers([...res.data.activeRelationships]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getUsersData = async() => {
    const res = await getUsers();
    if (res.status === 200) {
      setUsers(res.data);
    }
  }

  useEffect( () => {
    getUsersData();
    handleGetFollowing();
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[]);

  return (
    <>
      <h1>ユーザー一覧</h1>
      {
        users.map((user, index) => {
          return (
            <User
              key={index}
              id={user.id}
              name={user.name}
              email={user.email}
              backgroundImage={user.backgroundImage}
              profile={user.profile}
              avatar={user.avatar}
              provider={user.provider}
              uid={user.uid}
              allowPasswordChange={user.allowPasswordChange}
              reviews={user.reviews}
              likes={user.likes}
              following={user.following}
              followers={user.following}
            />
          );
        })
      }
    </>
  );
}

export default Index;