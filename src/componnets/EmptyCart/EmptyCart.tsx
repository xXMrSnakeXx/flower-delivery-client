import styles from './EmptyCart.module.css';

interface EmptyCartProps {
  onContinueShopping: () => void;
}

export default function EmptyCart({ onContinueShopping }: EmptyCartProps) {
  return (
    <div className={styles.container}>
      <div className={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <p>Add some beautiful flowers to your cart!</p>
        <button className={styles.continueBtn} onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
