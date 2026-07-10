import MainMenu from './../MainMenu/MainMenu';

const MainLayout = ({ children }) => (
  <div>
    <MainMenu />
    {children}
  </div>
);

export default MainLayout;
