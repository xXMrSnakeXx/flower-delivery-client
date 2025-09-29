import styles from './OrderCard.module.css';
import { formatPrice } from '../../utils/priceHelpers';
import type { OrderResponse } from '../../types';

interface OrderCardProps {
  order: OrderResponse;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <h2 className={styles.orderId}>
          Order #{order.orderId.slice(-8).toUpperCase()}
        </h2>
        <div className={styles.shopInfo}>
          <h3 className={styles.shopName}>{order.shop.name}</h3>
          <p className={styles.shopAddress}>{order.shop.address}</p>
        </div>
      </div>

      <div className={styles.orderItems}>
        {order.items.map((item) => (
          <div key={item.productId} className={styles.orderItem}>
            <img
              src={item.image}
              alt={item.name}
              className={styles.itemImage}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/100x100?text=🌺';
              }}
            />
            <div className={styles.itemDetails}>
              <h4 className={styles.itemName}>{item.name}</h4>
              <div className={styles.itemQuantityPrice}>
                <span className={styles.quantity}>{item.quantity} ×</span>
                <span className={styles.price}>
                  {formatPrice(item.priceCents)} UAH
                </span>
              </div>
            </div>
            <div className={styles.itemTotal}>
              {formatPrice(item.lineTotalCents)} UAH
            </div>
          </div>
        ))}
      </div>

      <div className={styles.orderTotal}>
        <div className={styles.totalLine}>
          <span>Shop total:</span>
          <span>{formatPrice(order.totalCents)} UAH</span>
        </div>
      </div>
    </div>
  );
}
