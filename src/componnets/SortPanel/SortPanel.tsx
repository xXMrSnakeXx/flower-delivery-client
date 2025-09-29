import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';
import styles from './SortPanel.module.css';

interface SortPanelProps {
  sortOptions: {
    sort: 'date' | 'price';
    order: 'asc' | 'desc';
  };
  onSortChange: (sort: 'date' | 'price') => void;
  onOrderToggle: () => void;
}

export default function SortPanel({
  sortOptions,
  onSortChange,
  onOrderToggle,
}: SortPanelProps) {
  return (
    <div className={styles.sortPanel}>
      <div className={styles.sortButtons}>
        <button
          className={`${styles.sortBtn} ${sortOptions.sort === 'date' ? styles.active : ''}`}
          onClick={() => onSortChange('date')}
        >
          Sort by date
        </button>
        <button
          className={`${styles.sortBtn} ${sortOptions.sort === 'price' ? styles.active : ''}`}
          onClick={() => onSortChange('price')}
        >
          Sort by price
        </button>
      </div>

      <button
        className={styles.orderBtn}
        onClick={onOrderToggle}
        title={sortOptions.order === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sortOptions.order === 'asc' ? (
          <IoIosArrowRoundUp size={22} />
        ) : (
          <IoIosArrowRoundDown size={22} />
        )}
      </button>
    </div>
  );
}
