import React from 'react';
import { Routes, Route } from "react-router-dom";

import Top from 'components/pages/Top';
import About from 'components/pages/About';
import Contact from 'components/pages/Contact';
import SignIn from 'components/pages/SignIn';
import SignUp from 'components/pages/SignUp';
import PasswordReset from 'components/pages/PasswordReset';
import UserBookmarks from 'components/pages/users/Bookmarks';
import UserIndex from 'components/pages/users/Index';
import UserMessageRooms from 'components/pages/users/MessageRooms';
import UserShow from 'components/pages/users/Show';
import HouseIndex from 'components/pages/houses/Index';
import HouseNew from 'components/pages/houses/New';
import HouseShow from 'components/pages/houses/Show';
import HouseEdit from 'components/pages/houses/Edit';
import MessageRoom  from 'components/pages/users/MessageRoom';
import OwnerIndex from 'components/pages/owners/Index';
import OwnerNew from 'components/pages/owners/New';
import ReviewShow from 'components/pages/reviews/Show';
import ReviewSearch from 'components/pages/reviews/Search';

import ActionCableConnection from 'components/layouts/ActionCableConnection';

const NotFound: React.FC = () => {
  return(
    <h2>ページが見つかりません</h2>
  );
}

const Routing: React.FC = () => {
  return(
      <Routes>
        <Route path='/' element={<Top/>} />
        <Route path='actioncable' element={<ActionCableConnection/>} />
        <Route path='about' element={<About/>} />
        {/* <Route path="/signup" element={<SignUp/>}/> */}
        <Route path='contact' element={<Contact/>}/>
        <Route path='passwordreset' element={<PasswordReset/>}/>
        <Route path='signin' element={<SignIn/>}/>
        <Route path='signup' element={<SignUp/>}/>
        <Route path='users'>
          <Route index element={<UserIndex/>}/>
          <Route path=':id'>
            <Route index element={<UserShow/>}/>
            <Route path='bookmarks' element={<UserBookmarks/>}/>
            <Route path='message_rooms' element={<UserMessageRooms/>}/>
            <Route path='owners' element={<OwnerIndex/>}/>
          </Route>
        </Route>
        <Route path='houses'>
          <Route index element={<HouseIndex/>}/>
          <Route path='new' element={<HouseNew/>}/>
          <Route path=':id'>
            <Route index element={<HouseShow/>}/>
            <Route path='edit' element={<HouseEdit/>}/>
          </Route>
        </Route>
        <Route path='messageroom'>
          <Route path=':id'>
            <Route index element={<MessageRoom/>}/>
          </Route>
        </Route>
        <Route path='owners'>
          <Route index element={<OwnerNew/>}/>
        </Route>
        <Route path='reviews'>
          <Route path='search' element={<ReviewSearch/>}/>
          <Route path=':id'>
            <Route index element={<ReviewShow/>}/>
          </Route>
        </Route>
        <Route path='*' element={<NotFound/>} />
      </Routes>
  );
}

export default Routing;