import { useEffect, useRef } from 'react';
import { useFormik, type FormikTouched } from 'formik';
import * as Yup from 'yup';
import styles from './OrderForm.module.css';
import type { CartItem } from '../../store/cartStore';
import { useCustomerStore } from '../../store/customerStore';
import { formatPrice } from '../../utils/priceHelpers';
import { formatPhoneNumber } from '../../utils/formatCustomerNumber';

type OrderFormValues = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
  };
};

type OrderFormProps = {
  onSubmit: (data: {
    name?: string;
    email: string;
    phone: string;
    address: string;
    shopId: string | string[];
    items: { productId: string; qty: number }[];
    customerTimezone: string;
  }) => void;
  isSubmitting: boolean;
  items: CartItem[];
  totalPrice: number;
};

const normalizeEmail = (v: string) => v.trim().toLowerCase();
const normalizePhone = (v: string) =>
  v
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .trim();
const normalizeName = (v: string) => v.trim();
const normalizeAddress = (v: string) => v.trim();



const PHONE_REGEX =
  /^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{2}[- ]?\d{2}$/;
const ADDRESS_REGEX = new RegExp("^[\\p{L}0-9\\s.,'’\\-()]{5,200}$", 'u');
const NAME_REGEX = new RegExp("^[\\p{L}\\s'’\\-]{2,100}$", 'u');

const validationSchema = Yup.object().shape({
  customer: Yup.object().shape({
    name: Yup.string()
      .trim()
      .matches(NAME_REGEX, "Enter a valid name (letters, spaces, -')")
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .trim()
      .matches(
        PHONE_REGEX,
        'Enter a valid phone number (e.g., 063 123 45 67)'
      )
      .required('Phone is required'),
  }),
  delivery: Yup.object().shape({
    address: Yup.string()
      .trim()
      .matches(ADDRESS_REGEX, 'Enter a valid address (5–200 chars)')
      .required('Address is required'),
  }),
});

export default function OrderForm({
  onSubmit,
  isSubmitting,
  items,
  totalPrice,
}: OrderFormProps) {
  const customer = useCustomerStore((s) => s.customer);
  const hasHydrated = useCustomerStore((s) => s.hasHydrated);

  const didPrefillRef = useRef(false);

  const formik = useFormik<OrderFormValues>({
    initialValues: {
      customer: { name: '', email: '', phone: '' },
      delivery: { address: '' },
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      const shopIds = Array.from(
        new Set(items.map((it) => it.shopId).filter(Boolean))
      ) as string[];
      const shopId = shopIds.length === 1 ? shopIds[0] : shopIds;

      const customerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      onSubmit({
        name: normalizeName(values.customer.name),
        email: normalizeEmail(values.customer.email),
        phone: normalizePhone(values.customer.phone),
        address: normalizeAddress(values.delivery.address),
        shopId,
        items: items.map((it) => ({ productId: it.productId, qty: it.qty })),
        customerTimezone,
      });
    },
  });

  useEffect(() => {
    if (!hasHydrated || !customer || didPrefillRef.current) return;

    const newValues: OrderFormValues = {
      customer: {
        name: customer.name?.trim() ?? '',
        email: customer.email?.trim().toLowerCase() ?? '',
        phone: customer.phone ? formatPhoneNumber(customer.phone) : '',
      },
      delivery: {
        address: customer.defaultAddress?.trim() ?? '',
      },
    };

    formik.setValues(newValues);

    const touched: FormikTouched<OrderFormValues> = {
      customer: {
        name: true,
        email: true,
        phone: true,
      },
      delivery: {
        address: true,
      },
    };
    formik.setTouched(touched, false);

    didPrefillRef.current = true;
  }, [hasHydrated, customer, formik]);

  const nameProps = formik.getFieldProps('customer.name');
  const emailProps = formik.getFieldProps('customer.email');
  const addressProps = formik.getFieldProps('delivery.address');

  const isSubmitDisabled =
    isSubmitting ||
    items.length === 0 ||
    (!formik.isValid && !didPrefillRef.current) ||
    (!formik.isValid &&
      (!formik.values.customer.name ||
        !formik.values.customer.email ||
        !formik.values.customer.phone ||
        !formik.values.delivery.address));

  return (
    <form
      className={styles.orderForm}
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <h2>Delivery Information</h2>

      <div className={styles.formGroup}>
        <label htmlFor="customer.name">Name *</label>
        <input
          id="customer.name"
          {...nameProps}
          onBlur={(e) => {
            formik.handleBlur(e);
            const norm = normalizeName((e.target as HTMLInputElement).value);
            formik.setFieldValue('customer.name', norm, false);
          }}
          placeholder="Full name"
          maxLength={100}
          className={
            formik.touched.customer?.name && formik.errors.customer?.name
              ? styles.errorInput
              : ''
          }
          aria-invalid={
            !!(formik.touched.customer?.name && formik.errors.customer?.name)
          }
        />
        {formik.touched.customer?.name && formik.errors.customer?.name && (
          <div className={styles.error}>{formik.errors.customer.name}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="customer.email">Email *</label>
        <input
          id="customer.email"
          type="email"
          {...emailProps}
          onBlur={(e) => {
            formik.handleBlur(e);
            const norm = normalizeEmail((e.target as HTMLInputElement).value);
            formik.setFieldValue('customer.email', norm, false);
          }}
          placeholder="example@email.com"
          className={
            formik.touched.customer?.email && formik.errors.customer?.email
              ? styles.errorInput
              : ''
          }
          autoComplete="email"
        />
        {formik.touched.customer?.email && formik.errors.customer?.email && (
          <div className={styles.error}>{formik.errors.customer.email}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="customer.phone">Phone Number *</label>
        <input
          id="customer.phone"
          type="tel"
          value={formik.values.customer.phone}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            formik.setFieldValue('customer.phone', formatted, false);
          }}
          onBlur={(e) => {
            formik.handleBlur(e);
            const norm = normalizePhone((e.target as HTMLInputElement).value);
            formik.setFieldValue('customer.phone', norm, false);
          }}
          placeholder="063 123 45 67"
          className={
            formik.touched.customer?.phone && formik.errors.customer?.phone
              ? styles.errorInput
              : ''
          }
          inputMode="tel"
          maxLength={20}
          autoComplete="tel"
        />
        {formik.touched.customer?.phone && formik.errors.customer?.phone && (
          <div className={styles.error}>{formik.errors.customer.phone}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="delivery.address">Delivery Address *</label>
        <input
          id="delivery.address"
          type="text"
          {...addressProps}
          onBlur={(e) => {
            formik.handleBlur(e);
            const norm = normalizeAddress((e.target as HTMLInputElement).value);
            formik.setFieldValue('delivery.address', norm, false);
          }}
          placeholder="Street, City"
          className={
            formik.touched.delivery?.address && formik.errors.delivery?.address
              ? styles.errorInput
              : ''
          }
          maxLength={200}
          autoComplete="street-address"
        />
        {formik.touched.delivery?.address &&
          formik.errors.delivery?.address && (
            <div className={styles.error}>{formik.errors.delivery.address}</div>
          )}
      </div>

      <div className={styles.orderSummary}>
        <div className={styles.orderTotal}>
          <span>Total:</span>
          <span className={styles.totalAmount}>
            {formatPrice(totalPrice)} UAH
          </span>
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitDisabled}
      >
        {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
      </button>

      <div className={styles.requiredHint}>* Required fields</div>
    </form>
  );
}
