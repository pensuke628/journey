import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';

// コンポーネントのimport
import User from 'components/layouts/User';

// interfaceのimport
import { UserData } from 'interfaces/index';

import { RelationshipContext } from 'App';

import { getUsers } from 'lib/api/user';
import { getFollowing } from 'lib/api/relationships';

const Index: React.FC = () => {
  const { setFollowingUsers } = useContext(RelationshipContext);

  const [users, setUsers] = useState<UserData[]>([]);

  // フォロー一覧を取得する
  const handleGetFollowing = async() => {
    try {
      const res = await getFollowing();
      // console.log(res);
      if (res?.status === 200) {
        // console.log(followingUsers);
        // console.log(res?.data.activeRelationships);
        setFollowingUsers([...res.data.activeRelationships]);
        console.log('フォローユーザーをセットしました');
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
      {users.map((user, index) => {
        return (
          <User
            key={index}
            id={user.id}
            name={user.name}
            avatar={user.avatar}
            profile={user.profile}
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