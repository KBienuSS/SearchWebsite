import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ads/:id" element={<Ad />} />
        <Route path="/ads/search/:searchPhrase" element={<Search />} />
        <Route path="/ads-add" element={<Add />} />
        <Route path="/ads-delete/:id" element={<Delete />} />
        <Route path="/ads-update/:id" element={<Update />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/user" element={<User />} />
        <Route element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
