import { useQuery } from '@tanstack/react-query';
import { getProductsByShop } from '../../api/products';
import type { GetProductsOptions, Product } from '../../types';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductsGallery.module.css';
import { useCustomerStore } from '../../store/customerStore';
import { useMemo } from 'react';
import Loader from '../Loader/Loader';
import Text from '../Text/Text';

type ProductsGalleryProps = {
  shopId: string;
  shopName?: string;
  sortOptions: GetProductsOptions;
};

export default function ProductsGallery({
  shopId,
  shopName,
  sortOptions,
}: ProductsGalleryProps) {
  const favoriteIds = useCustomerStore((s) => s.favoriteIds);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', shopId, sortOptions],
    queryFn: () =>
      shopId ? getProductsByShop(shopId, sortOptions) : Promise.resolve([]),
    enabled: !!shopId,
  });

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];

    const productsCopy = [...products];

    return productsCopy.sort((a, b) => {
      const aIsFavorite = favoriteIds.includes(a._id);
      const bIsFavorite = favoriteIds.includes(b._id);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      return 0;
    });
  }, [products, favoriteIds]);

  if (!shopId) {
    return (
      <div className={styles.placeholder}>
        <Text>Please select a shop to view products</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Loader />
      ) : sortedProducts.length === 0 ? (
        <Text textAlign="center" marginBottom="20">
          No products found in this shop
        </Text>
      ) : (
        <div className={styles.productsGrid}>
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              shopId={shopId}
              shopName={shopName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
