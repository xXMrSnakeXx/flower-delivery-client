import { CircleLoader } from 'react-spinners';
import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loader}>
      <CircleLoader color="#0ea5e9" size={150} />
    </div>
  );
}
