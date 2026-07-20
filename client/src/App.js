import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import HomePage from './components/pages/HomePage/HomePage';
import Ad from './components/pages/Ad/Ad';
import NewAd from './components/pages/NewAd/NewAd';
import AdEdit from './components/pages/AdEdit/AdEdit';
import Search from './components/pages/Search/Search';
import Logout from './components/pages/Logout/Logout';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import LoginPage from './components/pages/LoginPage/LoginPage';
import NotFound from './components/pages/NotFound/NotFound';
import { API_URL } from './config';
import { useDispatch } from 'react-redux';
import { logIn } from './redux/usersRedux';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/user`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(logIn(data.user));
        } else {
          return
        }
      } catch (err) {
        return
      }
    };

    fetchUser();
  }, []);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ad/:id" element={<Ad />} />
        <Route path="/ad/add" element={<NewAd />} />
        <Route path="/ad/edit/:id" element={<AdEdit />} />
        <Route path="/search/:searchPhrase" element={<Search />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
