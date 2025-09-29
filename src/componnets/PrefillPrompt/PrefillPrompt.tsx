import styles from './PrefillPrompt.module.css';

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export default function PrefillPrompt({ onYes, onNo }: Props) {
  return (
    <div className={styles.root} role="dialog" aria-live="polite">
      <div className={styles.box}>
        <div className={styles.text}>Have you ordered with us before?</div>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={onYes}>
            Yes
          </button>
          <button className={styles.ghost} onClick={onNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
