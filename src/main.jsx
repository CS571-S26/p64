import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'
import { ReviewsProvider } from './contexts/ReviewsContext.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <FavoritesProvider>
      <ReviewsProvider>
        <App />
      </ReviewsProvider>
    </FavoritesProvider>
  </HashRouter>
  

)
