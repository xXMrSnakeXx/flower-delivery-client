import styles from './GrandTotal.module.css';
import { formatPrice } from '../../utils/priceHelpers';

interface GrandTotalProps {
  grandTotalCents: number;
}

export default function GrandTotal({ grandTotalCents }: GrandTotalProps) {
  return (
    <div className={styles.grandTotal}>
      <div className={styles.totalLine}>
        <span>Grand Total:</span>
        <span>{formatPrice(grandTotalCents)} UAH</span>
      </div>
    </div>
  );
}
