import styles from "./EmptyState.module.css";

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className={styles.emptyState}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;
