import './App.css'
import { Routes, Route } from 'react-router-dom'
import SiteNav from './components/SiteNav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import AboutPage from './pages/AboutPage'
import CafeDetailPage from './pages/CafeDetailPage'

function App() {
  return (
    <>
      <SiteNav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cafe/:id" element={<CafeDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App