import React, { useState } from 'react';
import Header from '../UI/Header';
import Footer from '../UI/Footer';
import { Outlet } from 'react-router-dom';
import Products from './Products';

export default function AppLayout() {
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    photoURL: '',
  });
  return (
    <div>
      <Header name={name} setName={setName}
        userData={userData} setUserData={setUserData}
        search={search} setSearch={setSearch} />
      <main>
        <Outlet />
        <Products search={search} />
      </main>
      <Footer />
    </div>
  );
}
