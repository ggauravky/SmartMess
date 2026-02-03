import { forwardRef } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(
  (
    { label, type = "text", error, icon: Icon, className = "", ...props },
    ref,
  ) => {
    return (
      <div className={`${styles.inputGroup} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          {Icon && <Icon className={styles.icon} />}
          <input
            ref={ref}
            type={type}
            className={`${styles.input} ${Icon ? styles.withIcon : ""} ${error ? styles.error : ""}`}
            {...props}
          />
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
