import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import Header from './componnets/Header/Header';
import Loader from './componnets/Loader/Loader';

const ShopsPage = lazy(() => import('./pages/ShopsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));

export default function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<ShopsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
