import styles from './DeliveryInfo.module.css';
import { formatCustomerTz } from '../../utils/formatCustomerTz';

interface DeliveryInfoProps {
  deliveryAddress?: string;
  createdAt?: string;
  customerTimeZone?: string;
}

export default function DeliveryInfo({
  deliveryAddress,
  createdAt,
  customerTimeZone,
}: DeliveryInfoProps) {
  if (!deliveryAddress) return null;

  return (
    <div className={styles.deliveryAddress}>
      <div className={styles.deliveryTitle}>Delivery Address</div>
      <p className={styles.deliveryText}>{deliveryAddress}</p>

      {createdAt && (
        <p className={styles.deliveryMeta}>
          Order was created:{' '}
          {formatCustomerTz(createdAt, customerTimeZone ?? undefined)}{' '}
          {customerTimeZone}
        </p>
      )}
    </div>
  );
}
