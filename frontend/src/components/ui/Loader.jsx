import styles from "./Loader.module.css";

const Loader = ({ fullScreen = false, size = "medium" }) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={`${styles.spinner} ${styles[size]}`}>
          <div className={styles.bounce1}></div>
          <div className={styles.bounce2}></div>
          <div className={styles.bounce3}></div>
        </div>
        <p className={styles.text}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.bounce1}></div>
      <div className={styles.bounce2}></div>
      <div className={styles.bounce3}></div>
    </div>
  );
};

export default Loader;
