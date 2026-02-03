import styles from "./Badge.module.css";

const Badge = ({
  children,
  variant = "default",
  size = "medium",
  className = "",
}) => {
  const classNames = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{children}</span>;
};

export default Badge;
