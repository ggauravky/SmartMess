import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./StarRating.module.css";

const StarRating = ({
  rating = 0,
  onChange,
  readonly = false,
  size = "medium",
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${readonly ? styles.readonly : ""}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            {star <= displayRating ? (
              <FaStar className={styles.filled} />
            ) : (
              <FaRegStar className={styles.empty} />
            )}
          </button>
        ))}
      </div>
      {showValue && <span className={styles.value}>{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
