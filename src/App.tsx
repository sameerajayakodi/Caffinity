import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/home/HomePage';
import MenuPage from './pages/menu/MenuPage';
import POSPage from './pages/pos/POSPage';
import KitchenPage from './pages/kitchen/KitchenPage';
import PaymentPage from './pages/payment/PaymentPage';
import AdminPage from './pages/admin/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
