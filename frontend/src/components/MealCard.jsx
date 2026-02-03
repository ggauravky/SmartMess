import { useNavigate } from "react-router-dom";
import { FiClock, FiStar } from "react-icons/fi";
import Card from "./ui/Card";
import StarRating from "./ui/StarRating";
import Button from "./ui/Button";
import styles from "./MealCard.module.css";

const mealIcons = {
  breakfast: "🌅",
  lunch: "☀️",
  snacks: "🍪",
  dinner: "🌙",
};

const mealTimes = {
  breakfast: "7:30 AM - 9:30 AM",
  lunch: "12:00 PM - 2:00 PM",
  snacks: "4:30 PM - 5:30 PM",
  dinner: "7:30 PM - 9:30 PM",
};

const MealCard = ({
  menu,
  mealType,
  items = [],
  averageRating = 0,
  userRating = null,
}) => {
  const navigate = useNavigate();

  const handleRateClick = () => {
    // Use menu date or 'today' as the identifier
    const menuIdentifier = menu?.date || "today";
    navigate(`/rate-meal/${menuIdentifier}/${mealType}`);
  };

  return (
    <Card className={styles.card} hover>
      <div className={styles.header}>
        <div className={styles.mealInfo}>
          <span className={styles.icon}>{mealIcons[mealType]}</span>
          <div>
            <h3 className={styles.title}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h3>
            <p className={styles.time}>
              <FiClock /> {mealTimes[mealType]}
            </p>
          </div>
        </div>
        <div className={styles.rating}>
          <StarRating rating={averageRating} readonly size="small" />
          <span className={styles.ratingValue}>{averageRating.toFixed(1)}</span>
        </div>
      </div>

      <div className={styles.items}>
        {items && items.length > 0 ? (
          <ul className={styles.itemList}>
            {items.map((item, index) => (
              <li key={index} className={styles.item}>
                <span className={styles.dot}></span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noItems}>Menu not available</p>
        )}
      </div>

      <div className={styles.footer}>
        {userRating ? (
          <div className={styles.userRating}>
            <FiStar className={styles.ratedIcon} />
            <span>You rated: {userRating}/5</span>
          </div>
        ) : (
          <Button
            variant="primary"
            size="small"
            onClick={handleRateClick}
            disabled={!items || items.length === 0}
          >
            Rate this meal
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MealCard;
