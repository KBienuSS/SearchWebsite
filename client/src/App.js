import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import HomePage from './components/pages/HomePage/HomePage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import LoginPage from './components/pages/LoginPage/LoginPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ads/:id" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
//        <Route path="/ads/:id" element={<Ad />} />
  //      <Route path="/ads/search/:searchPhrase" element={<Ads />} />
    //    <Route path="/ads-add" element={<Add />} />
//        <Route path="/ads-delete/:id" element={<Delete />} />
  //      <Route path="/ads-update/:id" element={<Update />} />

        //<Route path="/logout" element={<Logout />} />
//        <Route path="/user" element={<User />} />
  //      <Route element={<NotFound />} />