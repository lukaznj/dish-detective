import React from "react";
import styles from "./PancakeStackLoader.module.css";

const PancakeStackLoader: React.FC = () => {
  return (
    <div className={styles["loader-container"]}>
      <div className={styles.loader}>
        <div className={styles["tall-stack"]}>
          <div
            className={`${styles.butter} ${styles["falling-element"]}`}
          ></div>
          <div
            className={`${styles.pancake} ${styles["falling-element"]}`}
          ></div>
          <div
            className={`${styles.pancake} ${styles["falling-element"]}`}
          ></div>
          <div
            className={`${styles.pancake} ${styles["falling-element"]}`}
          ></div>
          <div
            className={`${styles.pancake} ${styles["falling-element"]}`}
          ></div>
          <div
            className={`${styles.pancake} ${styles["falling-element"]}`}
          ></div>
          <div
            className={`${styles.pancake} ${styles["falling-element"]}`}
          ></div>
          <div className={styles.plate}>
            <div className={styles["plate-bottom"]}></div>
            <div className={styles.shadow}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PancakeStackLoader;
