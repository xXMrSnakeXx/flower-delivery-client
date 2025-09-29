import ShopGroup from '../ShopGroup/ShopGroup';
import styles from './ItemsSection.module.css';
import type { CartItem } from '../../store/cartStore';
import { formatPrice } from '../../utils/priceHelpers';

interface ItemsSectionProps {
  items: CartItem[];
  groupedItems: Record<string, { shopName: string; items: CartItem[] }>;
  totalPrice: number;
}

export default function ItemsSection({
  items,
  groupedItems,
  totalPrice,
}: ItemsSectionProps) {
  return (
    <div className={styles.itemsSection}>
      <h2>Order Items ({items.length})</h2>

      <div className={styles.shopGroups}>
        {Object.entries(groupedItems).map(([shopId, group]) => (
          <ShopGroup
            key={shopId}
            shopName={group.shopName}
            items={group.items}
          />
        ))}
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.totalRow}>
          <span>Total:</span>
          <span className={styles.totalPrice}>
            {formatPrice(totalPrice)} UAH
          </span>
        </div>
      </div>
    </div>
  );
}
