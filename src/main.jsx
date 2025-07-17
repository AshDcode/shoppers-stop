
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { BagProvider } from './context/BagContext.jsx';
import { FavouritesProvider } from './context/FavouritesContext.jsx';

createRoot(document.getElementById('root')).render(
  <BagProvider>
    <FavouritesProvider>
      <App />
    </FavouritesProvider>
  </BagProvider>
);
