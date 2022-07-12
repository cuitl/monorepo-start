import logo from '../logo.svg';
import styles from './welcome.module.scss';

export default function Welcome() {
  return (
    <h1 className={styles.welcome}>
      Welcome to react ui
      <img src={logo} alt="logo" />
    </h1>
  );
}
