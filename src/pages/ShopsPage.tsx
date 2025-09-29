import { useQuery } from '@tanstack/react-query';
import { getShops } from '../api/shops';
import type { GetProductsOptions, Shop } from '../types';
import styles from './ShopsPage.module.css';

import { useEffect, useState } from 'react';
import ShopList from '../componnets/ShopList/ShopList';
import SortPanel from '../componnets/SortPanel/SortPanel';
import ProductsGallery from '../componnets/ProductsGallery/ProductsGallery';
import Loader from '../componnets/Loader/Loader';

export default function ShopsPage() {
  const { data: shops = [], isLoading } = useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: getShops,
    staleTime: 60_000,
  });

  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [sortOptions, setSortOptions] = useState<GetProductsOptions>({
    sort: 'date',
    order: 'desc',
  });

  useEffect(() => {
    if (shops.length > 0 && !selectedShopId) {
      setSelectedShopId(shops[0]._id);
    }
  }, [shops, selectedShopId]);

  const selectedShop = shops.find((s) => s._id === selectedShopId) ?? null;

  const handleSortChange = (sort: 'price' | 'date') => {
    setSortOptions((prev) => ({
      ...prev,
      sort,
    }));
  };

  const toggleOrder = () => {
    setSortOptions((prev) => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  if(isLoading) return <Loader/>
  return (
    <div className={`container ${styles.page}`}>
      <aside className={styles.sidebar}>
        <ShopList
          shops={shops}
          loading={isLoading}
          selectedId={selectedShopId ?? undefined}
          onSelect={(id: string) => setSelectedShopId(id)}
        />
      </aside>

      <main className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>{selectedShop?.name ?? 'Select a shop'}</h1>
            {selectedShop && (
              <p className={styles.address}>{selectedShop.address}</p>
            )}
          </div>

          {selectedShop && (
            <SortPanel
              sortOptions={{
                sort: sortOptions.sort || 'date',
                order: sortOptions.order || 'desc',
              }}
              onSortChange={handleSortChange}
              onOrderToggle={toggleOrder}
            />
          )}
        </div>

        <ProductsGallery
          shopId={selectedShopId ?? ''}
          shopName={selectedShop?.name}
          sortOptions={sortOptions}
        />
      </main>
    </div>
  );
}
