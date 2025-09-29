import styles from './ProductCard.module.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import type { Product } from '../../types';
import { useCustomerStore } from '../../store/customerStore';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/priceHelpers';

type ProductCardProps = {
  product: Product;
  shopId: string;
  shopName?: string;
};

export default function ProductCard({
  product,
  shopId,
  shopName,
}: ProductCardProps) {
  const favoriteIds = useCustomerStore((s) => s.favoriteIds);
  const toggleFavorite = useCustomerStore((s) => s.toggleFavorite);
  const addToCart = useCartStore((s) => s.add);

  const isFavorite = favoriteIds.includes(product._id);

  const handleFavoriteClick = () => {
    toggleFavorite(product._id);
  };

  const handleAddToCart = () => {
    addToCart(product._id, 1, {
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      shopId: shopId,
      shopName: shopName,
    });
  };

  return (
    <article className={styles.card}>
      <button
        className={`${styles.heartBtn} ${
          isFavorite ? styles.heartBtnActive : ''
        }`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={handleFavoriteClick}
      >
        {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
      </button>

      <img
        className={styles.thumb}
        src={product.imageUrl ?? 'https://placehold.co/600x400'}
        alt={product.name}
      />

      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.title}>{product.name}</h3>
          <div className={styles.price}>
            {formatPrice(product.priceCents)} UAH
          </div>
        </div>

        {product.description && (
          <div className={styles.desc}>{product.description}</div>
        )}

        <div className={styles.actions}>
          <button className={styles.btn} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
