import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import MapPage from './pages/MapPage';
import FeedPage from './pages/FeedPage';
import SubmitPage from './pages/SubmitPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#1a1a2e',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;