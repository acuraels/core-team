import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import NotFound from './pages/NotFound.tsx';

import AboutPage from './pages/AboutPage/AboutPage.tsx';

function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Navigate to="/about" />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnFocusLoss
        pauseOnHover
        closeOnClick
        draggable
        theme="dark"
      />
    </>
  )
}

export default App
