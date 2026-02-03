import { forwardRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./Select.module.css";

const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      placeholder = "Select an option",
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`${styles.selectGroup} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            className={`${styles.select} ${error ? styles.error : ""}`}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className={styles.icon} />
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
