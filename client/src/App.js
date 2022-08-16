import './App.scss';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import Auth from './components/Auth';
import RequireAuth from './components/RequireAuth';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import MyPostPage from './pages/MyPostPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Auth />}>
        <Route path='/' element={<LoginPage />} />
      </Route>
      <Route path='home' element={<RequireAuth />}>
        <Route index element={<HomePage />} />
        <Route path='myPost' element={<MyPostPage />} />
      </Route>
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
