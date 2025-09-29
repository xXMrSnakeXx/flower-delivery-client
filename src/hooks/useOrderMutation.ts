import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { useCartStore } from '../store/cartStore';
import { useCustomerStore } from '../store/customerStore';
import type { CreateOrderResponse, OrderPayload } from '../types';

export function useOrderMutation() {
  const navigate = useNavigate();
  const clear = useCartStore((s) => s.clear);
  const setCustomer = useCustomerStore((s) => s.setCustomer);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation<CreateOrderResponse, Error, OrderPayload>({
    mutationFn: (payload) => createOrder(payload),
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: (data, variables) => {
      setCustomer({
        name: variables.name,
        email: variables.email,
        phone: variables.phone,
        defaultAddress: variables.address,
      });

      const allOrderIds = data.orderIds;

      if (allOrderIds.length > 0) {
        clear();
        navigate(`/order`, {
          state: { orderIds: allOrderIds },
        });
      } else {
        clear();
        navigate('/');
      }
    },
    onError: (err: Error) => {
      console.error('Order creation failed', err.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmitOrder = (
    orderData: OrderPayload & { customerTimezone: string }
  ) => {
    mutation.mutate(orderData);
  };

  return {
    handleSubmitOrder,
    isSubmitting: isSubmitting || mutation.isPending,
  };
}
