import styles from "./Button.module.css";
import Loader from "./Loader";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  type = "button",
  onClick,
  className = "",
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader size="small" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className={styles.icon} />}
          <span>{children}</span>
          {Icon && iconPosition === "right" && <Icon className={styles.icon} />}
        </>
      )}
    </button>
  );
};

export default Button;
