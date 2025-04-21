import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import CartSidebar from './components/CartSidebar';

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Глобальна функція, щоб викликати з Header
    window.toggleCart = () => setCartOpen(prev => !prev);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
