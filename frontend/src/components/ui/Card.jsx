import styles from "./Card.module.css";

const Card = ({
  children,
  className = "",
  padding = "medium",
  hover = false,
  onClick,
  ...props
}) => {
  const classNames = [
    styles.card,
    styles[padding],
    hover && styles.hover,
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
