import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import Catalogue from './pages/Catalogue';
import Panier from './pages/Panier';
import Commande from './pages/Commande';
import Historique from './pages/Historique';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Catalogue />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/commande" element={<Commande />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}
