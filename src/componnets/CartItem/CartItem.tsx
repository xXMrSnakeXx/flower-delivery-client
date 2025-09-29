import { IoIosAdd, IoIosClose, IoIosRemove } from 'react-icons/io';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/priceHelpers';
import styles from './CartItem.module.css';

type CartItemProps = {
  item: {
    productId: string;
    name: string;
    priceCents: number;
    qty: number;
    imageUrl?: string;
  };
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQty, remove } = useCartStore();

  const handleQtyChange = (newQty: number) => {
    if (newQty <= 0) {
      remove(item.productId);
    } else {
      updateQty(item.productId, newQty);
    }
  };

  return (
    <div className={styles.cartItem}>
      <img
        src={item.imageUrl || 'https://placehold.co/80x80'}
        alt={item.name}
        className={styles.itemImage}
      />

      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <div className={styles.itemPrice}>
          {formatPrice(item.priceCents)} UAH
        </div>
      </div>

      <div className={styles.qtyControls}>
        <button
          className={styles.qtyBtn}
          onClick={() => handleQtyChange(item.qty - 1)}
        >
          <IoIosRemove size={16} />
        </button>
        <span className={styles.qtyDisplay}>{item.qty}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => handleQtyChange(item.qty + 1)}
        >
          <IoIosAdd size={16} />
        </button>
      </div>

      <div className={styles.itemTotal}>
        {formatPrice(item.priceCents * item.qty)} UAH
      </div>

      <button
        className={styles.removeBtn}
        onClick={() => remove(item.productId)}
        aria-label="Remove item"
      >
        <IoIosClose />
      </button>
    </div>
  );
}
