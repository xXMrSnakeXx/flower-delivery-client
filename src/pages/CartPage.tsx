import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';
import OrderForm from '../componnets/OrderForm/OrderForm';

import { IoIosArrowRoundBack } from 'react-icons/io';
import PrefillPrompt from '../componnets/PrefillPrompt/PrefillPrompt';
import PrefillModal from '../componnets/PrefillModal/PrefillModal';
import { useCartData } from '../hooks/useCartData';
import { usePrefill } from '../hooks/usePrefill';
import { useOrderMutation } from '../hooks/useOrderMutation';
import EmptyCart from '../componnets/EmptyCart/EmptyCart';
import ItemsSection from '../componnets/ItemsSection/ItemsSection';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalPrice, groupedItems, isEmpty } = useCartData();
  const { showPrompt, showModal, handlePromptYes, handlePromptNo, closeModal } =
    usePrefill();
  const { handleSubmitOrder, isSubmitting } = useOrderMutation();

  if (isEmpty) {
    return <EmptyCart onContinueShopping={() => navigate('/')} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <IoIosArrowRoundBack size={20} /> Back to Shops
          </button>
          <h1>Shopping Cart</h1>
        </div>
      </div>

      <div className={styles.cartContent}>
        <div className={styles.formSection}>
          <OrderForm
            onSubmit={handleSubmitOrder}
            isSubmitting={isSubmitting}
            totalPrice={totalPrice}
            items={items}
          />
        </div>

        <ItemsSection
          items={items}
          groupedItems={groupedItems}
          totalPrice={totalPrice}
        />
      </div>

      {showPrompt && (
        <PrefillPrompt onYes={handlePromptYes} onNo={handlePromptNo} />
      )}
      {showModal && <PrefillModal onClose={closeModal} />}
    </div>
  );
}
