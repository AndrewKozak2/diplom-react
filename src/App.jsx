import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import CartSidebar from './components/CartSidebar';
import AddProductForm from './components/AddProductForm';
import Favorites from './pages/Favorites';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ScrollToTopButton from "./components/ScrollToTopButton";
import FloatingCartButton from "./components/FloatingCartButton";
import AdminPromoPanel from "./pages/AdminPromoPanel";
import AdminOrderStats from "./pages/AdminOrderStats";
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Configurator from './pages/Configurator';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const location = useLocation(); 
   const { i18n } = useTranslation();

  useEffect(() => {
    window.toggleCart = () => setCartOpen((prev) => !prev);
    window.showAddProductForm = () => setShowAddForm(true);
    window.triggerRefresh = () => setRefresh(prev => !prev);
  }, []);

    useEffect(() => {
    document.body.classList.remove('ua', 'en');
    document.body.classList.add(i18n.language);
  }, [i18n.language]);

  const hideLayoutRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
  const hideScrollButton = ['/checkout', '/favorites'].includes(location.pathname);
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  const isHome = location.pathname === '/';

  return (
    <div className={`${isHome ? 'bg-transparent' : 'bg-gray-100'} min-h-screen`}>
      {!hideLayout && <Header />}
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home refresh={refresh} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/admin/promo" element={<AdminPromoPanel />} />
        <Route path="/admin/stats" element={<AdminOrderStats />} />
        <Route path="/configurator" element={<Configurator />} />
      </Routes>
      <FloatingCartButton onClick={() => window.toggleCart?.()} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {showAddForm && <AddProductForm onClose={() => setShowAddForm(false)} />}
      {!hideLayout && <Footer />}
      {!hideScrollButton && <ScrollToTopButton />}
    </div>
  );
}

export default App;