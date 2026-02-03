import { forwardRef } from "react";
import styles from "./Textarea.module.css";

const Textarea = forwardRef(
  ({ label, error, className = "", maxLength, value = "", ...props }, ref) => {
    return (
      <div className={`${styles.textareaGroup} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea
          ref={ref}
          className={`${styles.textarea} ${error ? styles.error : ""}`}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className={styles.footer}>
          {error && <span className={styles.errorText}>{error}</span>}
          {maxLength && (
            <span className={styles.charCount}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
