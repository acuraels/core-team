import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import ProtectedRoute from './components/ProtectedRoute.tsx';

import NotFound from './pages/NotFound.tsx';

import Unauthorized from './pages/Unauthorized.tsx';

import AboutPage from './pages/AboutPage/AboutPage.tsx';
import BooksPage from './pages/BooksPage/BooksPage.tsx';
import EventsPage from './pages/EventsPage/EventsPage.tsx';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import Logout from './pages/LogOut.tsx';

import ReaderProfile from './pages/ReaderProfile/ReaderProfile.tsx';
import LibrarianProfile from './pages/LibrarianProfile/LibrarianProfile.tsx';
import BookDetailsPage from './pages/BookDetailsPage/BookDetailsPage.tsx';
import EventDetailsPage from './pages/EventDetailsPage/EventDetailsPage.tsx';

function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Navigate to="/about" />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />



          <Route path="/reader-profile" element={
            <ProtectedRoute allowedRoles={['Reader']}>
              <ReaderProfile />
            </ProtectedRoute>
          } />

          <Route path="/librarian-profile" element={
            <ProtectedRoute allowedRoles={['Librarian']}>
              <LibrarianProfile />
            </ProtectedRoute>
          } />
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
