import SiteNav from './components/SiteNav'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import AboutPage from './pages/AboutPage'
import CafeDetailPage from './pages/CafeDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import FavoritesPage from './pages/FavoritesPage'
import ReviewedPage from './pages/ReviewedPage'

function App() {
  return (
    <>
      <SiteNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/reviews" element={<ReviewedPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cafe/:osmType/:osmId" element={<CafeDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App