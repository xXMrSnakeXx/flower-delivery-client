import { useEffect, useState } from 'react';
import { useCustomerStore } from '../store/customerStore';

interface UsePrefillReturn {
  showPrompt: boolean;
  showModal: boolean;
  handlePromptYes: () => void;
  handlePromptNo: () => void;
  closeModal: () => void;
}

export function usePrefill(): UsePrefillReturn {
  const customer = useCustomerStore((s) => s.customer);
  const hasHydrated = useCustomerStore((s) => s.hasHydrated);

  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!customer) {
      const t = window.setTimeout(() => setShowPrompt(true), 300);
      return () => clearTimeout(t);
    }
    setShowPrompt(false);
  }, [hasHydrated, customer]);

  const handlePromptYes = (): void => {
    setShowPrompt(false);
    setShowModal(true);
  };

  const handlePromptNo = (): void => setShowPrompt(false);
  const closeModal = (): void => setShowModal(false);

  return {
    showPrompt,
    showModal,
    handlePromptYes,
    handlePromptNo,
    closeModal,
  };
}
