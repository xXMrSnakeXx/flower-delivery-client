import { useNavigate } from 'react-router-dom';
import { SlBasket } from 'react-icons/sl';
import { GiVineFlower } from 'react-icons/gi';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/priceHelpers';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <button
          className={styles.brand}
          onClick={() => navigate('/')}
          aria-label="Home"
        >
          <GiVineFlower size={36} color="#0ea5e9" />
          <span>FlowerDelivery</span>
        </button>

        <button
          className={styles.cart}
          onClick={() => navigate('/cart')}
          aria-label="Cart"
        >
          <SlBasket size={20} color="#0ea5e9" />
          <span className={styles.cartInfo}>
            <span className={styles.count}>{totalItems}</span>
            <span>{formatPrice(totalPrice)} UAH</span>
          </span>
        </button>
      </div>
    </header>
  );
}
