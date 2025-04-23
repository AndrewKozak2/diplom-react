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


function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const location = useLocation(); // 🔁 отримуємо поточну сторінку

  useEffect(() => {
    window.toggleCart = () => setCartOpen((prev) => !prev);
    window.showAddProductForm = () => setShowAddForm(true);
    window.triggerRefresh = () => setRefresh(prev => !prev);
  }, []);

  // ❌ Не показувати Header на login або register
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="bg-gray-100 min-h-screen">
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home refresh={refresh} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {showAddForm && (
        <AddProductForm onClose={() => setShowAddForm(false)} />
      )}
       <Footer /> 
    </div>
  );
}

export default App;
