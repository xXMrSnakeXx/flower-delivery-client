import type { CartItem } from '../../store/cartStore';
import { formatPrice } from '../../utils/priceHelpers';
import CartItemComponent from '../CartItem/CartItem';
import styles from './ShopGroup.module.css';

type ShopGroupProps = {
  shopName: string;
  items: CartItem[];
};

export default function ShopGroup({ shopName, items }: ShopGroupProps) {
  const shopTotal = items.reduce(
    (total, item) => total + item.priceCents * item.qty,
    0
  );
  return (
    <div className={styles.shopGroup}>
      <div className={styles.shopHeader}>
        <h3 className={styles.shopName}>{shopName}</h3>
        <span className={styles.shopTotal}>
          Shop total: {formatPrice(shopTotal)} UAH
        </span>
      </div>

      <div className={styles.shopItems}>
        {items.map((item) => (
          <CartItemComponent key={item.productId} item={item} />
        ))}
      </div>
    </div>
  );
}
