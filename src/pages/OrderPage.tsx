import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrdersBulkInfo } from '../api/orders';
import { useEffect, useMemo } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import styles from './OrderPage.module.css';

import OrderCard from '../componnets/OrderCard/OrderCard';
import DeliveryInfo from '../componnets/DeliveryInfo/DeliveryInfo';
import GrandTotal from '../componnets/GrandTotal/GrandTotal';
import Loader from '../componnets/Loader/Loader';
import Text from '../componnets/Text/Text';

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderIds = useMemo(
    () => location.state?.orderIds || [],
    [location.state]
  );

  useEffect(() => {
    if (orderIds.length === 0) {
      navigate('/', { replace: true });
    }
  }, [orderIds, navigate]);

  const {
    data: ordersInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders', orderIds],
    queryFn: () => getOrdersBulkInfo(orderIds),
    enabled: orderIds.length > 0,
  });

  if (orderIds.length === 0) {
    return null;
  }

  if (isLoading)
    return <Loader/>;
  if (error) return <Text>Error loading orders</Text>;

  const firstOrder = ordersInfo?.orders[0];

  return (
    <div className={styles.orderPage}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <IoIosArrowRoundBack size={20} /> Back to Shops
      </button>

      <div className={styles.orderContainer}>
        <h1 className={styles.pageTitle}>Order Information</h1>
        <p className={styles.thankYou}>
          Thank you for your order! We'll contact you soon to confirm delivery
          details.
        </p>

        <div className={styles.orderDetails}>
          {ordersInfo?.orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}

          {firstOrder && (
            <DeliveryInfo
              deliveryAddress={firstOrder.delivery?.address}
              createdAt={firstOrder.createdAt}
              customerTimeZone={firstOrder.customerTimeZone}
            />
          )}

          {ordersInfo &&
            ordersInfo.orders.length > 1 &&
            ordersInfo.grandTotalCents && (
              <GrandTotal grandTotalCents={ordersInfo.grandTotalCents} />
            )}
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
