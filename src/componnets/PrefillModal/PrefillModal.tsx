import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCustomerStore } from '../../store/customerStore';
import styles from './PrefillModal.module.css';
import { prefillCustomer } from '../../api/customers';
import { IoIosClose } from 'react-icons/io';

type Props = {
  onClose: () => void;
};

const PHONE_REGEX = /^\+?[0-9()\s-]{7,20}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .trim()
    .matches(
      PHONE_REGEX,
      'Phone must be 7–20 digits, may contain +, (), spaces, -'
    )
    .required('Phone is required'),
});

type FormValues = {
  email: string;
  phone: string;
};

export default function PrefillModal({ onClose }: Props) {
  const replaceCustomer = useCustomerStore((s) => s.replaceCustomer);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      phone: '',
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const normEmail = values.email.trim().toLowerCase();
        const normPhone = values.phone
          .replace(/\s+/g, '')
          .replace(/-/g, '')
          .trim();

        const data = await prefillCustomer(normEmail, normPhone);

        if (!data) {
          setStatus('No data found for this email/phone number.');
          setSubmitting(false);
          return;
        }

        replaceCustomer({
          name: data.name ?? null,
          email: data.email,
          phone: data.phone,
          defaultAddress: data.defaultAddress ?? null,
          lastSeenAt: data.lastSeenAt ?? null,
          createdAt: data.createdAt ?? null,
          updatedAt: data.updatedAt ?? null,
        });

        onClose();
      } catch {
        setStatus('Network error. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const normalizeEmail = (v: string) => v.trim().toLowerCase();
  const normalizePhone = (v: string) =>
    v.replace(/\s+/g, '').replace(/-/g, '').trim();

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prefill-modal-title"
      >
        <div className={styles.header}>
          <h3 id="prefill-modal-title" className={styles.title}>
            Welcome Back!
          </h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <IoIosClose />
          </button>
        </div>

        <p className={styles.description}>
          Please enter the email and phone number from your previous order.
        </p>

        <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="prefill-email" className={styles.label}>
              Email *
            </label>
            <input
              id="prefill-email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                const normalized = normalizeEmail(e.target.value);
                formik.setFieldValue('email', normalized);
              }}
              disabled={formik.isSubmitting}
              placeholder="your@email.com"
              className={
                formik.touched.email && formik.errors.email
                  ? `${styles.input} ${styles.errorInput}`
                  : styles.input
              }
              aria-invalid={!!(formik.touched.email && formik.errors.email)}
            />
            {formik.touched.email && formik.errors.email && (
              <div className={styles.fieldError}>{formik.errors.email}</div>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="prefill-phone" className={styles.label}>
              Phone *
            </label>
            <input
              id="prefill-phone"
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^0-9+\s\-()]/g, '');
                formik.setFieldValue('phone', filtered);
              }}
              onBlur={(e) => {
                formik.handleBlur(e);
                const normalized = normalizePhone(e.target.value);
                formik.setFieldValue('phone', normalized);
              }}
              disabled={formik.isSubmitting}
              placeholder="+1 234 567 8900"
              className={
                formik.touched.phone && formik.errors.phone
                  ? `${styles.input} ${styles.errorInput}`
                  : styles.input
              }
              aria-invalid={!!(formik.touched.phone && formik.errors.phone)}
              maxLength={20}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className={styles.fieldError}>{formik.errors.phone}</div>
            )}
          </div>

          {formik.status && (
            <div className={styles.error} role="alert">
              {formik.status}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting
                ? 'Loading your details...'
                : 'Load My Details'}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
