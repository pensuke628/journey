import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import { AuthContext } from 'App';

const Top: React.FC = () => {
  const { isSignedIn, currentUser }= useContext(AuthContext);
 
  return (
    <>
      { isSignedIn && currentUser? (
        <>        
          <h1>ここはテスト用Topページです</h1>
          <h1>ようこそ！ {currentUser?.name} さん</h1>
          <Link to='/owners'>
            <h2>オーナーになる</h2>
          </Link>
          <Link to='/actioncable'>
            <h2>ActionCableへ</h2>
          </Link>
        </>
        ) : (
          <h1>not signed in</h1>
        )
      }
      <Link to="/about">About</Link>
      <Link to="/users">ユーザー一覧へ</Link>
      <Link to="/houses">ハウス一覧へ</Link>
    </>
  );
}

export default Top