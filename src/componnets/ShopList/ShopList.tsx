import styles from './ShopList.module.css';
import type { Shop } from '../../types';
import Loader from '../Loader/Loader';

type ShopListProps = {
  shops: Shop[];
  loading: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
};

export default function ShopList({
  shops,
  loading,
  selectedId,
  onSelect,
}: ShopListProps) {
  if (loading) {
    return (
      <div className={styles.shopList}>
        <Loader/>
      </div>
    );
  }

  return (
    <div className={styles.shopList}>
      <h2 className={styles.title}>Shops</h2>
      <div className={styles.list}>
        {shops.map((shop) => (
          <button
            key={shop._id}
            className={`${styles.shopItem} ${
              selectedId === shop._id ? styles.active : ''
            }`}
            onClick={() => onSelect(shop._id)}
          >
            <h3 className={styles.shopName}>{shop.name}</h3>
            <p className={styles.shopAddress}>{shop.address}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
